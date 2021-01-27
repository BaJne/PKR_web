import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { Product } from '../../../model/product';
import { OrderService } from 'src/app/service/order.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit{

  product: Product = null;
  itemCount: number = 1;
  isLoading = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.product = this.productService.product;
    console.log(this.route.snapshot.params['id']);

    if(
      this.product === null ||
      +this.route.snapshot.params['id'] !== this.product.id
    ){
      this.productService.findProductDetails(+this.route.snapshot.params['id']);
      this.product = this.productService.product;
    }
  }



  addToCart(){
    if(this.product.storage < this.itemCount){
      return;
    }
    this.orderService.addToCart(this.product, this.itemCount);
    this.product.storage -= this.itemCount;
    this.productService.updateProductStorage(this.product);
    this.messageService.add(
      {
        severity:'success',
        summary:'Dodali ste novi proizvod',
        detail:this.product.name + ' x' + this.itemCount
      }
    );
    this.itemCount = 1;
  }

}
