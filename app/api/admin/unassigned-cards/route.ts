import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("businessCards");
    
    // Get all userIds that are currently assigned (from userLimits collection)
    const userLimits = await db.collection("userLimits").find({}).toArray();
    const assignedUserIds = userLimits.reduce((acc: string[], user) => {
      return [...acc, ...user.cardIds];
    }, []);

    // Get cards that are not assigned to any user
    const unassignedCards = await db.collection("cards")
      .find({
        userId: { $nin: assignedUserIds },
        email: { $exists: false }
      })
      .toArray();
    
    return NextResponse.json(unassignedCards);
  } catch (error) {
    console.error('Error fetching unassigned cards:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 