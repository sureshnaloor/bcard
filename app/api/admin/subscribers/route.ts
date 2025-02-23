import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Fixed import path

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verify admin
    if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, subscriptionPeriod, shortId, subscriptionStartDate } = await request.json();

    const client = await clientPromise;
    const db = client.db("test");

    const result = await db.collection("userdata").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isSubscriber: true,
          subscriptionStartDate,
          subscriptionPeriod,
          shortId,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subscription updated successfully" });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 