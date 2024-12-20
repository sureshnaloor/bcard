'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

interface BusinessCard {
  _id: string;
  userId: string;
  name: string;
  company: string;
  createdAt: string;
  email?: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const endpoint = isAdmin 
          ? '/api/cards' 
          : `/api/cards/user?email=${session?.user?.email}`;
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch cards');
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchCards();
    }
  }, [session, isAdmin]);

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const response = await fetch(`/api/cards/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete card');

      setCards(cards.filter(card => card.userId !== userId));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const filteredCards = isAdmin 
    ? cards 
    : cards.filter(card => card.email === session?.user?.email);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Cards Dashboard</h1>
        <Link
          href="/admin/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <FiPlus /> Create New Card
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <div
              key={card.userId}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{card.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{card.company}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/card/${card.userId}`}
                    className="text-blue-500 hover:text-blue-600"
                    title="View"
                  >
                    <FiEye />
                  </Link>
                  {(isAdmin || card.email === session?.user?.email) && (
                    <>
                      <Link
                        href={`/admin/edit/${card.userId}`}
                        className="text-green-500 hover:text-green-600"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => handleDelete(card.userId)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created: {new Date(card.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 