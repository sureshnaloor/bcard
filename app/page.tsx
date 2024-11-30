import Image from "next/image";
import Link from "next/link";
import { FaUserPlus, FaLinkedin, FaLink, FaGlobe } from "react-icons/fa";
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function Home() {
  return (
    <main className="relative min-h-screen pb-20">
      {/* Background Image */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      <div className="absolute inset-0 -z-10">
        <Image
          src="/pictures/businesscardbg.jpg"  // Make sure this image is in your public folder
          alt="Background"
          fill
          className="object-cover opacity-40 brightness-80"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
        {/* Card Container */}
        <div className="relative w-full max-w-3xl mt-20 bg-white rounded-xl shadow-2xl p-8">
          {/* Overlapping Logo */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2">
            <div className="relative w-40 h-40 rounded-full border-8 border-white shadow-xl overflow-hidden">
              <Image
                src="/pictures/logo.jpg"
                alt="JAL Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Card Content */}
          <div className="mt-24 text-center">
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                JAL INTERNATIONAL CO LTD
              </span>
            </h1>
            
            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>
            
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                Suresh Naloor
              </span>
            </h2>
            <p className="text-2xl text-gray-600 mt-2 italic font-semibold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                Head, Materials Management
              </span>
            </p>
            
            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>
            
            {/* Job Description */}
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            JAL International Co Ltd specializes in executing EPC projects in Power, Industrial, Oil & Gas verticals.We are specialized in building strategic partnerships and driving business growth across global markets. 
            </p>
          </div>
        </div>
      </div>

      {/* Contact Actions Section */}
      <div className="container mx-auto px-4 max-w-3xl space-y-6 mt-8">
        {/* Add to Contact Button */}
        <Link 
          href="/vcards/sureshnaloor.vcf" 
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <FaUserPlus className="text-xl" />
          <span className="font-semibold">Add to Contacts</span>
        </Link>

        {/* Social Links Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Link 
            href="https://linkedin.com/in/engineeringlead" 
            target="_blank"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaLinkedin className="text-2xl text-[#0077b5]" />
            <span className="text-sm font-medium text-gray-600">LinkedIn</span>
          </Link>

          <Link 
            href="https://linktr.ee/sureshnaloor" 
            target="_blank"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaLink className="text-2xl text-green-600" />
            <span className="text-sm font-medium text-gray-600">LinkTree</span>
          </Link>

          <Link 
            href="https://jalint.com.sa" 
            target="_blank"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaGlobe className="text-2xl text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Website</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
