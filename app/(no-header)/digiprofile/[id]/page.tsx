import clientPromise from '@/lib/mongodb';
import DigitalProfileCard from '@/components/DigitalProfileCard';
import { VCardData } from '@/types/vcard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaExclamationCircle } from 'react-icons/fa';
import AddToHomeButton from '@/components/AddToHomeButton';

// Add revalidation period
export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  manifest: '/api/manifest/[id]',
}

export default async function DigiProfilePage({ params }: { params: { id: string } }) {
  // Validate shortId format (10 digit alphanumeric)
  if (!params.id.match(/^[a-zA-Z0-9]{10}$/)) {
    return renderNotFound();
  }

  try {
    const client = await clientPromise;
    const db = client.db("test");
    
    // Find user data by shortId
    const profile = await db.collection("userdata").findOne({
      shortId: params.id
    });

    if (!profile) {
      return renderNotFound();
    }

    // Transform MongoDB document to match VCardData type
    const profileData: VCardData = {
      _id: profile._id.toString(),
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      title: profile.title || '',
      organization: profile.organization || '',
      workEmail: profile.workEmail,
      workPhone: profile.workPhone,
      mobilePhone: profile.mobilePhone,
      homePhone: profile.homePhone,
      fax: profile.fax,
      workStreet: profile.workStreet,
      workCity: profile.workCity,
      workState: profile.workState,
      workPostalCode: profile.workPostalCode,
      workCountry: profile.workCountry,
      homeStreet: profile.homeStreet,
      homeCity: profile.homeCity,
      homeState: profile.homeState,
      homePostalCode: profile.homePostalCode,
      homeCountry: profile.homeCountry,
      website: profile.website,
      linkedin: profile.linkedin,
      twitter: profile.twitter,
      facebook: profile.facebook,
      instagram: profile.instagram,
      youtube: profile.youtube,
      github: profile.github,
      photo: profile.photo,
      logo: profile.logo,
      birthday: profile.birthday,
      notes: profile.notes
    };

    return (
      <>
        <DigitalProfileCard profile={profileData} />
        <AddToHomeButton name={`${profileData.firstName} ${profileData.lastName}`} />
      </>
    );
  } catch (error) {
    console.error(error);
    return renderNotFound();
  }
}

function renderNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <div className="flex justify-center mb-8">
          <FaExclamationCircle className="text-6xl text-red-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Digital Profile Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The digital profile you're looking for doesn't exist or might have been removed.
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