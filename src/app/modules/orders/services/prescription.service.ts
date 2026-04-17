import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Prescription } from '../../../core/models/prescription.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = `${environment.apiUrl}/prescription`;

  constructor(private http: HttpClient) {}

  uploadPrescription(medicineId: number, file: File): Observable<Prescription> {
    const formData = new FormData();
    formData.append('MedicineId', medicineId.toString());
    formData.append('File', file);
    return this.http.post<Prescription>(`${this.apiUrl}/upload`, formData);
  }

  getMyPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/my`);
  }

  reviewPrescription(id: number, status: string, rejectionReason?: string): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/${id}/review`, { status, rejectionReason });
  }
}