'use client';

import { cardSets } from '@/data/card-sets';
import StoreCardSet from '@/components/store/StoreCardSet';
import { useState } from 'react';

export default function StorePage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'single' | 'triple' | 'quintuple'>('all');

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
    </div>
  );
} 