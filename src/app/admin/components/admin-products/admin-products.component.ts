import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataTableResource } from 'angular7-data-table';
import { Subscription } from 'rxjs';
import { Product } from 'shared/models/product';
import { ProductService } from 'shared/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: Product[];
  // filteredProducts: Product[];
  subscription: Subscription;
  tableResource: DataTableResource<Product>;
  items: Product[] = [];
  itemCount: number;

  constructor(private productService: ProductService) { 
    this.subscription = productService.getAll()
      .subscribe((products: Product[]) => {
        this.products = products;
        this.initializeTable(products);
      });
  }

  private initializeTable(products: Product[]) {
    this.tableResource = new DataTableResource(products);
    this.tableResource.query({ offset: 0 }) // Gets all the records for the current page based on the current parameter | offset: 0 means page 1
      .then(items => this.items = items);
    this.tableResource.count() // Total records in out table
      .then(count => this.itemCount = count);
  }

  reloadItems(params) {
    if (!this.tableResource)
      return;

    this.tableResource.query(params) // Gets all the records for the current page based on the current parameter | offset: 0 means page 1
      .then(items => this.items = items);
  }

  filter(query: string) {
    const filteredProducts = (query)
      ? this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
      : this.products;

      this.initializeTable(filteredProducts);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
