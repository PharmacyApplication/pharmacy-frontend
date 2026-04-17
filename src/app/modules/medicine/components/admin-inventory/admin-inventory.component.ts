import { Component, OnInit } from '@angular/core';
import { InventoryService, InventoryDto } from '../../services/inventory.service';
import { MedicineService, MedicineDto, CreateMedicineDto, UpdateMedicineDto } from '../../services/medicine.service';

interface InventoryRow extends InventoryDto {
  editReorder: number;
  saving: boolean;
  saved: boolean;
}

interface MedicineRow extends MedicineDto {
  editing: boolean;
  saving: boolean;
  deleting: boolean;
}

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css']
})
export class AdminInventoryComponent implements OnInit {
  rows: InventoryRow[] = [];
  medicines: MedicineRow[] = [];
  categories: { id: number; name: string }[] = [];
  isLoading = true;
  errorMessage = '';
  showLowStockOnly = false;
  isManageMode = false; // Toggle between inventory and CRUD modes

  // Medicine form
  newMedicine: CreateMedicineDto = {
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    requiresPrescription: false,
    imageUrl: '',
    quantityInStock: 0,
    reorderLevel: 0
  };
  isAddingMedicine = false;

  constructor(
    private inventoryService: InventoryService,
    private medicineService: MedicineService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
    this.loadMedicines();
    this.loadCategories();
  }

  loadInventory(): void {
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.rows = data.map(item => ({
          ...item,
          editReorder: item.reorderLevel,
          saving: false,
          saved: false
        }));
      },
      error: () => {
        this.errorMessage = 'Failed to load inventory.';
      }
    });
  }

  loadMedicines(): void {
    this.medicineService.getAll().subscribe({
      next: (data) => {
        this.medicines = data.map(item => ({
          ...item,
          editing: false,
          saving: false,
          deleting: false
        }));
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load medicines.';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    // Extract categories from medicines (assuming they have category info)
    this.medicineService.getAll().subscribe({
      next: (medicines) => {
        const map = new Map<number, string>();
        medicines.forEach(m => map.set(m.categoryId, m.categoryName));
        this.categories = Array.from(map.entries()).map(([id, name]) => ({ id, name }));
      }
    });
  }

  toggleManageMode(): void {
    this.isManageMode = !this.isManageMode;
    // Refresh inventory when returning to main page
    if (!this.isManageMode) {
      this.loadInventory();
    }
  }

  get displayedRows(): InventoryRow[] {
    return this.showLowStockOnly
      ? this.rows.filter(r => r.quantityInStock <= r.reorderLevel)
      : this.rows;
  }

  saveRow(row: InventoryRow): void {
    row.saving = true;
    row.saved = false;
    this.inventoryService.updateStock(row.medicineId, {
      quantityInStock: row.quantityInStock,
      reorderLevel: row.editReorder
    }).subscribe({
      next: (updated) => {
        row.quantityInStock = updated.quantityInStock;
        row.reorderLevel = updated.reorderLevel;
        row.lastUpdated = updated.lastUpdated;
        row.isLowStock = updated.isLowStock;
        row.editReorder = updated.reorderLevel;
        row.saving = false;
        row.saved = true;
        setTimeout(() => row.saved = false, 2500);
      },
      error: () => {
        row.saving = false;
      }
    });
  }

  isRowLow(row: InventoryRow): boolean {
    return row.quantityInStock <= row.reorderLevel;
  }

  // Medicine CRUD operations
  addMedicine(): void {
    if (!this.newMedicine.name.trim() || this.newMedicine.price <= 0) return;

    this.isAddingMedicine = true;
    this.medicineService.create(this.newMedicine).subscribe({
      next: (created) => {
        this.medicines.push({
          ...created,
          editing: false,
          saving: false,
          deleting: false
        });
        this.loadInventory();
        this.resetNewMedicineForm();
        this.isAddingMedicine = false;
      },
      error: () => {
        this.isAddingMedicine = false;
      }
    });
  }

  editMedicine(medicine: MedicineRow): void {
    medicine.editing = true;
  }

  saveMedicine(medicine: MedicineRow): void {
    medicine.saving = true;
    const updateDto: UpdateMedicineDto = {
      name: medicine.name,
      description: medicine.description,
      price: medicine.price,
      categoryId: medicine.categoryId,
      requiresPrescription: medicine.requiresPrescription,
      imageUrl: medicine.imageUrl,
      isActive: medicine.isActive
    };

    this.medicineService.update(medicine.medicineId, updateDto).subscribe({
      next: (updated) => {
        Object.assign(medicine, updated);
        medicine.editing = false;
        medicine.saving = false;
      },
      error: () => {
        medicine.saving = false;
      }
    });
  }

  cancelEdit(medicine: MedicineRow): void {
    // Reload the medicine to reset changes
    this.medicineService.getById(medicine.medicineId).subscribe({
      next: (original) => {
        Object.assign(medicine, original);
        medicine.editing = false;
      }
    });
  }

  deleteMedicine(medicine: MedicineRow): void {
    if (!confirm(`Are you sure you want to delete "${medicine.name}"?`)) return;

    medicine.deleting = true;
    this.medicineService.delete(medicine.medicineId).subscribe({
      next: () => {
        this.medicines = this.medicines.filter(m => m.medicineId !== medicine.medicineId);
      },
      error: () => {
        medicine.deleting = false;
      }
    });
  }

  resetNewMedicineForm(): void {
    this.newMedicine = {
      name: '',
      description: '',
      price: 0,
      categoryId: 0,
      requiresPrescription: false,
      imageUrl: '',
      quantityInStock: 0,
      reorderLevel: 0
    };
  }
}

