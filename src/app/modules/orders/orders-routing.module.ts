import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrescriptionUploadComponent } from './components/prescription-upload/prescription-upload.component';
import { CartComponent } from './components/cart/cart.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';

const routes: Routes = [
  { path: 'prescriptions', component: PrescriptionUploadComponent },
  { path: 'cart', component: CartComponent },
  { path: 'place-order', component: PlaceOrderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {}