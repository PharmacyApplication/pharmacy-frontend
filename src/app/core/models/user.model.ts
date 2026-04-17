export interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: 'Customer' | 'Admin' | 'Department';
  createdAt: string;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}