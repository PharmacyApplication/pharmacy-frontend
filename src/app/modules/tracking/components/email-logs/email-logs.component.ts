import { Component, OnInit } from '@angular/core';
import { NotificationService, EmailLog } from '../../services/notification.service';

@Component({
  selector: 'app-email-logs',
  templateUrl: './email-logs.component.html',
  styleUrls: ['./email-logs.component.css'],
})
export class EmailLogsComponent implements OnInit {
  logs: EmailLog[] = [];
  loading = true;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getAllLogs().subscribe({
      next: (data) => { this.logs = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }
}