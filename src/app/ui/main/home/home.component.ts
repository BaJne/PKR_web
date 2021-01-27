import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Order, OrderStatus } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  orders: Order[] = [];
  totalEarning = 0;
  totalSells = 0;
  notProcessed = 0;


  constructor(private orderService: OrderService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const data = this.orderService.getVendorOrders();

    this.orders = data.orders;
    this.totalEarning = data.totalEarning;
    this.totalSells = data.totalSells;
    this.notProcessed = data.notProcessed;
  }

  canModify(orderStatus : OrderStatus){
    return orderStatus.value === OrderStatus.NOT_PROCESSED.value;
  }
  process(o: Order){
    this.orderService.processOrder(o);
    this.router.navigate(['order'], {relativeTo: this.route});
  }

}
