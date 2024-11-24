import Image from "next/image";
import Link from "next/link";
import { FaUserPlus, FaLinkedin, FaLink, FaGlobe } from "react-icons/fa";
import { BusinessCard as BusinessCardType } from "../types/user";
import React from "react";

interface Props {
  card: BusinessCardType;
}

export default function BusinessCard({ card }: Props) {
  return (
    <main className="relative min-h-screen pb-20">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={card.bgImageUrl || "/businesscardbg.jpg"}
          alt="Background"
          fill
          className="object-cover opacity-20 brightness-75 grayscale"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
        {/* Card Container */}
        <div className="relative w-full max-w-3xl mt-16 bg-white rounded-xl shadow-2xl p-6">
          {/* Overlapping Logo */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="relative w-32 h-32 rounded-full border-8 border-white shadow-xl overflow-hidden">
              <Image
                src={card.logoUrl || "/pictures/logo.jpg"}
                alt={`${card.company} Logo`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Card Content */}
          <div className="mt-20 text-center">
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                {card.company}
              </span>
            </h1>
            
            <div className="my-4 border-t border-gray-200"></div>
            
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                {card.name}
              </span>
            </h2>
            <p className="text-2xl text-gray-600 mt-2 italic font-semibold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                {card.title}
              </span>
            </p>
            
            <div className="my-4 border-t border-gray-200"></div>
            
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {card.description}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Actions Section */}
      <div className="container mx-auto px-4 max-w-3xl space-y-4 mt-6">
        {/* Add to Contact Button */}
        <Link 
          href="/contact.vcf" 
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <FaUserPlus className="text-xl" />
          <span className="font-semibold">Add to Contacts</span>
        </Link>

        {/* Social Links Grid */}
        <div className="grid grid-cols-3 gap-3">
          {card.linkedin && (
            <Link 
              href={card.linkedin}
              target="_blank"
              className="flex flex-col items-center gap-1 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaLinkedin className="text-2xl text-[#0077b5]" />
              <span className="text-sm font-medium text-gray-600">LinkedIn</span>
            </Link>
          )}

          {card.linktree && (
            <Link 
              href={card.linktree}
              target="_blank"
              className="flex flex-col items-center gap-1 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaLink className="text-2xl text-green-600" />
              <span className="text-sm font-medium text-gray-600">LinkTree</span>
            </Link>
          )}

          {card.website && (
            <Link 
              href={card.website}
              target="_blank"
              className="flex flex-col items-center gap-1 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaGlobe className="text-2xl text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Website</span>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
} 