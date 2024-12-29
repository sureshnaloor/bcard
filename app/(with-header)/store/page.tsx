'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { cardSets } from '@/data/card-sets';
import StoreCardSet from '@/components/store/StoreCardSet';
import { useState } from 'react';
import { useShopping } from '@/context/ShoppingContext';
import Image from 'next/image';
import Link from 'next/link';

export default function StorePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/store');
    },
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'single' | 'triple' | 'quintuple'>('all');
  const { state, loading } = useShopping();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredSets = activeFilter === 'all' 
    ? cardSets 
    : cardSets.filter(set => set.type === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Card Store
      </h1>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        {['all', 'single', 'triple', 'quintuple'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              ${activeFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Sets
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSets.map((set) => (
          <StoreCardSet key={set.id} set={set} />
        ))}
      </div>

      {/* Shopping Summary Section */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wishlist Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Wishlist ({state.wishlist.length})
              </h2>
              <Link 
                href="/wishlist"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View All
              </Link>
            </div>
            
            {state.wishlist.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                Your wishlist is empty
              </p>
            ) : (
              <div className="space-y-4">
                {state.wishlist.slice(0, 3).map((item) => {
                  const set = cardSets.find(s => s.id === item.productId);
                  if (!set) return null;
                  
                  return (
                    <div key={item.productId} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={set.image}
                          alt={set.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {set.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {set.currency} {set.price}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Cart ({state.cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>
              <Link 
                href="/cart"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View Cart
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              state.cart.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {state.cart.slice(0, 3).map((item) => {
                      const set = cardSets.find(s => s.id === item.productId);
                      if (!set) return null;
                      
                      return (
                        <div key={item.productId} className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={set.image}
                              alt={set.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.quantity} × {item.currency} {item.unitPrice}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.currency} {(item.unitPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        Subtotal
                      </span>
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        USD {state.cart.reduce((sum, item) => 
                          sum + (item.unitPrice * item.quantity), 0
                        ).toFixed(2)}
                      </span>
                    </div>
                    <Link
                      href="/checkout"
                      className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 