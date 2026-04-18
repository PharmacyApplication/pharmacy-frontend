import { Component, OnInit } from '@angular/core';
import { OrderStatusService, OrderSummary } from '../../services/order-status.service';

@Component({
  selector: 'app-admin-order-management',
  templateUrl: './admin-order-management.component.html',
  styleUrls: ['./admin-order-management.component.css'],
})
export class AdminOrderManagementComponent implements OnInit {
  orders: OrderSummary[] = [];
  loading = true;
  toast: { message: string; type: 'success' | 'error' } | null = null;
  updating: Record<number, boolean> = {};
  selectedStatus: Record<number, string> = {};

  validNextStatuses: Record<string, string[]> = {
    Ordered: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered', 'Cancelled'],
    Delivered: [],
    Cancelled: [],
  };

  constructor(private orderStatusService: OrderStatusService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.orderStatusService.getAllOrders().subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  getNextStatuses(current: string): string[] {
    return this.validNextStatuses[current] ?? [];
  }

  update(orderId: number): void {
    const status = this.selectedStatus[orderId];
    if (!status) return;
    this.updating[orderId] = true;
    this.orderStatusService.updateOrderStatus(orderId, status).subscribe({
      next: (res) => {
        this.showToast(res.message, 'success');
        this.updating[orderId] = false;
        this.load();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Update failed.', 'error');
        this.updating[orderId] = false;
      },
    });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => (this.toast = null), 3500);
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}