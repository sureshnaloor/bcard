'use client';

import { CardSet } from '@/types/cards';
import { useShopping } from '@/context/ShoppingContext';
import Image from 'next/image';

interface CardSetListProps {
  sets: CardSet[];
}

export default function CardSetList({ sets }: CardSetListProps) {
  const { state, dispatch } = useShopping();

  const handleAddToCart = (set: CardSet) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: set.id,
        name: set.name,
        quantity: 1,
        unitPrice: set.price,
        totalPrice: set.price * 1,
        currency: set.currency,
        image: set.image,
        description: set.description,
        addedAt: new Date()
      }
    });
  };

  const handleRemoveFromWishlist = (setId: string) => {
    dispatch({
      type: 'REMOVE_FROM_WISHLIST',
      payload: setId,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sets.map((set) => (
        <div 
          key={set.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative h-64">
            <Image
              src={set.image}
              alt={set.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {set.name}
            </h3>
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {set.currency} {set.price}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                per set
              </span>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Cards in this set:
              </h4>
              <div className="flex flex-wrap gap-2">
                {set.cards.map((card) => (
                  <span
                    key={card.id}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {card.material}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleAddToCart(set)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleRemoveFromWishlist(set.id)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 