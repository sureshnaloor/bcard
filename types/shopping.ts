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

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;  // Price per unit
  totalPrice: number; // quantity * unitPrice
  currency: string;
  image: string;
  description: string;
  addedAt: Date;
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

export interface UserWishlist {
  _id?: string;
  userId: string;
  email: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCart {
  _id?: string;
  userId: string;
  email: string;
  items: CartItem[];
  subtotal: number;    // Sum of all items' totalPrice
  shippingFee: number; // Fixed or calculated shipping fee
  total: number;       // subtotal + shippingFee
  createdAt: Date;
  updatedAt: Date;
} 