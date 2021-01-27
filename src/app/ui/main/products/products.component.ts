import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';

interface Sort{
  name: String;
  code: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  original: Product[] = [];
  products: Product[] = [];
  productToDisplay: Product[] = [];
  numOfArt = 4;
  searchText: string = "";

  sortOptions: Sort[];
  selectedSortOption: Sort;

  constructor(
    private render: Renderer2,
    private router: Router,
    private productService: ProductService
  ) {
    this.sortOptions = [
      {name: "Naziv opadajuće", code: 0},
      {name: "Naziv rastuće", code: 1},
      {name: "Cena opadajuće", code: 2},
      {name: "Cena rastuće", code: 3},
    ]
  }

  ngOnInit(): void {
    this.original = this.productService.products;
    this.products = this.original;
    this.filterProducts(0);
  }

  onSearch(){
    console.log(this.searchText);
    if(this.searchText.length > 0){
      const searhLower = this.searchText.toLocaleLowerCase();
      this.products = this.original.filter(value => {
        return value.name.toLocaleLowerCase().includes(searhLower);
      })
    }
    else {
      this.products = this.original;
    }
    this.sortProducts()
    this.filterProducts(0);
  }

  private sortProducts(){
    if(this.selectedSortOption == null || this.selectedSortOption == undefined){
      return;
    }
    switch(this.selectedSortOption.code){
      case 0: // Naziv opadajuce
        this.products = this.products.sort((a,b)=>{
          if(a.name > b.name) return -1;
          else if(a.name === b.name) return 0;
          else return 1;
        });
        break;
      case 1: // Naziv rastuce
        this.products = this.products.sort((a,b)=>{
          if(a.name < b.name) return -1;
          else if(a.name === b.name) return 0;
          else return 1;
        });
        break;
      // this.products.sort
      case 2: // Cena opadajuce
        this.products = this.products.sort((a,b)=>{
          return b.price - a.price;
        });
        break;
      case 3: // Cena rastuce
        this.products = this.products.sort((a,b)=>{
          return a.price - b.price;
        });
        break;
      default:
        console.log('default');
    }
  }

  selectSort(){
    this.onSearch();
  }

  onProductDetail(product: Product) {
    this.productService.seeProductDetails(product);
    this.router.navigate(['main/products', product.id]);
  }

  paginate(e){
    this.filterProducts(e.first)
  }

  private filterProducts(start: number){
    this.productToDisplay = this.products.filter((value:Product, index: number)=>{
      if(index >= start && index < start + 15)
        return true;
      return false;
    })
  }


}
