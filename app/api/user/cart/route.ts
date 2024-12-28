import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { UserCart } from '@/types/shopping';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const cart = await db.collection<UserCart>('carts')
      .findOne({ email: session.user.email });

    return NextResponse.json({ items: cart?.items || [] });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, subtotal, shippingFee, total } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Update entire cart with new items and totals
    const result = await db.collection<UserCart>('carts').updateOne(
      { email: session.user.email },
      {
        $set: {
          items,
          subtotal,
          shippingFee,
          total,
          updatedAt: new Date()
        },
        $setOnInsert: {
          userId: session.user.id || new ObjectId().toString(),
          email: session.user.email,
          createdAt: new Date(),
        }
      },
      { upsert: true }
    );

    const updatedCart = await db.collection<UserCart>('carts')
      .findOne({ email: session.user.email });

    return NextResponse.json({
      success: true,
      cart: updatedCart
    });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection<UserCart>('carts').updateOne(
      { email: session.user.email },
      {
        $pull: { items: { productId } },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 