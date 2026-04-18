import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface MedicineDto {
  medicineId: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  requiresPrescription: boolean;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  quantityInStock: number;
  reorderLevel: number;
  isLowStock: boolean;   // NEW: server-computed
}

export interface CreateMedicineDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  requiresPrescription: boolean;
  imageUrl: string;
  quantityInStock: number;
  reorderLevel: number;
}

export interface UpdateMedicineDto extends CreateMedicineDto {
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class MedicineService {
  private apiUrl = `${environment.apiUrl}/medicine`;

  constructor(private http: HttpClient) {}

  // Active medicines only (for customer-facing views)
  getAll(): Observable<MedicineDto[]> {
    return this.http.get<MedicineDto[]>(this.apiUrl);
  }

  // All medicines including inactive (for admin manage view)
  getAllIncludingInactive(): Observable<MedicineDto[]> {
    return this.http.get<MedicineDto[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<MedicineDto> {
    return this.http.get<MedicineDto>(`${this.apiUrl}/${id}`);
  }

  getByCategory(categoryId: number): Observable<MedicineDto[]> {
    return this.http.get<MedicineDto[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  create(dto: CreateMedicineDto): Observable<MedicineDto> {
    return this.http.post<MedicineDto>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateMedicineDto): Observable<MedicineDto> {
    return this.http.put<MedicineDto>(`${this.apiUrl}/${id}`, dto);
  }

  // Soft delete — deactivates medicine (reversible)
  softDelete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Hard delete — permanently removes medicine + inventory (irreversible)
  hardDelete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/permanent`);
  }

  // Restore — reactivates a deactivated medicine
  restore(id: number): Observable<MedicineDto> {
    return this.http.patch<MedicineDto>(`${this.apiUrl}/${id}/restore`, {});
  }
}