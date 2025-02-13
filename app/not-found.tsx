import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/smartwave-logo.svg"
            alt="SmartWave Logo"
            width={180}
            height={60}
            className="dark:invert"
          />
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          404
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center">
          The requested page doesn't exist
        </p>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </main>

      <Footer />
    </div>
  );
} 