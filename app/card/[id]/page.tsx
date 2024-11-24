import { notFound } from 'next/navigation';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import BusinessCard from '../../../components/BusinessCard';

export default async function CardPage({ params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("businessCards");
    
    const card = await db.collection("cards").findOne({
      _id: new ObjectId(params.id)
    });

    if (!card) {
      notFound();
    }

    // Convert MongoDB document to BusinessCard type
    const businessCard = {
      id: card._id.toString(),
      name: card.name,
      ...card
    };

    return <BusinessCard card={businessCard} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
} 