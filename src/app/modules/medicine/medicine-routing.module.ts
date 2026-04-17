
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MedicineListComponent } from './components/medicine-list/medicine-list.component';
import { MedicineDetailComponent } from './components/medicine-detail/medicine-detail.component';
import { AdminInventoryComponent } from './components/admin-inventory/admin-inventory.component';
import { ManageMedicineComponent } from './components/manage-medicine/manage-medicine.component';

const routes: Routes = [
  { path: '', component: MedicineListComponent },
  { path: 'detail/:id', component: MedicineDetailComponent },
  { path: 'admin/inventory', component: AdminInventoryComponent },
  { path: 'admin/manage', component: ManageMedicineComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineRoutingModule { }
