import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("businessCards");
    
    const card = await db.collection("cards").findOne(
      { _id: new ObjectId(params.id) }
    );

    if (!card || !card.vCardContent) {
      return NextResponse.json({ error: "vCard not found" }, { status: 404 });
    }

    // Set proper headers for vCard download
    const headers = new Headers();
    headers.set('Content-Type', 'text/vcard');
    headers.set('Content-Disposition', `inline; filename="${card.vCardFileName || 'contact.vcf'}"`);

    return new Response(card.vCardContent, {
      headers,
    });
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { error: "Failed to fetch vCard" },
      { status: 500 }
    );
  }
} 