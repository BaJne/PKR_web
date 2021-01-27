import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';
import { Router } from '@angular/router';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-my-product',
  templateUrl: './my-product.component.html',
  styleUrls: ['./my-product.component.css'],
  providers: [ConfirmationService]
})
export class MyProductComponent implements OnInit {
  products: Product[] = [];
  numOfEmptyStorageProducts = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private confirmService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  editProduct(product: Product){
    this.productService.editProduct(product);
    this.router.navigate(['/main/new-product'], { fragment: 'edit' })
  }

  makeNewProduct(){
    this.productService.getEmptyProduct();
    this.router.navigate(['/main/new-product']);
  }

  removeProduct(event, att){
    this.confirmService.confirm({
      target: event.target,
      message: 'Da li zaista želite da izbrišete proizvod?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Da',
      rejectLabel: 'Ne',
      accept: () => {
        this.productService.removeProduct(att);
        this.getProducts();
      }
    });
  }

  private getProducts(){
    const temp = this.productService.getProducts();
    this.products = temp.products;
    this.numOfEmptyStorageProducts = temp.empty;
  }
}
