import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { User } from 'src/app/model/user';
import { BigOrder } from '../../../model/order';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User = null;

  cart: BigOrder = null;
  toPay: number = 0;
  cartSubscription: Subscription;
  authSubscription: Subscription;
  items: MenuItem[];

  constructor(
    private ordersService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.items = [
      {
          label: 'Nalog',
          icon: 'pi pi-fw pi-user',
          routerLink: '/main/user'
      },
      {
          label: 'Odjavi se',
          icon: 'pi pi-fw pi-power-off',
          command: () => {this.authService.logout();},
          routerLink: '/auth/sign-in'
      }
    ];

    this.cartSubscription = this.ordersService.cart.subscribe(cart => {
      this.cart = cart;
      if(cart === null){
        this.toPay = 0;
      } else {
        this.toPay = cart.total_cost;
      }
    });

    this.authSubscription = this.authService.user.subscribe(u => {
      if(u === null) return;
      this.user = u;
    })
  }

  ngOnDestroy(){
    this.cartSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
