import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EmailLog {
  emailLogId: number;
  userId: number;
  orderId: number;
  emailType: string;
  sentAt: string;
  status: string;
  errorMessage: string | null;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private base = `${environment.apiUrl}/notification`;

  constructor(private http: HttpClient) {}

  getAllLogs(): Observable<EmailLog[]> {
    return this.http.get<EmailLog[]>(`${this.base}/logs`);
  }

  getLogsByOrder(orderId: number): Observable<EmailLog[]> {
    return this.http.get<EmailLog[]>(`${this.base}/logs/order/${orderId}`);
  }
}