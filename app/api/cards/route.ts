import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { shortenId } from '@/utils/idConverter';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Updated import path

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("businessCards");

    // Check user limits
    const userLimits = await db.collection("userLimits").findOne({
      email: session.user.email
    });

    if (!userLimits) {
      return NextResponse.json({ error: "User limits not found" }, { status: 404 });
    }

    if (userLimits.cardIds.length >= userLimits.cardLimit) {
      return NextResponse.json({ error: "Card creation limit reached" }, { status: 403 });
    }

    const data = await request.json();
    
    // Add creator information
    const cardData = {
      ...data,
      creatorEmail: session.user.email,
      createdAt: new Date()
    };

    const result = await db.collection("cards").insertOne(cardData);
    const shortId = shortenId(result.insertedId.toString());

    // Update the card with shortId
    await db.collection("cards").updateOne(
      { _id: result.insertedId },
      { $set: { userId: shortId } }
    );

    // Update user's cardIds array
    await db.collection("userLimits").updateOne(
      { email: session.user.email },
      { 
        $push: { cardIds: { $each: [shortId] } } as any,
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({ 
      message: "Card created successfully",
      id: result.insertedId,
      shortId: shortId,
      url: `/card/${shortId}`
    });
  } catch (error) {
    console.error("Error creating card:", error);
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
    
    // Fetch all cards (for admin)
    const cards = await db.collection("cards")
      .find({})
      .toArray();

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
} 