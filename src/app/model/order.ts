import { Product } from './product';

export class OrderStatus{

  constructor(public value: string, public color: string){}

  public static NOT_PROCESSED: OrderStatus = new OrderStatus('Nije obrađeno','#f8b02b');
  public static APPROVED: OrderStatus = new OrderStatus('Prihvaćeno','#2196F3');
  public static DENIED: OrderStatus = new OrderStatus('Odbijeno','#ff9191');
  public static DELIVERED: OrderStatus = new OrderStatus('Dostavljeno','#1BA345');

}

export interface Artical{
  product: Product,
  number_of_pieces: number
}

// All items inside order must be from same vendro
export class Order{
  public deliveryDate? : Date;
  constructor(
    public id: number,
    public bigOrderID: number,
    public orderDate: Date,
    public total_cost: number,
    public items: Artical[],
    public status: OrderStatus,
    public total_items: number
  ){}
}

interface IHash {
  [key: string]: Order;
}

export class BigOrder{
  constructor(
    public id: number,
    public customerId: string,
    public total_cost: number,
    public status: OrderStatus,
    public total_items: number,
    public orders: IHash
  ){}
}
