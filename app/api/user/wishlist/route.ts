import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { UserWishlist, WishlistItem } from '@/types/shopping';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const wishlist = await db.collection<UserWishlist>('wishlists')
      .findOne({ email: session.user.email });

    return NextResponse.json({ 
      success: true,
      items: wishlist?.items || [] 
    });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    if (!body.productId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection<UserWishlist>('wishlists').updateOne(
      { email: session.user.email },
      {
        $setOnInsert: {
          userId: session.user.id || new ObjectId().toString(),
          email: session.user.email,
          createdAt: new Date(),
        },
        $set: {
          updatedAt: new Date(),
        },
        $addToSet: {
          items: { 
            productId: body.productId, 
            addedAt: new Date() 
          }
        }
      },
      { upsert: true }
    );

    // Fetch updated wishlist
    const updatedWishlist = await db.collection<UserWishlist>('wishlists')
      .findOne({ email: session.user.email });

    return NextResponse.json({ 
      success: true, 
      result,
      items: updatedWishlist?.items || []
    });
  } catch (error) {
    console.error('Wishlist POST error:', error);
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
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    if (!body.productId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection<UserWishlist>('wishlists').updateOne(
      { email: session.user.email },
      {
        $pull: { items: { productId: body.productId } },
        $set: { updatedAt: new Date() }
      }
    );

    // Fetch updated wishlist
    const updatedWishlist = await db.collection<UserWishlist>('wishlists')
      .findOne({ email: session.user.email });

    return NextResponse.json({ 
      success: true, 
      result,
      items: updatedWishlist?.items || []
    });
  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
} 