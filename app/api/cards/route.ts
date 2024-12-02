import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { shortenId } from '@/utils/idConverter';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("businessCards");
    const data = await request.json();
    
    // Destructure the incoming data
    const {
      name,
      title,
      company,
      description,
      linkedin,
      linktree,
      website,
      logoUrl,
      bgImageUrl,
      vCardFileName,
      vCardContent,
      customFields // New field for dynamic custom fields
    } = data;

    // Create the document with all fields including custom fields
    const initialResult = await db.collection("cards").insertOne({
      name,
      title,
      company,
      description,
      linkedin,
      linktree,
      website,
      logoUrl,
      bgImageUrl,
      vCardFileName,
      vCardContent,
      customFields: customFields || [], // Store custom fields as an array
      createdAt: new Date()
    });

    // Generate shortened ID from the MongoDB _id
    const shortId = shortenId(initialResult.insertedId.toString());

    // Update the record with the shortId
    await db.collection("cards").updateOne(
      { _id: initialResult.insertedId },
      { 
        $set: { 
          userId: shortId 
        } 
      }
    );

    console.log('Generated shortId:', shortId);
    
    return NextResponse.json({ 
      message: "Card created successfully", 
      id: initialResult.insertedId,
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