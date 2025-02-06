import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('digivcard');

    // Get request body
    const cardData = await req.json();

    // If _id exists, update the existing document
    if (cardData._id) {
      const { _id, ...updateData } = cardData;
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Card updated successfully',
        cardId: _id 
      });
    }

    // If no _id, create new document
    const result = await collection.insertOne({
      ...cardData,
      userId: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Card saved successfully',
      cardId: result.insertedId 
    });

  } catch (error) {
    console.error('Error saving card:', error);
    return NextResponse.json(
      { error: 'Error saving card' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('digivcard');

    const cards = await collection
      .find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ cards });

  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Error fetching cards' },
      { status: 500 }
    );
  }
} 