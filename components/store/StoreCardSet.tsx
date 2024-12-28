'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CardSet } from '@/types/cards';
import { useShopping } from '@/context/ShoppingContext';
import ImageGallery from './ImageGallery';

interface StoreCardSetProps {
  set: CardSet;
}

export default function StoreCardSet({ set }: StoreCardSetProps) {
  const [quantity, setQuantity] = useState(1);
  const [showGallery, setShowGallery] = useState(false);
  const { dispatch, state } = useShopping();

  const isInWishlist = state.wishlist.some(item => item.productId === set.id);

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        productId: set.id,
        name: set.name,
        quantity: quantity,
        unitPrice: set.price,
        totalPrice: set.price * quantity,
        currency: set.currency,
        image: set.image,
        description: set.description,
        addedAt: new Date()
      }
    });
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch({
        type: 'REMOVE_FROM_WISHLIST',
        payload: set.id,
      });
    } else {
      dispatch({
        type: 'ADD_TO_WISHLIST',
        payload: {
          productId: set.id,
          addedAt: new Date(),
        },
      });
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Main Image */}
        <div 
          className="relative h-64 cursor-pointer"
          onClick={() => setShowGallery(true)}
        >
          <Image
            src={set.image}
            alt={set.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            View Gallery
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {set.name}
            </h3>
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-full ${
                isInWishlist 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {set.description}
          </p>

          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {set.currency} {set.price}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              per set
            </span>
          </div>

          {/* Cards in Set */}
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

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Quantity:
            </label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border-r hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border-l hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery
          images={set.images}
          onClose={() => setShowGallery(false)}
          title={set.name}
        />
      )}
    </>
  );
} 