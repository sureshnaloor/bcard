import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { parseShortId, generateShortId } from '@/utils/profileidgenerator';
import VCard from 'vcard-creator';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { user: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('test');

    let profile;
    
    // Check if the input is a valid ObjectId
    if (params.user.length === 24) {
      profile = await db.collection('profiles').findOne<any>({
        _id: new ObjectId(params.user)
      });
    }

    // If not found or not a valid ObjectId, try finding by shortId
    if (!profile) {
      profile = await db.collection('profiles').findOne<any>({
        shortId: params.user
      });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get digivcard data
    const card = await db.collection('digivcard').findOne({
      userId: profile.userId
    });

    if (!card) {
      return NextResponse.json({ error: 'VCard data not found' }, { status: 404 });
    }

    // Create vCard
    const vcard = new VCard();
    vcard.addName(card.lastName, card.firstName);
    if (card.organization) vcard.addCompany(card.organization);
    if (card.title) vcard.addJobtitle(card.title);
    if (card.email) vcard.addEmail(card.email);
    if (card.mobilePhone) vcard.addPhoneNumber(card.mobilePhone, 'CELL');
    if (card.workPhone) vcard.addPhoneNumber(card.workPhone, 'WORK');
    if (card.address) vcard.addAddress(card.address);
    if (card.website) vcard.addURL(card.website, 'WORK');
    if (card.photo) vcard.addPhoto(card.photo);

    // Return vCard as file download
    return new NextResponse(vcard.toString(), {
      headers: {
        'Content-Type': 'text/vcard',
        'Content-Disposition': `attachment; filename="${card.firstName}_${card.lastName}.vcf"`
      }
    });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return NextResponse.json({ error: 'Failed to generate vCard' }, { status: 500 });
  }
} 