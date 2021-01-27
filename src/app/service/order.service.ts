import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Artical, BigOrder, Order, OrderStatus } from '../model/order';
import { Product } from '../model/product';
import { User } from '../model/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  //Url for retriving ids
  private static ORDER_ID_URL = 'orderID';
  private static BIG_ORDER_ID_URL = 'bigOrderID';

  //Url for retriving all orders
  private static ORDERS_URL = 'orders';
  private static BIG_ORDERS_URL = 'bigOrders';

  //Url for retriving cart data
  private static ORDER_TO_PROCES_URL = 'orderProcess';
  private static CART_URL = 'cart';

  // ID for initializing orders
  private static ORDER_ID = 0;
  private static BIG_ORDER_ID = 0;

  userSubscription: Subscription;

  allOrders: Order[] = [];             // contains order for all vendors
  allBigOrders: BigOrder[] = [];

  orderToProcess: Order = null;

  myCart: BigOrder = null;

  cart: BehaviorSubject<BigOrder> = new BehaviorSubject(null);

  constructor(private authService: AuthService) {
    this.initOrderIDs();
    this.initOrders();
    this.initBigOrders();
    this.initCart();
    this.initOrderToProcess();

    this.userSubscription = authService.user.subscribe(user => {
      if(user === null || user.myProduct !== undefined) {
        return;
      }

      console.log('Ulogovan kao kupac menjaj korpu. ' + user.username);

      if(this.myCart !== null && this.myCart.customerId === user.username)
        return;

      if( this.myCart === null || (this.myCart.customerId !== '' && this.myCart.customerId !== user.username)) {
        this.resetCart();
      }

      this.myCart.customerId = user.username;
      localStorage.setItem(OrderService.CART_URL, JSON.stringify(this.myCart));
      this.cart.next(this.myCart);

    });
  }

  makeNewOrder(){
    // Take all orders from hashMap and push into allOrders
    for (let key of Object.keys(this.myCart.orders)) {
      let order = this.myCart.orders[key];
      order.orderDate = new Date(Date.now());
      this.allOrders.push(order);
    }
    localStorage.setItem(OrderService.ORDERS_URL, JSON.stringify(this.allOrders));

    this.allBigOrders.push(this.myCart);
    localStorage.setItem(OrderService.BIG_ORDERS_URL, JSON.stringify(this.allBigOrders));

    this.resetCart();
    this.myCart.customerId = this.authService.user.value.username;
    this.cart.next(this.myCart);
  }

  addToCart(p: Product, count: number){
    const moneySum = p.price * count;

    let order = this.findExistingOrder(p);

    this.updateArticalTotalCount(order, p, count);

    this.myCart.total_cost += moneySum;
    order.total_cost += moneySum;
    localStorage.setItem(OrderService.CART_URL, JSON.stringify(this.myCart));
    this.cart.next(this.myCart);
  }

  private findExistingOrder(p:Product): Order{
    let order;
    if(this.myCart.orders[p.userId] === undefined){
      order = this.createNewOrder();
      this.myCart.orders[p.userId] = order;
    } else {
      order = this.myCart.orders[p.userId];
    }
    return order;
  }

  private updateArticalTotalCount(order: Order, product: Product, count: number ){
    const art = order.items.find(art => art.product.id === product.id);

    if(art !== undefined){
      art.number_of_pieces += count;
    }
    else {
      order.items.push({product: product, number_of_pieces: count});
    }

    order.total_items += count;
    this.myCart.total_items += count;
  }

  processThisOrder(o: Order){
    for(let index = 0; index < this.allOrders.length; index++){
      if(o.id === this.allOrders[index].id){
        this.allOrders[index] = o;
        localStorage.setItem(OrderService.ORDERS_URL, JSON.stringify(this.allOrders));
        break;
      }
    }

    for(let index = 0; index < this.allBigOrders.length; index++){
      if(this.allBigOrders[index].id === o.bigOrderID){
        console.log('Pronasli smo bigOrder: ' + o.bigOrderID);

        if(this.allBigOrders[index].status.value === OrderStatus.NOT_PROCESSED.value){    // Potrebno je updejtovati bigOrder

          let status = OrderStatus.APPROVED;
          for(let key of Object.keys(this.allBigOrders[index].orders)){

            if(this.allBigOrders[index].orders[key].id === o.id){
              console.log('Pronasli smo order koji je azuriran ' + o.id);

              this.allBigOrders[index].orders[key].status = o.status;

              if(o.status.value === OrderStatus.DENIED.value){
                this.allBigOrders[index].status = OrderStatus.DENIED;
                status = OrderStatus.DENIED;
                break;
              }
            }

            if(status.value === OrderStatus.NOT_PROCESSED.value)
              continue;

            if(this.allBigOrders[index].orders[key].status.value === OrderStatus.NOT_PROCESSED.value){
              status = OrderStatus.NOT_PROCESSED;
            }

          }

          if(status.value !== OrderStatus.NOT_PROCESSED.value){
            this.allBigOrders[index].status = status;
            localStorage.setItem(OrderService.BIG_ORDERS_URL, JSON.stringify(this.allBigOrders));
          }
        }

        return;
      }
    }
  }

  removeFromCart(product: Product){
    if(this.myCart.orders[product.userId] === undefined){
      return;
    }

    const articals = this.myCart.orders[product.userId].items;
    for (let index = 0; index < articals.length; index++) {
      const element = articals[index];
      if(element.product.id === product.id){
        // Update price
        this.myCart.orders[product.userId].total_cost -= element.number_of_pieces * element.product.price;
        this.myCart.total_cost -= element.number_of_pieces * element.product.price;
        // Update items count
        this.myCart.orders[product.userId].total_items -= element.number_of_pieces;
        this.myCart.total_items -= element.number_of_pieces;

        articals.splice(index, 1);

        if(this.myCart.orders[product.userId].total_items === 0){
          delete this.myCart.orders[product.userId];
        }

        localStorage.setItem(OrderService.CART_URL, JSON.stringify(this.myCart));
        this.cart.next(this.myCart);
        return;
      }
    }
  }

  processOrder(order: Order){
    this.orderToProcess = order;
    localStorage.setItem(OrderService.ORDER_TO_PROCES_URL, JSON.stringify(this.orderToProcess));
  }

  getOrderToProcess(){
    return this.orderToProcess;
  }

  getMyOrders(){
    const username = this.authService.user.value.username;
    return this.allBigOrders.filter(big => {
      return big.customerId === username;
    });
  }

  getVendorOrders(){
    const username = this.authService.user.value.username;

    let totalEarning = 0, totalSells = 0, notProcessed = 0;
    const orders = this.allOrders.filter(order => {
      if(order.items[0].product.userId === username){
        if(order.status.value === OrderStatus.NOT_PROCESSED.value){
          notProcessed++;
        }
        else if(order.status.value === OrderStatus.DELIVERED.value){
          totalSells++;
          totalEarning += order.total_cost;
        }

        return true;
      }
      return false;
    });

    return {
      orders: orders,
      totalEarning: totalEarning,
      totalSells: totalSells,
      notProcessed: notProcessed
    }
  }

  private createNewOrder(){
    return new Order(
      this.nextOrderID(),
      this.myCart.id,
      null,
      0,
      [],
      OrderStatus.NOT_PROCESSED,
      0
    );
  }

  private nextOrderID(){
    localStorage.setItem(OrderService.ORDER_ID_URL, '' + ++OrderService.ORDER_ID);
    return OrderService.ORDER_ID - 1;
  }
  private nextBigOrderID(){
    localStorage.setItem(OrderService.BIG_ORDER_ID_URL, '' + ++OrderService.BIG_ORDER_ID);
    return OrderService.BIG_ORDER_ID - 1;
  }

  //----------------- INIT SECTION--------------------
  private initOrderIDs(){
    let temp = +JSON.parse(localStorage.getItem(OrderService.ORDER_ID_URL));
    if(temp !== null){
      OrderService.ORDER_ID = temp;
    }
    temp = +JSON.parse(localStorage.getItem(OrderService.BIG_ORDER_ID_URL));
    if(temp !== null){
      OrderService.BIG_ORDER_ID = temp;
    }
  }
  private initOrders(){
    const temp = JSON.parse(localStorage.getItem(OrderService.ORDERS_URL));
    if(temp !== null){
      this.allOrders = temp;
    }
  }
  private initBigOrders(){
    const temp = JSON.parse(localStorage.getItem(OrderService.BIG_ORDERS_URL));
    if(temp !== null){
      this.allBigOrders = temp;
    }
  }
  private initOrderToProcess(){
    const temp = JSON.parse(localStorage.getItem(OrderService.ORDER_TO_PROCES_URL));
    if(temp !== null){
      this.orderToProcess = temp;
    }
  }

  private initCart(){
    let temp = JSON.parse(localStorage.getItem(OrderService.CART_URL));
    if(temp !== null){
      this.myCart = temp;
    } else {
      this.resetCart();
    }
    this.cart.next(this.myCart);
  }

  private resetCart(){
    this.myCart = new BigOrder(
      this.nextBigOrderID(),
      '',
      0,
      OrderStatus.NOT_PROCESSED,
      0,
      {}
    );
    localStorage.setItem(OrderService.CART_URL, JSON.stringify(this.myCart));
  }

}
