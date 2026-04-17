export interface Medicine {
  medicineId: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  requiresPrescription: boolean;
  imageUrl?: string;
  isActive: boolean;
  quantityInStock?: number;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
}

export interface Inventory {
  inventoryId: number;
  medicineId: number;
  medicineName?: string;
  quantityInStock: number;
  reorderLevel: number;
  lastUpdated: string;
}