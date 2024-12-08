'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import ThemeSwitcher from '@/components/ThemeSwitcher';
interface BusinessCard {
  _id: string;
  userId: string;
  name: string;
  company: string;
  createdAt: string;
}

export default function Dashboard() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards');
        if (!response.ok) throw new Error('Failed to fetch cards');
        const data = await response.json();
        setCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const response = await fetch(`/api/cards/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete card');
      
      // Remove card from state
      setCards(cards.filter(card => card.userId !== userId));
    } catch (err) {
      alert('Failed to delete card');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <ThemeSwitcher />
        <h1 className="text-xl font-bold">Business Cards Dashboard</h1>
        <Link 
          href="/admin/create" 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Create New Card
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No business cards found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {cards.map((card) => (
            <div 
              key={card._id} 
              className="bg-white p-6 rounded-lg shadow-sm border flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl text-stone-800 font-semibold">{card.name}</h2>
                <p className="text-gray-600">{card.company}</p>
                <p className="text-sm text-gray-400">
                  Created: {new Date(card.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-teal-800"  > short urlID: {card.userId}</p>
              </div>
              
              <div className="flex gap-3">
                <Link
                  href={`/admin/edit/${card.userId}`}
                  className="flex items-center gap-1 px-3 py-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </Link>

                <Link
                  href={`/card/${card.userId}`}
                  className="flex items-center gap-1 px-3 py-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <FiEye className="w-4 h-4" />
                  View
                </Link>
                <button
                  onClick={() => handleDelete(card.userId)}
                  className="flex items-center gap-1 px-3 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 