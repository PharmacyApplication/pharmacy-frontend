import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface InventoryDto {
  inventoryId: number;
  medicineId: number;
  medicineName: string;
  quantityInStock: number;
  reorderLevel: number;
  lastUpdated: string;
  isLowStock: boolean;
}

export interface UpdateInventoryDto {
  quantityInStock: number;
  reorderLevel: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryDto[]> {
    return this.http.get<InventoryDto[]>(this.apiUrl);
  }

  updateStock(medicineId: number, dto: UpdateInventoryDto): Observable<InventoryDto> {
    return this.http.put<InventoryDto>(`${this.apiUrl}/${medicineId}`, dto);
  }

  getLowStock(): Observable<InventoryDto[]> {
    return this.http.get<InventoryDto[]>(`${this.apiUrl}/low-stock`);
  }
}

