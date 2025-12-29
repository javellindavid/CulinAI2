
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  allergies: string[];
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  matchedPantryItems?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export enum ExpiryStatus {
  FRESH = 'fresh',
  WARNING = 'warning',
  EXPIRED = 'expired'
}
