import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicineService, MedicineDto } from '../../services/medicine.service';
import { CategoryService, CategoryDto } from '../../services/category.service';

@Component({
  selector: 'app-manage-medicine',
  templateUrl: './manage-medicine.component.html',
  styleUrls: ['./manage-medicine.component.css']
})
export class ManageMedicineComponent implements OnInit {

  medicines: MedicineDto[] = [];
  filteredMedicines: MedicineDto[] = [];
  categories: CategoryDto[] = [];

  isLoading = true;
  isModalOpen = false;
  isDeleteConfirmOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedMedicine: MedicineDto | null = null;
  medicineToDelete: MedicineDto | null = null;

  form: FormGroup;
  formSubmitting = false;
  formError = '';

  searchTerm = '';
  filterCategoryId = 0;

  toast = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      categoryId: [null, Validators.required],
      requiresPrescription: [false],
      imageUrl: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories = cats,
      error: () => {}
    });
  }

  loadAll(): void {
    this.isLoading = true;
    this.medicineService.getAll().subscribe({
      next: (data) => {
        this.medicines = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilters(): void {
    let list = this.medicines;
    if (this.filterCategoryId !== 0) {
      list = list.filter(m => m.categoryId === this.filterCategoryId);
    }
    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(t) || m.categoryName.toLowerCase().includes(t));
    }
    this.filteredMedicines = list;
  }

  // ── Modal helpers ──

  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedMedicine = null;
    this.form.reset({ requiresPrescription: false, isActive: true });
    this.formError = '';
    this.isModalOpen = true;
  }

  openEditModal(m: MedicineDto): void {
    this.modalMode = 'edit';
    this.selectedMedicine = m;
    this.form.patchValue({
      name: m.name,
      description: m.description,
      price: m.price,
      categoryId: m.categoryId,
      requiresPrescription: m.requiresPrescription,
      imageUrl: m.imageUrl,
      isActive: m.isActive
    });
    this.formError = '';
    this.isModalOpen = true;
  }

  closeModal(): void { this.isModalOpen = false; }

  submitForm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.formSubmitting = true;
    this.formError = '';

    const val = this.form.value;

    if (this.modalMode === 'add') {
      this.medicineService.create({
        name: val.name,
        description: val.description,
        price: val.price,
        categoryId: Number(val.categoryId),
        requiresPrescription: val.requiresPrescription,
        imageUrl: val.imageUrl
      }).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.isModalOpen = false;
          this.showToast('Medicine added successfully!', 'success');
          this.loadAll();
        },
        error: (e) => {
          this.formSubmitting = false;
          this.formError = e?.error?.message || 'Failed to create medicine.';
        }
      });
    } else {
      this.medicineService.update(this.selectedMedicine!.medicineId, {
        name: val.name,
        description: val.description,
        price: val.price,
        categoryId: Number(val.categoryId),
        requiresPrescription: val.requiresPrescription,
        imageUrl: val.imageUrl,
        isActive: val.isActive
      }).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.isModalOpen = false;
          this.showToast('Medicine updated!', 'success');
          this.loadAll();
        },
        error: (e) => {
          this.formSubmitting = false;
          this.formError = e?.error?.message || 'Failed to update medicine.';
        }
      });
    }
  }

  // ── Delete ──

  openDeleteConfirm(m: MedicineDto): void {
    this.medicineToDelete = m;
    this.isDeleteConfirmOpen = true;
  }

  cancelDelete(): void { this.isDeleteConfirmOpen = false; this.medicineToDelete = null; }

  confirmDelete(): void {
    if (!this.medicineToDelete) return;
    this.medicineService.delete(this.medicineToDelete.medicineId).subscribe({
      next: () => {
        this.isDeleteConfirmOpen = false;
        this.showToast('Medicine deactivated.', 'success');
        this.loadAll();
      },
      error: () => { this.showToast('Failed to delete.', 'error'); this.isDeleteConfirmOpen = false; }
    });
  }

  // ── Helpers ──

  showToast(msg: string, type: 'success' | 'error'): void {
    this.toast = msg;
    this.toastType = type;
    setTimeout(() => this.toast = '', 3000);
  }

  getCategoryName(id: number): string {
    return this.categories.find(c => c.categoryId === id)?.categoryName ?? '—';
  }

  goInventory(): void { this.router.navigate(['/medicine/admin/inventory']); }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}


