import { Product } from './product';
import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
    items: ShoppingCartItem[] = []; // Since we're using the push method, initializing to an empty array to avoid null exception error
    constructor(private itemsMap: { [productId: string]: ShoppingCartItem}) {
        this.itemsMap = itemsMap || {};

        // tslint:disable-next-line: forin
        for (const productId in itemsMap) {
            const item = itemsMap[productId];
            // this.items.push(new ShoppingCartItem(item.product, item.quantity));
            this.items.push(new ShoppingCartItem({ ...item, key: productId })); // Objects that we get from firebase, so we map to shopping-cart-item object
        }
    }

    getQuantity(product: Product) {
        // if (!this.itemsMap) 
        //     return 0;

        const item = this.itemsMap[product.key];
        return item ? item.quantity : 0;
      }

    get totalItemsCount() {
        let count = 0;
        for (const productId in this.itemsMap)
            count += this.itemsMap[productId].quantity;

        return count;
    }

    get totalPrice() {
        let sum = 0;
        for (const productId in this.items)
            sum += this.items[productId].totalPrice;

        return sum;
    }

  //   getQuantity() {
  //   if (!this.shoppingCart) return 0;

  //   const item = this.shoppingCart.itemsMap[this.product.key];
  //   console.log(item)
  //   return item ? item.quantity : 0;
  // }
}
