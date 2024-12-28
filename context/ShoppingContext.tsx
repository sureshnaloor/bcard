'use client';

import { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
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

interface ShoppingContextType {
  state: ShoppingState;
  dispatch: React.Dispatch<ShoppingAction>;
  loading: boolean;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

function shoppingReducer(state: ShoppingState, action: ShoppingAction): ShoppingState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.cart.findIndex(
        item => item.productId === action.payload.productId
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + action.payload.quantity;
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.unitPrice
            };
          }
          return item;
        });

        return {
          ...state,
          cart: updatedCart
        };
      }

      // Add new item
      const newItem = {
        ...action.payload,
        totalPrice: action.payload.quantity * action.payload.unitPrice
      };

      return {
        ...state,
        cart: [...state.cart, newItem]
      };
    }

    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId
            ? {
                ...item,
                quantity: action.payload.quantity,
                totalPrice: action.payload.quantity * item.unitPrice
              }
            : item
        )
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload),
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

export function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const syncInProgress = useRef(false);

  // Calculate cart totals
  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingFee = 9.99; // You can make this dynamic based on your logic
    return {
      subtotal,
      shippingFee,
      total: subtotal + shippingFee
    };
  };

  // Load initial data
  useEffect(() => {
    if (session?.user?.email) {
      setLoading(true);
      Promise.all([
        fetch('/api/user/wishlist').then(res => res.json()),
        fetch('/api/user/cart').then(res => res.json())
      ])
        .then(([wishlistData, cartData]) => {
          if (wishlistData.items) {
            // Clear existing wishlist first
            state.wishlist.forEach(item => {
              dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item.productId });
            });
            // Add new items
            wishlistData.items.forEach((item: WishlistItem) => {
              dispatch({ type: 'ADD_TO_WISHLIST', payload: item });
            });
          }
          if (cartData.items) {
            // Clear existing cart first
            state.cart.forEach(item => {
              dispatch({ type: 'REMOVE_FROM_CART', payload: item.productId });
            });
            // Add new items
            cartData.items.forEach((item: CartItem) => {
              dispatch({ type: 'ADD_TO_CART', payload: item });
            });
          }
        })
        .finally(() => {
          setLoading(false);
          syncInProgress.current = false;
        });
    }
  }, [session]);

  // Sync changes with backend
  const syncWithBackend = async (action: string, data: any) => {
    if (!session?.user?.email || syncInProgress.current) return;

    syncInProgress.current = true;
    try {
      if (action === 'ADD_TO_CART' || action === 'UPDATE_QUANTITY') {
        const { subtotal, shippingFee, total } = calculateTotals(state.cart);
        await fetch('/api/user/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: state.cart,
            subtotal,
            shippingFee,
            total
          }),
        });
      }
      if (action === 'ADD_TO_WISHLIST') {
        await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: data.productId }),
        });
      } else if (action === 'REMOVE_FROM_WISHLIST') {
        await fetch('/api/user/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: data }),
        });
      } else if (action === 'REMOVE_FROM_CART') {
        await fetch('/api/user/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: data }),
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      syncInProgress.current = false;
    }
  };

  // Custom dispatch that handles syncing
  const dispatchWithSync = (action: ShoppingAction) => {
    dispatch(action);
    if (session?.user?.email) {
      switch (action.type) {
        case 'ADD_TO_WISHLIST':
        case 'REMOVE_FROM_WISHLIST':
        case 'ADD_TO_CART':
        case 'REMOVE_FROM_CART':
        case 'UPDATE_QUANTITY':
          syncWithBackend(action.type, action.payload);
          break;
        default:
          break;
      }
    }
  };

  return (
    <ShoppingContext.Provider value={{ state, dispatch: dispatchWithSync, loading }}>
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