import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService, InventoryDto } from '../../services/inventory.service';

export interface InventoryRow extends InventoryDto {
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
  bulkSaving = false;

  toast = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

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
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load inventory.';
        this.isLoading = false;
      }
    });
  }

  // ── Computed stats ─────────────────────────────────────────────────────────

  get totalCount(): number { return this.rows.length; }
  get lowStockCount(): number { return this.rows.filter(r => this.isRowLow(r)).length; }
  get outOfStockCount(): number { return this.rows.filter(r => r.quantityInStock === 0).length; }
  get changedCount(): number { return this.rows.filter(r => r.hasChanges).length; }

  get displayedRows(): InventoryRow[] {
    return this.showLowStockOnly
      ? this.rows.filter(r => this.isRowLow(r))
      : this.rows;
  }

  get lowStockRows(): InventoryRow[] {
    return this.rows.filter(r => this.isRowLow(r));
  }

  // ── Row helpers ────────────────────────────────────────────────────────────

  isRowLow(row: InventoryRow): boolean {
    return row.quantityInStock < row.reorderLevel;
  }

  isRowOut(row: InventoryRow): boolean {
    return row.quantityInStock === 0;
  }

  stockLevel(row: InventoryRow): 'out' | 'low' | 'ok' {
    if (row.quantityInStock === 0) return 'out';
    if (this.isRowLow(row)) return 'low';
    return 'ok';
  }

  getStockPercent(row: InventoryRow): number {
    const max = Math.max(row.reorderLevel * 3, row.quantityInStock, 1);
    return Math.min((row.quantityInStock / max) * 100, 100);
  }

  // How far past reorder level the stock is, as a percent of reorder level
  getReorderBreachPercent(row: InventoryRow): number {
    if (!this.isRowLow(row) || row.reorderLevel === 0) return 0;
    const deficit = row.reorderLevel - row.quantityInStock;
    return Math.min((deficit / row.reorderLevel) * 100, 100);
  }

  markChanged(row: InventoryRow): void {
    row.hasChanges = row.editQty !== row.quantityInStock || row.editReorder !== row.reorderLevel;
    row.saved = false;
  }

  // ── Save single row ────────────────────────────────────────────────────────

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
        setTimeout(() => row.saved = false, 2500);
      },
      error: () => {
        row.saving = false;
        this.showToast('Failed to save row.', 'error');
      }
    });
  }

  // ── Bulk save all changed rows ─────────────────────────────────────────────

  saveAllChanged(): void {
    const changed = this.rows.filter(r => r.hasChanges);
    if (!changed.length) return;

    this.bulkSaving = true;
    let completed = 0;
    let failed = 0;

    changed.forEach(row => {
      row.saving = true;
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
          completed++;
          if (completed + failed === changed.length) {
            this.bulkSaving = false;
            const msg = failed > 0
              ? `${completed} saved, ${failed} failed.`
              : `${completed} rows saved successfully!`;
            this.showToast(msg, failed > 0 ? 'warning' : 'success');
            changed.forEach(r => setTimeout(() => r.saved = false, 2500));
          }
        },
        error: () => {
          row.saving = false;
          failed++;
          completed++;
          if (completed + failed === changed.length) {
            this.bulkSaving = false;
            this.showToast(`${completed} saved, ${failed} failed.`, 'warning');
          }
        }
      });
    });
  }

  // ── Toast ──────────────────────────────────────────────────────────────────

  showToast(msg: string, type: 'success' | 'error' | 'warning'): void {
    this.toast = msg;
    this.toastType = type;
    setTimeout(() => this.toast = '', 3500);
  }

  goManage(): void { this.router.navigate(['/medicine/admin/manage']); }
}