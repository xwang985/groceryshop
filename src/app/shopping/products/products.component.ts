import { Component, OnInit } from '@angular/core';
import { ProductService } from 'shared/services/product.service';
import { Product } from 'shared/models/product'; 
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  category: string;
  products: Product[]=[];
  filteredProducts: Product[];
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
  ) { }

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    
    this.populateProducts();
  }

  private populateProducts() {
    this.productService
      .getAll()
      .pipe(switchMap((products: Product[]) => {
        this.products = products;
        return this.route.queryParamMap;
      }))
     .subscribe(params => {
      this.category = params.get('category');
      this.applyFilter(); 
      });
  }

  private applyFilter() {
    this.filteredProducts = (this.category)
      ? this.products.filter(p => p.category === this.category)
      : this.products;
  }
}
