import Link from "next/link";
import { FaArrowRight, FaRegQuestionCircle, FaTachometerAlt, FaIdCard } from "react-icons/fa";
import ThemeSwitcher from '@/components/ThemeSwitcher';
import AuthButtons from '@/components/AuthButtons';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Nav */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              <span className="text-red-500">Digi</span><span className="text-cyan-500">Busi</span><span className="text-zinc-800 dark:text-white font-semibold"> CardMaker</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              <FaTachometerAlt className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              href="/about" 
              className="font-medium tracking-wide text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all duration-200 ease-in-out relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-200 ease-in-out"></span>
            </Link>
            <Link 
              href="/pricing" 
              className="font-medium tracking-wide text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all duration-200 ease-in-out relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-200 ease-in-out"></span>
            </Link>
            <Link 
              href="/contact" 
              className="font-medium tracking-wide text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all duration-200 ease-in-out relative group"
            >
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-200 ease-in-out"></span>
            </Link>
            <AuthButtons />
            <ThemeSwitcher />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Create Your Digital Business Card
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Generate professional vCards in seconds. Share your contact information seamlessly.
              </p>
              <Link
                href="/admin/vcard-generator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Now
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 via-blue-50/50 to-white dark:bg-none dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-12">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Easy to Use",
                  description: "Simple form-based interface to create vCards quickly"
                },
                {
                  title: "Professional Format",
                  description: "Generate standard VCF files compatible with all devices"
                },
                {
                  title: "Custom Fields",
                  description: "Add additional information with custom fields support"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="p-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "What is a vCard?",
                  a: "A vCard is a digital business card that can be shared electronically and imported into contact management systems."
                },
                {
                  q: "How do I use the generated vCard?",
                  a: "Simply download the .vcf file and share it via email or messaging. Recipients can click to add it to their contacts."
                },
                {
                  q: "Can I include my photo?",
                  a: "Yes, you can upload a profile photo and company logo to be included in your vCard."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <FaRegQuestionCircle className="text-blue-600 text-xl flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {faq.q}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} <span className="text-red-500">Digi</span><span className="text-cyan-500">Busi</span> CardMaker. Crafted by <span className="italic text-cyan-500">ExBeyond Inc</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
