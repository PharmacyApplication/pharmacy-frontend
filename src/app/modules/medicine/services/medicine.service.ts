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
}

export interface CreateMedicineDto {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  requiresPrescription: boolean;
  imageUrl: string;
}

export interface UpdateMedicineDto extends CreateMedicineDto {
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private apiUrl = `${environment.apiUrl}/medicine`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicineDto[]> {
    return this.http.get<MedicineDto[]>(this.apiUrl);
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

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


