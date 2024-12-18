import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { userid: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("businessCards");

    // Check if user is admin or card creator
    const card = await db.collection("cards").findOne({ userId: params.userid });
    
    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
    const isCreator = card.creatorEmail === session.user.email;

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: "Unauthorized to edit this card" }, { status: 403 });
    }

    const data = await request.json();

    // Add validation for required fields
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No data provided for update' },
        { status: 400 }
      );
    }

    // Ensure userId matches the route parameter
    if (data.userId && data.userId !== params.userid) {
      return NextResponse.json(
        { error: 'userId mismatch' },
        { status: 400 }
      );
    }

    // Remove any fields that shouldn't be updated
    delete data._id;
    delete data.createdAt;

    // Add updatedAt timestamp
    data.updatedAt = new Date();

    const result = await db.collection('cards').updateOne(
      { userId: params.userid },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Fetch the updated card to return
    const updatedCard = await db.collection('cards').findOne(
      { userId: params.userid }
    );

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json(
      { error: 'Failed to update card', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { userid: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("businessCards");
    const card = await db.collection('cards').findOne(
      { userId: params.userid }
    );

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userid: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("businessCards");

    const result = await db.collection('cards').deleteOne(
      { userId: params.userid }
    );

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 }
    );
  }
} 