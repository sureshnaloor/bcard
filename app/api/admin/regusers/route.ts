import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Updated import path
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Verify admin
    if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("test");

    // Fetch all users from userdata collection
    const users = await db.collection("userdata")
      .find({})
      .project({
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        workEmail: 1,
        isSubscriber: 1,
        subscriptionStartDate: 1,
        subscriptionPeriod: 1,
        shortId: 1
      })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 