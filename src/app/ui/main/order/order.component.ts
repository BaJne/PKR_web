import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BigOrder, Order } from 'src/app/model/order';
import { OrderService } from '../../../service/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  allOrders: BigOrder[] = [];
  vendorUsernames: string[][] = [];
  orders: Order[][] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.allOrders = this.orderService.getMyOrders();
    for(let big of this.allOrders){
      const keys = Object.keys(big.orders)
      this.vendorUsernames.push(keys);

      let temp_orders = [];
      for (let key of keys) {
        temp_orders.push(big.orders[key]);
      }
      this.orders.push(temp_orders);
    }

  }

}
