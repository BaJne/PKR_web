import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from './ui/authentication/authentication.component';
import { SignInComponent } from './ui/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './ui/authentication/sign-up/sign-up.component';
import { SignInUserComponent } from './ui/authentication/sign-in-user/sign-in-user.component';
import { MainComponent } from './ui/main/main.component';
import { ProductsComponent } from './ui/main/products/products.component';
import { ProductDetailComponent } from './ui/main/product-detail/product-detail.component';
import { OrderComponent } from './ui/main/order/order.component';
import { CartComponent } from './ui/main/cart/cart.component';
import { NewProductComponent } from './ui/main/new-product/new-product.component';
import { HomeComponent } from './ui/main/home/home.component';
import { MyProductComponent } from './ui/main/my-product/my-product.component';
import { AuthGuard } from './auth-guard.service';
import { RegisterSuccessComponent } from './ui/authentication/register-success/register-success.component';
import { CustomerGuard } from './customer-guard.service';
import { VendorGuard } from './vendor-guard.service';
import { UserComponent } from './ui/main/user/user.component';
import { UserDataComponent } from './ui/main/user/user-data/user-data.component';
import { UserPasswordComponent } from './ui/main/user/user-password/user-password.component';
import { OrderProcessComponent } from './ui/main/order-process/order-process.component';

const routes: Routes = [

  {path: 'main', redirectTo: '/main/products', pathMatch: 'full'},
  {path: 'auth', redirectTo: '/auth/sign-in', pathMatch: 'full'},
  {path: 'main/user', redirectTo: '/main/user/details', pathMatch: 'full'},

  {path: 'main', component: MainComponent, canActivate: [AuthGuard], children:[
    {path: 'user', component: UserComponent, children: [
      {path: 'details', component: UserDataComponent},
      {path: 'change-password', component: UserPasswordComponent},
    ]},
    {path: 'products', component: ProductsComponent, canActivate: [CustomerGuard]},
    {path: 'products/:id', component: ProductDetailComponent, canActivate: [CustomerGuard]},
    {path: 'cart', component: CartComponent, canActivate: [CustomerGuard]},
    {path: 'orders', component: OrderComponent, canActivate: [CustomerGuard]},
    {path: 'new-product', component: NewProductComponent, canActivate: [VendorGuard]},
    {path: 'home', component: HomeComponent, canActivate: [VendorGuard]},
    {path: 'home/order', component: OrderProcessComponent, canActivate: [VendorGuard]},
    {path: 'my-products', component: MyProductComponent, canActivate: [VendorGuard]}
  ]},

  {path: 'auth', component: AuthenticationComponent, children: [
    {path: 'sign-in', component: SignInComponent},
    {path: 'sign-up', component: SignUpComponent},
    {path: 'sign-up/customer', component: SignInUserComponent},
    {path: 'sign-up/vendor', component: SignInUserComponent},
    {path: 'sign-up/200', component: RegisterSuccessComponent}
  ]},

  {path: '**', redirectTo: '/auth/sign-in'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
