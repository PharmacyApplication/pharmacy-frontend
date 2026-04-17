import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { PrescriptionUploadComponent } from './components/prescription-upload/prescription-upload.component';
import { CartComponent } from './components/cart/cart.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';


@NgModule({
  declarations: [
    PrescriptionUploadComponent,
    CartComponent,
    PlaceOrderComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
