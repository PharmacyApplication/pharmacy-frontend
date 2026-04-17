export interface Cart {
  cartId: number;
  userId: number;
  cartItems: CartItem[];
}

export interface CartItem {
  cartItemId: number;
  cartId: number;
  medicineId: number;
  medicineName?: string;
  medicinePrice?: number;
  quantity: number;
  prescriptionId?: number;
}