import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { findFullId } from '@/utils/idConverter'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fullId = await findFullId(params.id)
    if (!fullId) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const client = await clientPromise
    const db = client.db("businessCards")
    const card = await db.collection("cards").findOne({
      _id: new ObjectId(fullId)
    })

    if (!card) {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Create a dynamic manifest for this specific card
    const manifest = {
      name: `${card.name}'s Business Card`,
      short_name: card.name,
      description: `Digital Business Card for ${card.name}`,
      start_url: `/card/${params.id}`,
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#0284c7",
      icons: [
        {
          src: card.logoUrl || "/default-avatar.png", // Use card's logo or default
          sizes: "192x192",
          type: "image/png"
        }
      ]
    }

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
      },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 