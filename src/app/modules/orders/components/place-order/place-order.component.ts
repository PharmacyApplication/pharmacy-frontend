import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../../../core/models/cart.model';
import { Order } from '../../../../core/models/order.model';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  cart: Cart | null = null;
  shippingAddress = '';
  isLoading = true;
  isPlacing = false;
  errorMessage = '';
  placedOrder: Order | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load cart.';
        this.isLoading = false;
      }
    });
  }

  get totalAmount(): number {
  return this.cart?.cartItems?.reduce(
    (sum: number, item) =>
      sum + (item.medicinePrice ?? 0) * item.quantity,
    0
  ) ?? 0;
}
  get isEmpty(): boolean {
  return !this.cart?.cartItems || this.cart.cartItems.length === 0;
}

  confirmOrder(): void {
    if (!this.shippingAddress.trim()) {
      this.errorMessage = 'Please enter a shipping address.';
      return;
    }

    this.isPlacing = true;
    this.errorMessage = '';

    this.orderService.placeOrder(this.shippingAddress.trim()).subscribe({
      next: (order) => {
        this.isPlacing = false;
        this.placedOrder = order;
      },
      error: (err) => {
        this.isPlacing = false;
        this.errorMessage = err?.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }

  goToOrders(): void {
    this.router.navigate(['/tracking/orders']);
  }
}