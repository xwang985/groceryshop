import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './../product.service';
import { Product } from './../models/product'; 
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from '../shopping-cart.service';
import { Subscription, Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  category: string;
  products: Product[]=[];
  filteredProducts: Product[];
  cart: ShoppingCart;
  subscription: Subscription;

  constructor(
    route: ActivatedRoute,
    productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    ) {
    productService
      .getAll()
      .pipe(switchMap((products: Product[]) => {
        this.products = products;
        return route.queryParamMap;
      }))
     .subscribe(params => {
      this.category = params.get('category');

      this.filteredProducts = (this.category)
        ? this.products.filter(p => p.category === this.category)
        : this.products;
      });

  }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart())
    //   // .subscribe(cart => {
    //   // let temp: any;
    //   // temp = cart.payload.child('/items').val();
    //   // this.cart = new ShoppingCart(temp);
    // // });
      .subscribe(cart => this.cart = cart);
    };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
