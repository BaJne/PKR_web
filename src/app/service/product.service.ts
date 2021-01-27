import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public static PRODUCT_URL = 'products';
  public static EDIT_PRODUCT_URL = 'editProduct';
  public static ID_URL = 'productID';
  public static ID = 0;

  // Initial Database insertation
  // new Product(
  //   1,
  //   'Sumski med',
  //    256,
  //   'https://i0.wp.com/srpskimed.com/wp-content/uploads/2019/01/med_veliki_sum.jpg',
  //    2,
  //   'Bagremov med je odlično kardiotonično i neurotonično sredstvo. Ova vrsta meda preporučuje se kod stomačno-crevnih oboljenja, smetnji u varenju, oboljenja jetre i bubrega, a deluje i umirujuće na organizam.',
  //   'Med i preparati sa medom koriste se tako što se što duže drže u ustima dok se ne rastope. Ili mogu da se rastope u mlakoj vodi i potom popiju.',
  //   'bok@gmail.com'
  // )
  // new Product(
  //   2,
  //   'Bagremov med',
  //    256,
  //   'https://i0.wp.com/srpskimed.com/wp-content/uploads/2019/01/med_veliki_sum.jpg',
  //    2,
  //   'Bagremov med je odlično kardiotonično i neurotonično sredstvo. Ova vrsta meda preporučuje se kod stomačno-crevnih oboljenja, smetnji u varenju, oboljenja jetre i bubrega, a deluje i umirujuće na organizam.',
  //   'Med i preparati sa medom koriste se tako što se što duže drže u ustima dok se ne rastope. Ili mogu da se rastope u mlakoj vodi i potom popiju.',
  //   'bok@gmail.com'
  // )
  // new Product(
  //   3,
  //   'Saće u medu',
  //    256,
  //   'https://i0.wp.com/srpskimed.com/wp-content/uploads/2019/01/med_veliki_sum.jpg',
  //    15,
  //   'Saće u medu je izuzetno korisno za sluzokožu disajnih organa. Utičepovoljno na regeneraciju plućnog tkiva, te se preporučuje pušačima.',
  //   'Žvakanjem voska sa medom u naš organizam unosimo biološki vredne materije koje se u njemu nalaze, na primer vitamin A',
  //   'bok@gmail.com'
  // )
  // new Product(
  //   4,
  //   'Suncokretov med',
  //    700,
  //   'https://i0.wp.com/srpskimed.com/wp-content/uploads/2019/01/med_veliki_sum.jpg',
  //    15,
  //   'Suncokretov med se preporučuje: kod poremećaja u radu srca i krvnih sudova, ljudima koji pate od visokog krvnog pritiska, u slučajevima aritmije i loše cirkulacije. Zbog prirodnog bogatstva polenom preporučuje se kod prevencije problema sa prostatom.',
  //   'Med i preparati sa medom koriste se tako što se što duže drže u ustima dok se ne rastope. Ili mogu da se rastope u mlakoj vodi i potom popiju.',
  //   'bok@gmail.com'
  // )
  // new Product(
  //   5,
  //   'Medovača',
  //    700,
  //   'https://i0.wp.com/srpskimed.com/wp-content/uploads/2019/01/med_veliki_sum.jpg',
  //    15,
  //   'Medovača je domaća prepečenica sa odabranim medom – slatko piće koje, kako se pokazalo, najviše vole dame.',
  //   'Po jedna časica ujutru.',
  //   'bok@gmail.com'
  // )

  products: Product[] = [];

  product: Product = null;
  edit: Product;

  constructor(private authService: AuthService) {
    this.edit = JSON.parse(localStorage.getItem(ProductService.EDIT_PRODUCT_URL));
    const tempid = JSON.parse(localStorage.getItem(ProductService.ID_URL));

    if(tempid === null){
      localStorage.setItem(ProductService.ID_URL, '0');
    } else {
      ProductService.ID = +tempid;
    }

    const temp = JSON.parse(localStorage.getItem(ProductService.PRODUCT_URL));
    if(temp !== null){
      this.products = temp;
    }

    this.product = JSON.parse(localStorage.getItem('prodDetails'));
  }

  seeProductDetails(p:Product){
    localStorage.setItem('prodDetails', JSON.stringify(p));
    this.product = p;
  }

  findProductDetails(id: number){
    for(const p of this.products){
      if(p.id === id) {
        localStorage.setItem('prodDetails', JSON.stringify(p));
        this.product = p;
        return;
      }
    }
    this.product = null;
    localStorage.removeItem('prodDetails');
  }

  updateProductStorage(p: Product){
    for(let index = 0;index < this.products.length; index++){
      if(this.products[index].id === p.id){
        this.products[index].storage = p.storage;
        localStorage.setItem(ProductService.PRODUCT_URL, JSON.stringify(this.products));
        localStorage.setItem('prodDetails', JSON.stringify(p));
        return;
      }
    }
  }

  getProducts(){
    const username = this.authService.user.value.username;
    let stockEmptyProduct = 0;
    const temp = this.products.filter(p => {
      if(username === p.userId){
        if(p.storage === 0)
          stockEmptyProduct++;
        return true;
      }
      return false;
    });
    return {products: temp, empty: stockEmptyProduct};
  }

  editProduct(p: Product){
    this.edit = p;
    localStorage.setItem(ProductService.EDIT_PRODUCT_URL, JSON.stringify(p));
  }

  getEditableProduct(){
    this.edit = JSON.parse(localStorage.getItem(ProductService.EDIT_PRODUCT_URL));
    if(this.edit === null)
      return this.getEmptyProduct();
    return this.edit;
  }

  getEmptyProduct(){
    this.edit = new Product(ProductService.ID, '', 0, '', 0, '', '' , this.authService.user.value.username);
    return this.edit;
  }

  removeProduct(prod: Product){
    for (let index = 0; index < this.products.length; index++) {
      const element = this.products[index];
      if(element.id === prod.id){
        this.products.splice(index, 1);
        localStorage.setItem(ProductService.PRODUCT_URL, JSON.stringify(this.products));
        return;
      }
    }
  }

  saveProduct(){
    localStorage.removeItem(ProductService.EDIT_PRODUCT_URL);

    let exsists = false;
    for (let index = 0; index < this.products.length; index++) {
      const element = this.products[index];
      if(element.id === this.edit.id){
        this.products[index] = this.edit;
        exsists = true;
      }
    }

    if(!exsists){
      this.products.push(this.edit);
      localStorage.setItem(ProductService.ID_URL, ++ProductService.ID + '');
    }
    localStorage.setItem(ProductService.PRODUCT_URL, JSON.stringify(this.products));
  }
}
