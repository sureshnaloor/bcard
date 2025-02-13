import Image from "next/image";
import Link from "next/link";
import { FaUserPlus, FaLinkedin, FaYoutube, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export interface ProfileCardProps {
  profile: {
    name: string;
    position: string;
    companyName: string;
    email: string;
    description: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
    location?: {
      address: string;
      lat: number;
      lng: number;
    };
    logo?: string | null;
    backgroundColor?: string;
  };
  cardId?: string; // For vCard download
}

export default function ProfileCard({ profile, cardId }: ProfileCardProps) {
  return (
    <main 
      className="relative min-h-screen pb-10"
      style={{
        backgroundColor: profile.backgroundColor || '#EBE9E1',
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        {/* Add to Contacts Button */}
        {cardId && (
          <div className="mb-6">
            <Link
              href={`/api/profile/${cardId}/vcard`}
              className="flex items-center justify-center gap-2 bg-blue-600/60 backdrop-blur-md hover:bg-blue-700/90 text-white py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              <FaUserPlus className="text-xl" />
              <span className="font-semibold">Add to Contacts</span>
            </Link>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
          {/* Logo */}
          {profile.logo && (
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full shadow-xl overflow-hidden">
                <Image
                  src={profile.logo}
                  alt="Profile Logo"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Name and Details */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.name}
            </h1>
            
            {profile.position && (
              <p className="text-xl text-gray-700 font-medium">
                {profile.position}
              </p>
            )}
            
            {profile.companyName && (
              <p className="text-lg text-blue-600 font-semibold">
                {profile.companyName}
              </p>
            )}
            
            {profile.description && (
              <p className="text-gray-600 leading-relaxed mt-4">
                {profile.description}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {profile.email && (
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <MdEmail className="text-2xl text-blue-600" />
                <span className="text-gray-700">{profile.email}</span>
              </div>
            </div>
          )}

          {profile.location && (
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-2xl text-red-500" />
                <span className="text-gray-700">{profile.location.address}</span>
              </div>
            </div>
          )}
        </div>

        {/* Social Links */}
        {(profile.linkedinUrl || profile.youtubeUrl) && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            {profile.linkedinUrl && (
              <Link 
                href={profile.linkedinUrl}
                target="_blank"
                className="flex flex-col items-center gap-2 p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaLinkedin className="text-3xl text-[#0077b5]" />
                <span className="text-sm font-medium text-gray-700">LinkedIn</span>
              </Link>
            )}

            {profile.youtubeUrl && (
              <Link 
                href={profile.youtubeUrl}
                target="_blank"
                className="flex flex-col items-center gap-2 p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaYoutube className="text-3xl text-red-600" />
                <span className="text-sm font-medium text-gray-700">YouTube</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 