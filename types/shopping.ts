export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  currency: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  currency: string;
} 