import { Component, OnInit } from '@angular/core';
import { MedicineService, MedicineDto } from '../../services/medicine.service';

@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  allMedicines: MedicineDto[] = [];
  filteredMedicines: MedicineDto[] = [];
  categories: { id: number; name: string }[] = [];

  searchTerm = '';
  selectedCategoryId = 0;
  isLoading = true;
  errorMessage = '';

  constructor(private medicineService: MedicineService) {}

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    this.isLoading = true;
    this.medicineService.getAll().subscribe({
      next: (data) => {
        this.allMedicines = data;
        this.filteredMedicines = data;
        this.extractCategories(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load medicines.';
        this.isLoading = false;
      }
    });
  }

  extractCategories(medicines: MedicineDto[]): void {
    const map = new Map<number, string>();
    medicines.forEach(m => map.set(m.categoryId, m.categoryName));
    this.categories = Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }

  applyFilters(): void {
    this.filteredMedicines = this.allMedicines.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          m.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategory = this.selectedCategoryId === 0 || m.categoryId === this.selectedCategoryId;
      return matchSearch && matchCategory;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  isInStock(medicine: MedicineDto): boolean {
    return medicine.quantityInStock > 0;
  }
}


