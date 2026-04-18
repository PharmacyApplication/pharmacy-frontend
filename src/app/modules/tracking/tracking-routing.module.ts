import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { OrderTrackingComponent } from './components/order-tracking/order-tracking.component';
import { AdminOrderManagementComponent } from './components/admin-order-management/admin-order-management.component';
import { EmailLogsComponent } from './components/email-logs/email-logs.component';
 
const routes: Routes = [
  { path: 'track/:orderId', component: OrderTrackingComponent },
  { path: 'admin/orders',   component: AdminOrderManagementComponent },
  { path: 'admin/email-logs', component: EmailLogsComponent },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackingRoutingModule {}