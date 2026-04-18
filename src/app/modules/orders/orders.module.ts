import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { OrdersRoutingModule } from './orders-routing.module';

import { PrescriptionUploadComponent } from './components/prescription-upload/prescription-upload.component';
import { CartComponent } from './components/cart/cart.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';

import { PrescriptionService } from './services/prescription.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';

@NgModule({
  declarations: [
    PrescriptionUploadComponent,
    CartComponent,
    PlaceOrderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrdersRoutingModule
  ],
  providers: [
    PrescriptionService,
    CartService,
    OrderService
  ]
})
export class OrdersModule {}