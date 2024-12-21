export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("businessCards");

    // Get user's card IDs from userLimits collection
    const userLimits = await db.collection("userLimits").findOne({ email });
    
    if (!userLimits) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch only the cards that belong to this user
    const cards = await db.collection("cards")
      .find({ userId: { $in: userLimits.cardIds } })
      .toArray();

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}
