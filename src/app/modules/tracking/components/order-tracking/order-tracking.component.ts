import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderStatusService, OrderDetail } from '../../services/order-status.service';

interface Step {
  label: string;
  icon: string;
  status: 'completed' | 'active' | 'pending';
  timestamp: string | null;
}

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css'],
})
export class OrderTrackingComponent implements OnInit {
  order: OrderDetail | null = null;
  steps: Step[] = [];
  loading = true;
  error = '';

  private readonly statusOrder = ['Ordered', 'Shipped', 'Delivered'];

  constructor(
    private route: ActivatedRoute,
    private orderStatusService: OrderStatusService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('orderId'));
    this.orderStatusService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.buildSteps(order);
        this.loading = false;
      },
      error: () => {
        this.error = 'Order not found or access denied.';
        this.loading = false;
      },
    });
  }

  private buildSteps(order: OrderDetail): void {
    const icons = ['📦', '🚚', '✅'];
    const currentIndex = this.statusOrder.indexOf(order.status);

    this.steps = this.statusOrder.map((s, i) => {
      let stepStatus: 'completed' | 'active' | 'pending';
      if (i < currentIndex) stepStatus = 'completed';
      else if (i === currentIndex) stepStatus = order.status === 'Cancelled' ? 'pending' : 'active';
      else stepStatus = 'pending';

      let timestamp: string | null = null;
      if (i === 0) timestamp = order.placedAt;
      else if (i === currentIndex && order.updatedAt) timestamp = order.updatedAt;

      return { label: s, icon: icons[i], status: stepStatus, timestamp };
    });

    if (order.status === 'Cancelled') {
      this.steps = [{
        label: 'Cancelled', icon: '❌', status: 'active', timestamp: order.updatedAt
      }];
    }
  }

  formatDate(d: string | null): string {
    if (!d) return '';
    return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }
}