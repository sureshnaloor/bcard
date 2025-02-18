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