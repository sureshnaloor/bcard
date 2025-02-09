import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { parseShortId } from '@/utils/profileidgenerator';
import ProfileCard, { ProfileCardProps } from '@/app/components/ProfileCard';

interface ProfilePageProps {
  params: {
    user: string;
  };
}

async function getProfileAndCard(shortId: string) {
  try {
    const client = await clientPromise;
    const db = client.db('test');

    console.log('Looking for profile with shortId:', shortId);

    // Find the profile document using shortId field instead of _id
    const profile = await db.collection('profiles').findOne({
      shortId: shortId  // Assuming we store shortId in the document
    });

    console.log('Found profile:', profile);

    if (!profile) {
      console.log('No profile found');
      return null;
    }

    // Get the matching digivcard
    const card = await db.collection('digivcard').findOne({
      userId: profile.userId
    });

    console.log('Found card:', card);
    return { profile, card };
  } catch (error) {
    console.error('Error in getProfileAndCard:', error);
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const data = await getProfileAndCard(params.user);

  if (!data) {
    notFound();
  }

  const { profile, card } = data;

  return <ProfileCard 
    profile={profile as unknown as ProfileCardProps['profile']} 
    cardId={params.user} 
  />;
} 