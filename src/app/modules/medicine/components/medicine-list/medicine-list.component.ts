import { Component, OnInit } from '@angular/core';
import { MedicineService, MedicineDto } from '../../services/medicine.service';

interface CategoryTab {
  id: number;
  name: string;
}

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  allMedicines: MedicineDto[] = [];
  filteredMedicines: MedicineDto[] = [];
  categories: CategoryTab[] = [];

  searchTerm = '';
  selectedCategoryId = 0;
  isLoading = true;
  errorMessage = '';

  constructor(private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    this.medicineService.getAll().subscribe({
      next: (data) => {
        this.allMedicines = data;
        this.filteredMedicines = [...data];
        this.buildCategoryTabs(data);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load medicines. Please try again.';
        this.isLoading = false;
      }
    });
  }

  buildCategoryTabs(medicines: MedicineDto[]): void {
    const map = new Map<number, string>();
    medicines.forEach(m => {
      if (!map.has(m.categoryId)) map.set(m.categoryId, m.categoryName);
    });
    this.categories = Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }

  // FIX: filter purely client-side on the already-loaded full list
  selectCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let list = this.allMedicines;

    // category filter
    if (this.selectedCategoryId !== 0) {
      list = list.filter(m => m.categoryId === this.selectedCategoryId);
    }

    // search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      list = list.filter(m =>
        m.name.toLowerCase().includes(term) ||
        (m.description ?? '').toLowerCase().includes(term) ||
        m.categoryName.toLowerCase().includes(term)
      );
    }

    this.filteredMedicines = list;
  }

  isInStock(m: MedicineDto): boolean {
    return m.quantityInStock > 0;
  }

  get totalCount(): number { return this.filteredMedicines.length; }
}


