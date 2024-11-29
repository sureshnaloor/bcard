import { findFullId } from '@/utils/idConverter';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import BusinessCard from '@/components/BusinessCard';
import { BusinessCard as BusinessCardType } from '@/types/user';
import { notFound } from 'next/navigation';

export default async function CardPage({ params }: { params: { id: string } }) {
  const fullId = await findFullId(params.id);
  
  if (!fullId) {
    return <div>Card not found</div>;
  }

  try {
    const client = await clientPromise;
    const db = client.db("businessCards");
    
    const card = await db.collection("cards").findOne({
      _id: new ObjectId(fullId)
    });

    if (!card) {
      notFound();
    }

    // Transform MongoDB document to match BusinessCard type
    const businessCard: BusinessCardType = {
      _id: card._id.toString(),
      userId: card.userId || '',
      name: card.name || '',
      title: card.title || '',
      company: card.company || '',
      description: card.description || '',
      linkedin: card.linkedin,
      linktree: card.linktree,
      website: card.website,
      logoUrl: card.logoUrl,
      bgImageUrl: card.bgImageUrl,
      vCardContent: card.vCardContent,
      vCardFileName: card.vCardFileName,
    };

    return <BusinessCard card={businessCard} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
} 