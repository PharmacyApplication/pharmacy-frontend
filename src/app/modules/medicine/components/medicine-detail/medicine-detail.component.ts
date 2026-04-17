import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService, MedicineDto } from '../../services/medicine.service';
import { CartService } from '../../../orders/services/cart.service';

@Component({
  selector: 'app-medicine-detail',
  templateUrl: './medicine-detail.component.html',
  styleUrls: ['./medicine-detail.component.css']
})
export class MedicineDetailComponent implements OnInit {
  medicine: MedicineDto | null = null;
  isLoading = true;
  errorMessage = '';
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicineService: MedicineService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) { this.router.navigate(['/medicine']); return; }
    this.medicineService.getById(id).subscribe({
      next: (data) => { this.medicine = data; this.isLoading = false; },
      error: () => { this.errorMessage = 'Medicine not found.'; this.isLoading = false; }
    });
  }

  addToCart(): void {
    if (!this.medicine) return;
    if (this.medicine.quantityInStock < 1) {
      this.showToast('Insufficient stock available.', 'error');
      return;
    }
    this.addingToCart = true;
    this.cartService.addToCart(this.medicine.medicineId, 1).subscribe({
      next: () => { this.showToast('Added to cart successfully!', 'success'); this.addingToCart = false; },
      error: (e) => { this.showToast(e?.error?.message || 'Failed to add to cart.', 'error'); this.addingToCart = false; }
    });
  }

  showToast(msg: string, type: 'success' | 'error'): void {
    this.toastMessage = msg;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  goBack(): void { this.router.navigate(['/medicine']); }
  isInStock(): boolean { return (this.medicine?.quantityInStock ?? 0) > 0; }
}


