import { Component, OnInit } from '@angular/core';
import { Order, OrderStatus } from 'src/app/model/order';
import { OrderService } from '../../../service/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit {

  order: Order;
  value: Date = new Date(Date.now());
  minDate: Date = new Date(Date.now());
  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.order = this.orderService.getOrderToProcess();
    if(this.order === null)
      this.router.navigate(['main/home']);
  }

  accept(){
    this.order.status = OrderStatus.APPROVED;
    this.order.deliveryDate = this.value;
    this.orderService.processThisOrder(this.order);
  }

  deny(){
    this.order.status = OrderStatus.DENIED;
    this.orderService.processThisOrder(this.order);
  }

}
