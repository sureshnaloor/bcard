'use client';

import React from "react";
import { FaDownload, FaUserPlus } from "react-icons/fa";

interface DownloadButtonProps {
  vcardUrl: string | undefined;
}

export default function DownloadButton({ vcardUrl }: DownloadButtonProps) {
  return vcardUrl ? (
    <a 
      href={vcardUrl}
      download
      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <FaDownload className="text-xl" />
      <span className="font-semibold">Download Contact Card</span>
    </a>
  ) : (
    <button 
      disabled
      className="flex items-center justify-center gap-2 w-full bg-gray-400 cursor-not-allowed text-white py-3 rounded-xl shadow-lg"
    >
      <FaUserPlus className="text-xl" />
      <span className="font-semibold">Contact Card Not Available</span>
    </button>
  );
} 