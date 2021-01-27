import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './ui/authentication/authentication.component';
import { MainComponent } from './ui/main/main.component';
import { SignInComponent } from './ui/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './ui/authentication/sign-up/sign-up.component';
import { SignInUserComponent } from './ui/authentication/sign-in-user/sign-in-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './ui/main/header/header.component';
import { ProductsComponent } from './ui/main/products/products.component';
import { ProductDetailComponent } from './ui/main/product-detail/product-detail.component';
import { LoadAnimationComponent } from './shared/components/load-animation/load-animation.component';
import { OrderComponent } from './ui/main/order/order.component';
import { CartComponent } from './ui/main/cart/cart.component';
import { UserComponent } from './ui/main/user/user.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InputNumberModule } from 'primeng/inputnumber';
import {AccordionModule} from 'primeng/accordion';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {ToastModule} from 'primeng/toast';
import { MyProductComponent } from './ui/main/my-product/my-product.component';
import { HomeComponent } from './ui/main/home/home.component';
import { NewProductComponent } from './ui/main/new-product/new-product.component';
import {SidebarModule} from 'primeng/sidebar';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { RegisterSuccessComponent } from './ui/authentication/register-success/register-success.component';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {FileUploadModule} from 'primeng/fileupload';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {SlideMenuModule} from 'primeng/slidemenu';
import { UserDataComponent } from './ui/main/user/user-data/user-data.component';
import { UserPasswordComponent } from './ui/main/user/user-password/user-password.component';
import { OrderProcessComponent } from './ui/main/order-process/order-process.component';
import {CalendarModule} from 'primeng/calendar';
import {PaginatorModule} from 'primeng/paginator';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    MainComponent,
    SignInComponent,
    SignUpComponent,
    SignInUserComponent,
    HeaderComponent,
    ProductsComponent,
    ProductDetailComponent,
    LoadAnimationComponent,
    OrderComponent,
    CartComponent,
    MyProductComponent,
    HomeComponent,
    NewProductComponent,
    RegisterSuccessComponent,
    UserComponent,
    UserDataComponent,
    UserPasswordComponent,
    OrderProcessComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberModule,
    HttpClientModule,
    FileUploadModule,
    AppRoutingModule,
    AccordionModule,
    TableModule,
    MessagesModule,
    TooltipModule,
    ToastModule,
    SidebarModule,
    MessageModule,
    ScrollPanelModule,
    InputTextModule,
    RippleModule,
    ConfirmPopupModule,
    SlideMenuModule,
    CalendarModule,
    PaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
