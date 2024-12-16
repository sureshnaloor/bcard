import { findFullId } from '@/utils/idConverter';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import BusinessCard from '@/components/BusinessCard';
import { BusinessCard as BusinessCardType } from '@/types/user';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaExclamationCircle } from 'react-icons/fa';
import AddToHomeButton from '@/components/AddToHomeButton'

// Generate static paths for all cards
export async function generateStaticParams() {
  const client = await clientPromise;
  const db = client.db("businessCards");
  
  const cards = await db.collection("cards")
    .find({}, { projection: { userId: 1 } })
    .toArray();

  return cards.map((card) => ({
    id: card.userId,
  }));
}

// Add revalidation period
export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  manifest: '/api/manifest/[id]', // Dynamic manifest
}

export default async function CardPage({ params }: { params: { id: string } }) {
  const fullId = await findFullId(params.id);
  
  if (!fullId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="flex justify-center mb-8">
            <FaExclamationCircle className="text-6xl text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Business Card Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            The business card you're looking for doesn't exist or might have been removed.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaHome className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
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
      customFields: card.customFields,
      logoColor: card.logoColor,
      bgColor: card.bgColor
    };

    return (
      <>
        <BusinessCard card={businessCard} />
        <AddToHomeButton name={businessCard.name} />
      </>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
} 