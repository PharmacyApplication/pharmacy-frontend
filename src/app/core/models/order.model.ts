export interface Order {
  orderId: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  totalAmount: number;
  status: 'Ordered' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: string;
  placedAt: string;
  updatedAt?: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  medicineId: number;
  medicineName?: string;
  quantity: number;
  unitPrice: number;
  prescriptionId?: number;
}

export interface PlaceOrderRequest {
  shippingAddress: string;
}