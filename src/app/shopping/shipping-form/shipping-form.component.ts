import { OrderService } from 'shared/services/order.service';
import { Order } from 'shared/models/order';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit, OnDestroy {
	@Input('cart') cart: ShoppingCart;

	shipping = {}; 
  userId: string;
  userSubscription: Subscription;
	

  constructor(
  	private router: Router,
    private authService: AuthService,
    private orderService: OrderService,) { }

  async placeOrder() {
    let order = new Order(this.userId, this.shipping, this.cart); 
    let result = await this.orderService.placeOrder(order);
    this.router.navigate(['/order-success', result.key]);
  }    

  async ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}