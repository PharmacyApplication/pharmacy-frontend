import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrackingRoutingModule } from './tracking-routing.module';
import { OrderTrackingComponent } from './components/order-tracking/order-tracking.component';
import { AdminOrderManagementComponent } from './components/admin-order-management/admin-order-management.component';
import { EmailLogsComponent } from './components/email-logs/email-logs.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrderTrackingComponent,
    AdminOrderManagementComponent,
    EmailLogsComponent
  ],
  imports: [
    CommonModule,
    TrackingRoutingModule,
    FormsModule
  ]
})
export class TrackingModule { }
