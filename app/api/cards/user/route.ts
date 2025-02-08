export const dynamic = 'force-dynamic';

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your actual database name
    
    const cards = await db.collection('cards').find({ 
      userId: email
    }).toArray();

    return NextResponse.json({ cards: cards || [] });
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return NextResponse.json({ cards: [] }, { status: 500 });
  }
}
