'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface CardLimitsProps {
  onLimitStatus?: (hasReachedLimit: boolean) => void;
}

export default function CardLimits({ onLimitStatus }: CardLimitsProps) {
  const { data: session } = useSession();
  const [limits, setLimits] = useState<{ total: number; used: number; remaining: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/user/limits')
        .then(res => res.json())
        .then(data => {
          setLimits(data);
          setLoading(false);
          onLimitStatus?.(data.remaining === 0);
        })
        .catch(err => {
          console.error('Error fetching limits:', err);
          setLoading(false);
        });
    }
  }, [session, onLimitStatus]);

  if (!session || loading) return null;

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow">
      <div className="text-sm text-gray-600">
        Card Limits: {limits?.used}/{limits?.total}
      </div>
      {/* {limits?.remaining === 0 && (
        <div className="mt-2 text-sm text-red-600 font-medium">
          You have reached your card creation limit
        </div>
      )} */}
    </div>
  );
} 