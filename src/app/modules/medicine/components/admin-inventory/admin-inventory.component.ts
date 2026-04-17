import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService, InventoryDto } from '../../services/inventory.service';

interface InventoryRow extends InventoryDto {
  editQty: number;
  editReorder: number;
  saving: boolean;
  saved: boolean;
  hasChanges: boolean;
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

  lowStockCount = 0;
  totalCount = 0;

  constructor(private inventoryService: InventoryService, private router: Router) {}

  ngOnInit(): void { this.loadInventory(); }

  loadInventory(): void {
    this.isLoading = true;
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.rows = data.map(item => ({
          ...item,
          editQty: item.quantityInStock,
          editReorder: item.reorderLevel,
          saving: false,
          saved: false,
          hasChanges: false
        }));
        this.totalCount = data.length;
        this.lowStockCount = data.filter(d => d.quantityInStock <= d.reorderLevel).length;
        this.isLoading = false;
      },
      error: () => { this.errorMessage = 'Failed to load inventory.'; this.isLoading = false; }
    });
  }

  get displayedRows(): InventoryRow[] {
    return this.showLowStockOnly
      ? this.rows.filter(r => r.quantityInStock <= r.reorderLevel)
      : this.rows;
  }

  markChanged(row: InventoryRow): void {
    row.hasChanges = (row.editQty !== row.quantityInStock || row.editReorder !== row.reorderLevel);
  }

  saveRow(row: InventoryRow): void {
    row.saving = true;
    row.saved = false;
    this.inventoryService.updateStock(row.medicineId, {
      quantityInStock: row.editQty,
      reorderLevel: row.editReorder
    }).subscribe({
      next: (updated) => {
        Object.assign(row, {
          quantityInStock: updated.quantityInStock,
          reorderLevel: updated.reorderLevel,
          lastUpdated: updated.lastUpdated,
          isLowStock: updated.isLowStock,
          editQty: updated.quantityInStock,
          editReorder: updated.reorderLevel,
          saving: false,
          saved: true,
          hasChanges: false
        });
        this.lowStockCount = this.rows.filter(r => r.quantityInStock <= r.reorderLevel).length;
        setTimeout(() => row.saved = false, 2500);
      },
      error: () => { row.saving = false; }
    });
  }

  isRowLow(row: InventoryRow): boolean { return row.quantityInStock <= row.reorderLevel; }

  goManage(): void { this.router.navigate(['/medicine/admin/manage']); }

  getStockPercent(row: InventoryRow): number {
    const max = Math.max(row.reorderLevel * 3, row.quantityInStock, 1);
    return Math.min((row.quantityInStock / max) * 100, 100);
  }
}
