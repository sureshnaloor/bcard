import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { shortenId } from '@/utils/idConverter';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("businessCards");
    const data = await request.json();

    const cardData = {
      ...data,
      createdAt: new Date()
    };

    // Log to verify vCard content is present
    console.log('vCard Filename:', cardData.vCardFileName);
    console.log('vCard Content length:', cardData.vCardContent?.length);

    const result = await db.collection("cards").insertOne(cardData);
    const shortId = shortenId(result.insertedId.toString());
    
    return NextResponse.json({ 
      message: "Card created successfully", 
      id: result.insertedId,
      shortId: shortId,
      url: `/card/${shortId}`
    });
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}

// Helper function to validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("businessCards");
    const cards = await db.collection("cards").find({}).toArray();
    
    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
} 