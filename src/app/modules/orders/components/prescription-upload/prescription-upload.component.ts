import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../../../core/models/prescription.model';
import { environment } from '../../../../../environments/environment';

interface MedicineOption {
  medicineId: number;
  name: string;
}

@Component({
  selector: 'app-prescription-upload',
  templateUrl: './prescription-upload.component.html',
  styleUrls: ['./prescription-upload.component.css']
})
export class PrescriptionUploadComponent implements OnInit {
  medicines: MedicineOption[] = [];
  prescriptions: Prescription[] = [];

  selectedMedicineId: number | null = null;
  selectedFile: File | null = null;

  isUploading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private prescriptionService: PrescriptionService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadMedicines();
    this.loadPrescriptions();
  }

  loadMedicines(): void {
    this.http.get<MedicineOption[]>(`${environment.apiUrl}/medicine`)
      .subscribe({
        next: (data) => this.medicines = data,
        error: () => this.medicines = []
      });
  }

  loadPrescriptions(): void {
    this.prescriptionService.getMyPrescriptions().subscribe({
      next: (data) => this.prescriptions = data,
      error: () => this.prescriptions = []
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    if (!this.selectedMedicineId || !this.selectedFile) {
      this.errorMessage = 'Please select a medicine and a file.';
      return;
    }

    this.isUploading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.prescriptionService.uploadPrescription(this.selectedMedicineId, this.selectedFile).subscribe({
      next: () => {
        this.isUploading = false;
        this.successMessage = 'Prescription uploaded successfully! Status: Pending review.';
        this.selectedMedicineId = null;
        this.selectedFile = null;
        this.loadPrescriptions();
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = err?.error?.message || 'Upload failed. Please try again.';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  }
}