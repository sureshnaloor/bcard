import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import clientPromise from "@/lib/mongodb"
import { authOptions } from "@/lib/auth"


export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise;
    const db = client.db('test');  // Explicitly use 'test' database

    const userData = await db
      .collection("userdata")
      .findOne({ email: session.user?.email })

    return NextResponse.json(userData || {})
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const client = await clientPromise;
    const db = client.db('test');  // Explicitly use 'test' database

    await db.collection("userdata").updateOne(
      { email: session.user?.email },
      { 
        $set: { 
          ...data,
          email: session.user?.email,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ message: "Data saved successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save user data" }, { status: 500 })
  }
} 
