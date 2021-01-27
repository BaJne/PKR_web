import { Component, OnInit, OnDestroy } from '@angular/core';
import { Artical, BigOrder, Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  cart: BigOrder = null;
  vendorUsernames: string[] = [];
  oldNumCount: number[][] = [];
  orders: Order[] = [];
  cartSubscription: Subscription;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.cartSubscription = this.orderService.cart.subscribe( cart => {
      this.cart = cart;
      this.orders = [];
      this.vendorUsernames = Object.keys(cart.orders);
      for (let key of this.vendorUsernames) {
        this.oldNumCount.push([]);
        for(let art of cart.orders[key].items){
          this.oldNumCount[this.oldNumCount.length-1].push(art.number_of_pieces);
        }
        this.orders.push(cart.orders[key]);
      }
    });
  }

  ngOnDestroy(){
    this.cartSubscription.unsubscribe();
  }

  update(att: Artical, index, column){
    const order = this.cart.orders[this.vendorUsernames[index]];

    console.log(this.oldNumCount[index][column]);
    let dif = att.number_of_pieces - this.oldNumCount[index][column];
    console.log(dif);

    if(dif > att.product.storage){
      dif = att.product.storage;
      att.number_of_pieces = this.oldNumCount[index][column] + dif;
    }

    order.total_items += dif;
    this.cart.total_items += dif;

    order.total_items += dif*att.product.price;
    this.cart.total_items += dif*att.product.price;

    this.oldNumCount[index][column] = att.number_of_pieces;
    att.product.storage += dif;

    this.orderService.cart.next(this.cart);
  }
  removeArticle(p: Product){
    this.orderService.removeFromCart(p);
  }
  makeNewOrder(){
    this.orderService.makeNewOrder();
  }

}
