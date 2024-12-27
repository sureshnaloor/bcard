'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, WishlistItem, Address } from '@/types/shopping';

interface ShoppingState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addresses: Address[];
  selectedAddress?: Address;
  selectedShippingMethod?: string;
}

type ShoppingAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'SELECT_ADDRESS'; payload: Address }
  | { type: 'SELECT_SHIPPING'; payload: string }
  | { type: 'CLEAR_CART' };

const initialState: ShoppingState = {
  cart: [],
  wishlist: [],
  addresses: [],
  selectedAddress: undefined,
  selectedShippingMethod: undefined,
};

const ShoppingContext = createContext<{
  state: ShoppingState;
  dispatch: React.Dispatch<ShoppingAction>;
} | undefined>(undefined);

function shoppingReducer(state: ShoppingState, action: ShoppingAction): ShoppingState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.productId !== action.payload),
      };

    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
      };

    case 'SELECT_ADDRESS':
      return {
        ...state,
        selectedAddress: action.payload,
      };

    case 'SELECT_SHIPPING':
      return {
        ...state,
        selectedShippingMethod: action.payload,
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
}

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);

  return (
    <ShoppingContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (context === undefined) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
} 