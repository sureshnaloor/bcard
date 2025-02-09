import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { generateShortId } from '@/utils/profileidgenerator';

// Get profile by user email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('test');  // Explicitly use 'test' database
    
    // Query by userId (which is session.user.email)
    const profile = await db.collection('profiles').findOne({ userId: email });
    console.log('DEBUG: Fetched profile:', profile);
    
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
    console.log('DEBUG: Received body:', body);

    const { 
      userId,  // This is session.user.email
      email,   // This is the editable email field
      name,
      position,
      companyName,
      linkedinUrl,
      description,
      location,
      birthday,
      anniversary,
      richContent,
      youtubeUrl,
      backgroundColor, // New field
      logo,           // New field
    } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate logo size if present
    if (logo) {
      const base64Size = Buffer.from(logo.split(',')[1], 'base64').length;
      if (base64Size > 10 * 1024) {
        return NextResponse.json({ error: 'Logo must be less than 10KB' }, { status: 400 });
      }
    }

    const client = await clientPromise;
    const db = client.db('test');  // Explicitly use 'test' database

    // First check if profile exists
    const existingProfile = await db.collection('profiles').findOne({ userId });
    
    // Use existing _id if profile exists, otherwise generate new one
    const _id = existingProfile ? existingProfile._id : new ObjectId();
    
    // Generate shortId from ObjectId
    const shortId = generateShortId(_id.toString());

    const updateData = {
      $set: {
        userId,
        email,
        name,
        position,
        companyName,
        linkedinUrl,
        description,
        location,
        birthday: birthday ? new Date(birthday) : null,
        anniversary: anniversary ? new Date(anniversary) : null,
        richContent,
        youtubeUrl,
        backgroundColor,
        logo,
        shortId,
        updatedAt: new Date()
      }
    };

    // Only include $setOnInsert if this is a new profile
    if (!existingProfile) {
      updateData.$setOnInsert = {
        _id,
        createdAt: new Date()
      };
    }

    console.log('DEBUG: Update data:', updateData);

    // Save to profiles collection, using userId as the identifier
    const result = await db.collection('profiles').updateOne(
      { userId }, 
      updateData,
      { upsert: true }
    );

    console.log('DEBUG: MongoDB result:', result);

    return NextResponse.json({ 
      success: true, 
      profile: { ...updateData.$set, _id },
      shortId,
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
    const db = client.db('test');  // Explicitly use 'test' database
    
    // Delete by userId
    await db.collection('profiles').deleteOne({ userId: email });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
} 