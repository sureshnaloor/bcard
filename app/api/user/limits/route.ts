import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("businessCards");
    
    const userLimits = await db.collection("userLimits").findOne({
      email: session.user.email
    });

    return NextResponse.json({
      total: userLimits?.cardLimit || 0,
      used: userLimits?.cardIds.length || 0,
      remaining: (userLimits?.cardLimit || 0) - (userLimits?.cardIds.length || 0)
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch limits" }, { status: 500 });
  }
} 