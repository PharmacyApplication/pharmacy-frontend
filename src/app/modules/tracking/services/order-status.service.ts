import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
 
export interface OrderSummary {
  orderId: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  placedAt: string;
  updatedAt: string | null;
}
 
export interface OrderDetail {
  orderId: number;
  status: string;
  placedAt: string;
  updatedAt: string | null;
  shippingAddress: string;
  totalAmount: number;
  customerName: string;
}
 
@Injectable({ providedIn: 'root' })
export class OrderStatusService {
  private base = `${environment.apiUrl}/orderstatus`;
 
  constructor(private http: HttpClient) {}
 
  getAllOrders(): Observable<OrderSummary[]> {
    return this.http.get<OrderSummary[]>(`${this.base}/all`);
  }
 
  getOrderById(orderId: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.base}/${orderId}`);
  }
 
  updateOrderStatus(orderId: number, status: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.base}/${orderId}`, { status });
  }
}