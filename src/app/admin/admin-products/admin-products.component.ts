import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './../../product.service';
import { Subscription } from 'rxjs';
// import { Product } from './../../models/product';
// import { DataTableResource } from 'angular7-data-table';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
	products$;
  products: {title: string}[];
  filteredProducts: any[];
	subscription: Subscription;
  // tableResouce: DataTableResource<Product>;
  // items: Product[];
  // itemCount: number;

  constructor(private productService: ProductService) { 
  	// this.products$ = productService.getAll();
    this.subscription = productService.getAll()
      .subscribe(products => {
        this.filteredProducts = this.products = products;
        // this.initializeTable(products);
      });
  }

  // private initializeTable(products: Product[]) {
  //   this.tableResouce = new DataTableResource(products);
  //   this.tableResouce.query({ offset: 0 })
  //     .then(items => this.items = items );
  //   this.tableResouce.count()
  //     .then(count => this.itemCount = count);
  // }

  filter(query: string) {
    this.filteredProducts = (query) 
      ? this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
      : this.products;
  }

  // reloadItems(params) {
  //   if (!this.tableResouce) return;

  //   this.tableResouce.query(params)
  //     .then(items => this.items = items );
  // }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
