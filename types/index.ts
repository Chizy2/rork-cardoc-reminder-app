export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscriptionStatus: 'active' | 'expired' | 'trial';
  subscriptionExpiry: string;
  profilePhoto?: string;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'truck' | 'bike' | 'bus' | 'other';
  name: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: string;
  imageUri?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  vehicleId: string;
  type: 'insurance' | 'license' | 'roadworthiness' | 'emission' | 'registration' | 'other';
  customName?: string;
  expiryDate: string;
  imageUri?: string;
  status: 'valid' | 'expiring' | 'expired';
  createdAt: string;
  updatedAt: string;
  history?: DocumentHistory[];
}

export interface DocumentHistory {
  id: string;
  expiryDate: string;
  imageUri?: string;
  updatedAt: string;
}

export type ReminderType = 'maintenance' | 'insurance' | 'registration' | 'service' | 'oil_change' | 'tire_rotation' | 'other';

export type DocumentStatus = 'valid' | 'expiring' | 'expired';

export interface ReminderHistory {
  id: string;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  description?: string;
  completedAt: string;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  description?: string;
  isCustom: boolean;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  history?: ReminderHistory[];
}

export interface RenewalRequest {
  city: string;
  vehicleCategory: string;
  registrationNumber: string;
  documentType: string;
  paperType: string;
  estimatedPrice: number;
}