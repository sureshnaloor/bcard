import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('digivcard');

    // Get the most recent card for this user
    const card = await collection
      .findOne(
        { userId: session.user.email },
        { sort: { createdAt: -1 } }
      );

    return NextResponse.json({ card });

  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json(
      { error: 'Error fetching card' },
      { status: 500 }
    );
  }
} 