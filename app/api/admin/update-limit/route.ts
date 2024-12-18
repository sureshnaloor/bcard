import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, newLimit } = await request.json();
    
    const client = await clientPromise;
    const db = client.db("businessCards");
    
    await db.collection("userLimits").updateOne(
      { email },
      { 
        $set: { 
          cardLimit: newLimit,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating limit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 