import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicineService, MedicineDto } from '../../services/medicine.service';
import { CategoryService, CategoryDto } from '../../services/category.service';
import { UploadService } from '../../services/upload.service';

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
  showInactive = false;   // toggle: show inactive medicines too

  // Add/Edit modal
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedMedicine: MedicineDto | null = null;
  form: FormGroup;
  formSubmitting = false;
  formError = '';
  imagePreview = '';
  imageUploading = false;
  imageUploadError = '';

  // Deactivate confirm dialog
  isDeactivateConfirmOpen = false;
  medicineToDeactivate: MedicineDto | null = null;

  // Hard delete confirm dialog (two-step)
  isHardDeleteConfirmOpen = false;
  hardDeleteStep: 1 | 2 = 1;
  medicineToHardDelete: MedicineDto | null = null;
  hardDeleteConfirmText = '';

  // Restore confirm dialog
  isRestoreConfirmOpen = false;
  medicineToRestore: MedicineDto | null = null;

  // Filters
  searchTerm = '';
  filterCategoryId = 0;
  filterStatus: 'all' | 'active' | 'inactive' | 'lowstock' = 'all';

  // Toast
  toast = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private categoryService: CategoryService,
    private uploadService: UploadService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      price: [null, [Validators.required, Validators.min(0.01)]],
      categoryId: [null, Validators.required],
      requiresPrescription: [false],
      imageUrl: [''],
      isActive: [true],
      quantityInStock: [0, [Validators.required, Validators.min(0)]],
      reorderLevel: [10, [Validators.required, Validators.min(0)]]
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
    // Always load all (including inactive) for admin view
    this.medicineService.getAllIncludingInactive().subscribe({
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

    // Status filter
    if (this.filterStatus === 'active') {
      list = list.filter(m => m.isActive);
    } else if (this.filterStatus === 'inactive') {
      list = list.filter(m => !m.isActive);
    } else if (this.filterStatus === 'lowstock') {
      list = list.filter(m => m.isActive && m.isLowStock);
    }
    // 'all' = no status filter (shows active + inactive)

    // Category filter
    const catId = Number(this.filterCategoryId);
    if (catId !== 0) {
      list = list.filter(m => m.categoryId === catId);
    }

    // Search filter
    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(t) ||
        m.categoryName.toLowerCase().includes(t)
      );
    }

    this.filteredMedicines = list;
  }

  // ── Stats ──────────────────────────────────────────────────────────────────

  get totalActive(): number { return this.medicines.filter(m => m.isActive).length; }
  get totalInactive(): number { return this.medicines.filter(m => !m.isActive).length; }
  get totalLowStock(): number { return this.medicines.filter(m => m.isActive && m.isLowStock).length; }

  // ── Add / Edit modal ───────────────────────────────────────────────────────

  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedMedicine = null;
    this.form.reset({ requiresPrescription: false, isActive: true, quantityInStock: 0, reorderLevel: 10 });
    this.formError = '';
    this.imagePreview = '';
    this.imageUploadError = '';
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
      isActive: m.isActive,
      quantityInStock: m.quantityInStock,
      reorderLevel: m.reorderLevel
    });
    this.formError = '';
    this.imagePreview = m.imageUrl || '';
    this.imageUploadError = '';
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
        imageUrl: val.imageUrl,
        quantityInStock: val.quantityInStock,
        reorderLevel: val.reorderLevel
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
        isActive: val.isActive,
        quantityInStock: val.quantityInStock,
        reorderLevel: val.reorderLevel
      }).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.isModalOpen = false;
          this.showToast('Medicine updated successfully!', 'success');
          this.loadAll();
        },
        error: (e) => {
          this.formSubmitting = false;
          this.formError = e?.error?.message || 'Failed to update medicine.';
        }
      });
    }
  }

  // ── Deactivate (soft delete) ───────────────────────────────────────────────

  openDeactivateConfirm(m: MedicineDto): void {
    this.medicineToDeactivate = m;
    this.isDeactivateConfirmOpen = true;
  }

  cancelDeactivate(): void {
    this.isDeactivateConfirmOpen = false;
    this.medicineToDeactivate = null;
  }

  confirmDeactivate(): void {
    if (!this.medicineToDeactivate) return;
    this.medicineService.softDelete(this.medicineToDeactivate.medicineId).subscribe({
      next: () => {
        this.isDeactivateConfirmOpen = false;
        this.showToast(`"${this.medicineToDeactivate!.name}" has been deactivated.`, 'warning');
        this.medicineToDeactivate = null;
        this.loadAll();
      },
      error: () => {
        this.showToast('Failed to deactivate medicine.', 'error');
        this.isDeactivateConfirmOpen = false;
      }
    });
  }

  // ── Restore ────────────────────────────────────────────────────────────────

  openRestoreConfirm(m: MedicineDto): void {
    this.medicineToRestore = m;
    this.isRestoreConfirmOpen = true;
  }

  cancelRestore(): void {
    this.isRestoreConfirmOpen = false;
    this.medicineToRestore = null;
  }

  confirmRestore(): void {
    if (!this.medicineToRestore) return;
    this.medicineService.restore(this.medicineToRestore.medicineId).subscribe({
      next: () => {
        this.isRestoreConfirmOpen = false;
        this.showToast(`"${this.medicineToRestore!.name}" has been restored!`, 'success');
        this.medicineToRestore = null;
        this.loadAll();
      },
      error: () => {
        this.showToast('Failed to restore medicine.', 'error');
        this.isRestoreConfirmOpen = false;
      }
    });
  }

  // ── Hard Delete (permanent) — two-step confirmation ────────────────────────

  openHardDeleteConfirm(m: MedicineDto): void {
    this.medicineToHardDelete = m;
    this.hardDeleteStep = 1;
    this.hardDeleteConfirmText = '';
    this.isHardDeleteConfirmOpen = true;
  }

  cancelHardDelete(): void {
    this.isHardDeleteConfirmOpen = false;
    this.medicineToHardDelete = null;
    this.hardDeleteConfirmText = '';
  }

  proceedToHardDeleteStep2(): void {
    this.hardDeleteStep = 2;
  }

  confirmHardDelete(): void {
    if (!this.medicineToHardDelete) return;
    // Require typing the medicine name to confirm
    if (this.hardDeleteConfirmText !== this.medicineToHardDelete.name) return;

    this.medicineService.hardDelete(this.medicineToHardDelete.medicineId).subscribe({
      next: () => {
        const name = this.medicineToHardDelete!.name;
        this.isHardDeleteConfirmOpen = false;
        this.medicineToHardDelete = null;
        this.hardDeleteConfirmText = '';
        this.showToast(`"${name}" permanently deleted.`, 'error');
        this.loadAll();
      },
      error: () => {
        this.showToast('Failed to permanently delete medicine.', 'error');
        this.isHardDeleteConfirmOpen = false;
      }
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  showToast(msg: string, type: 'success' | 'error' | 'warning'): void {
    this.toast = msg;
    this.toastType = type;
    setTimeout(() => this.toast = '', 3500);
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  goInventory(): void { this.router.navigate(['/medicine/admin/inventory']); }

  getStockLevel(m: MedicineDto): 'out' | 'low' | 'ok' {
    if (m.quantityInStock === 0) return 'out';
    if (m.isLowStock) return 'low';
    return 'ok';
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.imageUploading = true;
    this.imageUploadError = '';

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);

    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.form.patchValue({ imageUrl: res.url });
        this.imagePreview = res.url;
        this.imageUploading = false;
      },
      error: () => {
        this.imageUploadError = 'Image upload failed. Try again.';
        this.imageUploading = false;
      }
    });
  }

  get hardDeleteNameMatches(): boolean {
    return this.hardDeleteConfirmText === this.medicineToHardDelete?.name;
  }
}