export interface Prescription {
  prescriptionId: number;
  userId: number;
  medicineId: number;
  medicineName?: string;
  filePath: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}