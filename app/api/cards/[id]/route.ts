import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("businessCards");
    
    // First, let's log the exact query we're making
    console.log('Querying for ID:', params.id);

    // Get the document and log its raw form
    const card = await db.collection("cards").findOne(
      { _id: new ObjectId(params.id) }
    );

    console.log('Raw MongoDB Document:', JSON.stringify(card, null, 2));

    // Let's also directly check if this document exists in the collection
    const documentCount = await db.collection("cards").countDocuments(
      { _id: new ObjectId(params.id) }
    );
    console.log('Document exists:', documentCount > 0);

    // List all fields in the collection
    const sampleDocument = await db.collection("cards").findOne({});
    console.log('Available fields in collection:', Object.keys(sampleDocument || {}));

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 }
    );
  }
} 