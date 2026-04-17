import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cart } from '../../../core/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  /**
   * Exposed for Module 2's medicine-detail component to call directly.
   */
  addToCart(medicineId: number, quantity: number, prescriptionId?: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { medicineId, quantity, prescriptionId });
  }

  removeCartItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${cartItemId}`);
  }
}