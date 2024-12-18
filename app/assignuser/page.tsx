'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface UserLimit {
  email: string;
  cardLimit: number;
  cardIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface UnassignedCard {
  _id: string;
  userId: string;
  name: string;
  email?: string;
}

export default function AssignUser() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [users, setUsers] = useState<UserLimit[]>([]);
  const [unassignedCards, setUnassignedCards] = useState<UnassignedCard[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [newLimit, setNewLimit] = useState(1);
  const [loading, setLoading] = useState(true);

  // Protect route - redirect if not admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      toast.error('Unauthorized access');
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch users and unassigned cards
  useEffect(() => {
    if (session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      fetchInitialData();
    }
  }, [session]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchUnassignedCards()]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    }
  };

  const fetchUnassignedCards = async () => {
    try {
      const res = await fetch('/api/admin/unassigned-cards');
      if (!res.ok) throw new Error('Failed to fetch unassigned cards');
      const data = await res.json();
      setUnassignedCards(data);
    } catch (error) {
      toast.error('Failed to fetch unassigned cards');
      console.error(error);
    }
  };

  const handleAssignCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/assign-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedUser,
          cardId: selectedCard,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Card assigned successfully');
        setSelectedCard('');
        await fetchInitialData();
      } else {
        toast.error(data.error || 'Failed to assign card');
      }
    } catch (error) {
      toast.error('Error assigning card');
      console.error(error);
    }
  };

  const handleUpdateLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/update-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedUser,
          newLimit,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Limit updated successfully');
        await fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update limit');
      }
    } catch (error) {
      toast.error('Error updating limit');
      console.error(error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null;
  }

  const selectedUserData = users.find(u => u.email === selectedUser);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Assign Users & Manage Limits</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assign Card Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Assign Card</h2>
          <form onSubmit={handleAssignCard} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Select User</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.email} (Cards: {user.cardIds.length}/{user.cardLimit})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Select Card</label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a card</option>
                {unassignedCards.map((card) => (
                  <option key={card._id} value={card._id}>
                    {card.name} (UserID: {card.userId})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={!selectedUser || !selectedCard}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Assign Card
            </button>
          </form>
        </div>

        {/* Update Limit Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Update User Limit</h2>
          <form onSubmit={handleUpdateLimit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Select User</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.email} (Current limit: {user.cardLimit})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">New Limit</label>
              <input
                type="number"
                min="1"
                value={newLimit}
                onChange={(e) => setNewLimit(parseInt(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={!selectedUser || newLimit < 1}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Update Limit
            </button>
          </form>
        </div>
      </div>

      {/* Current Assignments Section */}
      {selectedUserData && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Current Assignments for {selectedUserData.email}
          </h3>
          <div className="space-y-2">
            {selectedUserData.cardIds.length > 0 ? (
              selectedUserData.cardIds.map((cardId, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">UserID: {cardId}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No cards assigned yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 