import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicineRoutingModule } from './medicine-routing.module';
import { MedicineListComponent } from './components/medicine-list/medicine-list.component';
import { MedicineDetailComponent } from './components/medicine-detail/medicine-detail.component';
import { AdminInventoryComponent } from './components/admin-inventory/admin-inventory.component';


@NgModule({
  declarations: [
    MedicineListComponent,
    MedicineDetailComponent,
    AdminInventoryComponent
  ],
  imports: [
    CommonModule,
    MedicineRoutingModule
  ]
})
export class MedicineModule { }
