import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineService, MedicineDto } from '../../services/medicine.service';
// Cart service provided by Module 3
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
  successMessage = '';
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medicineService: MedicineService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.router.navigate(['/medicine']);
      return;
    }
    this.loadMedicine(id);
  }

  loadMedicine(id: number): void {
    this.medicineService.getById(id).subscribe({
      next: (data) => {
        this.medicine = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Medicine not found.';
        this.isLoading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.medicine) return;
    this.addingToCart = true;
    // this.cartService.addToCart(this.medicine.medicineId).subscribe({
    //   next: () => {
    //     this.successMessage = 'Added to cart successfully!';
    //     this.addingToCart = false;
    //   },
    //   error: (err:any) => {
    //     this.errorMessage = err?.error?.message || 'Failed to add to cart.';
    //     this.addingToCart = false;
    //   }
    // });
  }

  goBack(): void {
    this.router.navigate(['/medicine']);
  }

  isInStock(): boolean {
    return (this.medicine?.quantityInStock ?? 0) > 0;
  }
}

