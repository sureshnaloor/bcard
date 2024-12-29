'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useShopping } from '@/context/ShoppingContext';
import CardSetList from '@/components/cards/CardSetList';
import { cardSets } from '@/data/card-sets';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';

export default function WishlistPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/wishlist');
    },
  });
  const { state } = useShopping();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  const wishlistItems = state.wishlist;
  const wishlistSets = cardSets.filter(set => 
    wishlistItems.some(item => item.productId === set.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        My Wishlist
      </h1>

      {wishlistSets.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <CardSetList sets={wishlistSets} />
      )}
    </div>
  );
} 