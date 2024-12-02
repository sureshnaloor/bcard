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
    
    console.log('Querying for ID:', params.id);

    const card = await db.collection("cards").findOne(
      { _id: new ObjectId(params.id) },
      {
        projection: {
          name: 1,
          title: 1,
          company: 1,
          description: 1,
          linkedin: 1,
          linktree: 1,
          website: 1,
          logoUrl: 1,
          bgImageUrl: 1,
          vCardFileName: 1,
          vCardContent: 1,
          customFields: 1,
          userId: 1,
          createdAt: 1
        }
      }
    );

    console.log('Raw MongoDB Document:', JSON.stringify(card, null, 2));

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