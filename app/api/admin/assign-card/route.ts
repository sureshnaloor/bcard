import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, cardId } = await request.json();
    
    const client = await clientPromise;
    const db = client.db("businessCards");
    
    // Get user limits
    const userLimit = await db.collection("userLimits").findOne({ email });
    
    if (!userLimit) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (userLimit.cardIds.length >= userLimit.cardLimit) {
      return NextResponse.json({ error: 'User has reached their card limit' }, { status: 400 });
    }

    // Get the card to verify it's not already assigned
    const card = await db.collection("cards").findOne({ 
      _id: new ObjectId(cardId)
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Check if this userId is already assigned to any user
    const existingAssignment = await db.collection("userLimits").findOne({
      cardIds: card.userId
    });

    if (existingAssignment) {
      return NextResponse.json({ error: 'Card is already assigned to another user' }, { status: 400 });
    }
    
    // Update userLimits collection
    await db.collection("userLimits").updateOne(
      { email },
      { 
        $push: { cardIds: card.userId },
        $set: { updatedAt: new Date() }
      }
    );
    
    // Update cards collection with email
    await db.collection("cards").updateOne(
      { _id: new ObjectId(cardId) },
      { 
        $set: { 
          email: email,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error assigning card:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 