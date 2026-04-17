export interface EmailLog {
  emailLogId: number;
  userId: number;
  orderId: number;
  emailType: 'OrderConfirmation' | 'Shipped' | 'Delivered';
  sentAt: string;
  status: 'Sent' | 'Failed';
  errorMessage?: string;
}