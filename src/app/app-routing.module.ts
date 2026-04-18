import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'medicine',
    loadChildren: () => import('./modules/medicine/medicine.module').then(m => m.MedicineModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tracking',
    loadChildren: () => import('./modules/tracking/tracking.module').then(m => m.TrackingModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}