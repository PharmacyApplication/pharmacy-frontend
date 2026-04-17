import { Component, OnInit } from '@angular/core';
import { InventoryService, InventoryDto } from '../../services/inventory.service';

interface InventoryRow extends InventoryDto {
  editQty: number;
  editReorder: number;
  saving: boolean;
  saved: boolean;
}

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css']
})
export class AdminInventoryComponent implements OnInit {
  rows: InventoryRow[] = [];
  isLoading = true;
  errorMessage = '';
  showLowStockOnly = false;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.rows = data.map(item => ({
          ...item,
          editQty: item.quantityInStock,
          editReorder: item.reorderLevel,
          saving: false,
          saved: false
        }));
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load inventory.';
        this.isLoading = false;
      }
    });
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
      quantityInStock: row.editQty,
      reorderLevel: row.editReorder
    }).subscribe({
      next: (updated) => {
        row.quantityInStock = updated.quantityInStock;
        row.reorderLevel = updated.reorderLevel;
        row.lastUpdated = updated.lastUpdated;
        row.isLowStock = updated.isLowStock;
        row.editQty = updated.quantityInStock;
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
}

