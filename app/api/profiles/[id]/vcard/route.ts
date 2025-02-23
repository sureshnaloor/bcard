import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    
    const profile = await db.collection("userdata").findOne(
      { _id: new ObjectId(params.id) }
    );

    if (!profile || !profile.vCardContent) {
      return NextResponse.json({ error: "vCard not found" }, { status: 404 });
    }

    // Set proper headers for vCard download
    const headers = new Headers();
    headers.set('Content-Type', 'text/vcard');
    headers.set('Content-Disposition', `inline; filename="${profile.firstName}_${profile.lastName}.vcf"`);

    return new Response(profile.vCardContent, {
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