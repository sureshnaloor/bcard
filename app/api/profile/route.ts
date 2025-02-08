import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Get profile by user email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");
    
    const profile = await db.collection('profiles').findOne({ email });
    
    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// Create or update profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received profile data:', body); // Debug log

    const { 
      email,
      name,
      position,
      companyName,
      linkedinUrl, // Ensure this is included
      description,
      location,
      birthday,
      anniversary,
      richContent,
      youtubeUrl
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");

    const profile = {
      email,
      name,
      position,
      companyName,
      linkedinUrl, // Include in profile object
      description,
      location,
      birthday: birthday ? new Date(birthday) : null,
      anniversary: anniversary ? new Date(anniversary) : null,
      richContent,
      youtubeUrl,
      updatedAt: new Date(),
    };

    const result = await db.collection('profiles').updateOne(
      { email },
      { $set: profile },
      { upsert: true }
    );

    console.log('Save result:', result); // Debug log

    return NextResponse.json({ 
      success: true, 
      profile,
      upserted: result.upsertedId ? true : false 
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

// Delete profile
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");
    
    await db.collection('profiles').deleteOne({ email });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
} 