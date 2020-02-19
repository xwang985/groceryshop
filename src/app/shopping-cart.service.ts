import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { Product } from './models/product';
import { take, map } from 'rxjs/operators';
import { FirebaseObjectObservable } from '@angular/fire/database-deprecated';
import { ShoppingCart } from './models/shopping-cart';
import { Observable } from 'rxjs';
import { SnapshotOptions } from '@angular/fire/firestore';
import { ShoppingCartItem } from './models/shopping-cart-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create() {
  	return this.db.list('/shopping-carts').push({
  		dateCreated: new Date().getTime()
  	});
  }
  
  async getCart(): Promise<Observable<ShoppingCart>> {
  	let cartId = await this.getOrCreateCartId();
  	return this.db.object('/shopping-carts/' + cartId).snapshotChanges()
      .pipe(map(x => new ShoppingCart(x.payload.exportVal().items)));
  }

  private getItem(cartId: string, productId: string) {
  	return this.db.object("/shopping-carts/" + cartId + "/items/" + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
  	let cartId = localStorage.getItem('cartId');
  	if (cartId) return cartId;
  	
		let result = await this.create();  // call async method
		localStorage.setItem('cartId', result.key);
		return result.key; 	
  }

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item = this.getItem(cartId, product.key);

    item.valueChanges().pipe(take(1))
    .subscribe((data: ShoppingCartItem) => {
      const quantity = (data? (data.quantity || 0) : 0) + change ;
      if (quantity === 0)
        item.remove(); 
      else {
        item.update({
          product: product, 
          quantity: quantity
        });
      }
    });
  }
}
