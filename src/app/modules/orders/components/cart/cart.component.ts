import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = true;
  errorMessage = '';
  removingItemId: number | null = null;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
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

  removeItem(cartItemId: number): void {
    this.removingItemId = cartItemId;
    this.cartService.removeCartItem(cartItemId).subscribe({
      next: () => {
        this.removingItemId = null;
        this.loadCart();
      },
      error: () => {
        this.removingItemId = null;
        this.errorMessage = 'Failed to remove item.';
      }
    });
  }

  get totalAmount(): number {
  return this.cart?.cartItems?.reduce(
    (sum: number, item: CartItem) =>
      sum + (item.medicinePrice ?? 0) * item.quantity,
    0
  ) ?? 0;
}
  get isEmpty(): boolean {
  return !this.cart?.cartItems || this.cart.cartItems.length === 0;
}

  proceedToOrder(): void {
    this.router.navigate(['/orders/place-order']);
  }
}