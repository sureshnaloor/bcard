import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("businessCards");
    
    const userData = await db.collection("userdata").findOne({
      email: session.user.email
    });

    if (!userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${userData.name}
ORG:${userData.company}
TITLE:${userData.title}
EMAIL:${userData.email}
TEL:${userData.phone}
URL:${userData.website}
ADR:;;${userData.address?.street};${userData.address?.city};;${userData.address?.country}
END:VCARD`;

    return new NextResponse(vCardContent, {
      headers: {
        'Content-Type': 'text/vcard',
        'Content-Disposition': `attachment; filename="${userData.name}.vcf"`,
      },
    });
  } catch (error) {
    console.error('Error generating vCard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { vCardContent, userEmail } = await request.json()

    const client = await clientPromise
    const db = client.db("test")

    // Update the user's document with vCard content
    const result = await db.collection("userdata").updateOne(
      { workEmail: userEmail },
      { 
        $set: { 
          vCardContent: vCardContent,
          vCardUpdatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "vCard stored successfully" },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error storing vCard:', error)
    return NextResponse.json(
      { error: "Failed to store vCard" },
      { status: 500 }
    )
  }
}