import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Validate and process the photo if it exists
    if (data.photo && data.photo.length > 1000000) { // Check if base64 string is too long
      return NextResponse.json(
        { error: 'Photo size too large' },
        { status: 400 }
      );
    }

    const { _id, ...dataWithoutId } = data; // Remove _id from the update data
    const result = await db.collection('digivcard').updateOne(
      { userId: session.user.email },
      { 
        $set: {
          ...dataWithoutId,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error saving vCard:', error);
    return NextResponse.json(
      { error: 'Error saving vCard' },
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

export async function PUT(request: Request) {
  try {
    const card = await request.json();
    const { _id, ...cardWithoutId } = card; // Remove _id from the update data
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('cards').updateOne(
      { _id: new ObjectId(_id) },
      { $set: cardWithoutId }
    );
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error saving card:', error);
    return Response.json({ error: 'Failed to save card' }, { status: 500 });
  }
} 