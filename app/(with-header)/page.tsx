"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const testimonials = [
  {
    name: 'John Doe',
    text: 'SmartWave has transformed the way I do business. Highly recommend!',
  },
  {
    name: 'Jane Smith',
    text: 'The best service I have ever used. Exceptional quality and support!',
  },
  {
    name: 'Alice Johnson',
    text: 'SmartWave is a game changer! I love the features and ease of use.',
  },
];

const carouselImages = [
  {
    src: "/images/carousel1.jpg",
    alt: "Business Meeting"
  },
  {
    src: "/images/carousel2.jpg",
    alt: "Technology Innovation"
  },
  {
    src: "/images/carousel3.jpg",
    alt: "Digital Solutions"
  }
];

const HomePage = () => {
  const { data: session, status } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % carouselImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((current) => (current + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((current) => 
      current === 0 ? carouselImages.length - 1 : current - 1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-24 p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back, {session.user?.name || session.user?.email}!
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-blue-800 text-center text-lg">
              🚧 Under Construction 🚧
            </p>
            <p className="text-blue-600 text-center mt-2">
              We're building your personalized dashboard where you'll be able to manage your vCard, 
              digital card, and SmartWave profile.
            </p>
          </div>
          <div className="grid gap-4 text-center">
            <Button 
              variant="outline" 
              className="w-full"
              disabled
            >
              Create vCard (Coming Soon)
            </Button>
          
            <Button 
              variant="outline"
              className="w-full"
              disabled
            >
              Generate Digital Card (Coming Soon)
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              disabled
            >
              Setup SmartWave Profile (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section with Carousel */}
      <div className="relative w-full h-[600px]">
        {/* Carousel Container */}
        <div className="relative w-full h-[90%] overflow-hidden">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                className="object-cover brightness-75"
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
          aria-label="Previous slide"
        >
          &#10094;
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
          aria-label="Next slide"
        >
          &#10095;
        </button>

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl font-bold mb-4 px-4">
            Welcome to SmartWave
          </h1>
          <p className="text-xl mb-8 px-4">
            Innovating your business solutions
          </p>
          <Button 
            variant="default"
            size="lg"
            className="
              bg-gradient-to-r from-cyan-500 to-cyan-600 
              hover:from-cyan-600 hover:to-cyan-700
              shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]
              hover:shadow-[0_10px_20px_-8px_rgba(0,0,0,0.6)]
              active:translate-y-[2px]
              border-b-[4px] border-cyan-700
              hover:border-b-[2px] hover:mt-[2px]
              transition-all duration-150
              backdrop-blur-sm bg-opacity-90
              text-white font-bold
              px-8 py-3
              rounded-lg
            "
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SmartWave</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Keep your existing 6 cards but wrap each with these new styles */}
            {/* First card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:rotate-1
              hover:bg-gradient-to-br hover:from-blue-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">AI-Age Proof</h3>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">Seamlessly integrate with AI technologies for enhanced functionality</p>
            </div>

            {/* Second card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:-rotate-1
              hover:bg-gradient-to-br hover:from-purple-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Customizable Privacy</h3>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">Control what information you share, from contact details to your calendar</p>
            </div>

            {/* Third card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:rotate-1
              hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Eco-Friendly</h3>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">No plastic, no waste - just pure digital efficiency</p>
            </div>

            {/* Fourth card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:-rotate-1
              hover:bg-gradient-to-br hover:from-amber-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Always Up-to-Date</h3>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">Never worry about outdated information on your cards again</p>
            </div>

            {/* Fifth card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:rotate-1
              hover:bg-gradient-to-br hover:from-rose-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Universal Compatibility</h3>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">Works with all smartphones and can be saved directly to contacts</p>
            </div>

            {/* Sixth card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:-rotate-1
              hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Rich Digital Profile</h3>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">Showcase your complete professional identity beyond basic contact info</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Integration Showcase */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-600">AI-Powered Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-red-500">Smart Scheduling</h3>
              <p className="mb-4 text-gray-700">
                Let AI manage your calendar and find the perfect meeting times for you and your contacts.
              </p>
              <Image
                src="/images/aischeduling.svg?height=200&width=400"
                alt="AI Scheduling Demo"
                width={400}
                height={200}
                className="rounded-lg"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-red-500">Intelligent Networking</h3>
              <p className="mb-4 text-gray-700">
                Our AI suggests valuable connections based on your profile and industry trends.
              </p>
              <Image
                src="/images/ainetworking.svg?height=200&width=400"
                alt="AI Networking Demo"
                width={400}
                height={200}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Sustainability Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Eco-friendly Card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:rotate-1
              hover:bg-gradient-to-br hover:from-green-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <Image
                src="/images/landing/card2.png"
                alt="Eco-friendly"
                width={100}
                height={100}
                className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-300"
              />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Eco-friendly Materials</h3>
              <p className="text-gray-600 relative z-10">Made from recycled materials, reducing environmental impact.</p>
            </div>

            {/* Digital Card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:-rotate-1
              hover:bg-gradient-to-br hover:from-blue-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <Image
                src="/images/landing/card3.png"
                alt="Digital"
                width={100}
                height={100}
                className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-300"
              />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Digital First</h3>
              <p className="text-gray-600 relative z-10">Reduces paper waste through digital interactions.</p>
            </div>

            {/* Renewable Card */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:rotate-1
              hover:bg-gradient-to-br hover:from-yellow-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <Image
                src="/images/landing/card1.png"
                alt="Renewable"
                width={100}
                height={100}
                className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-300"
              />
              <h3 className="text-xl font-semibold mb-2 relative z-10">Renewable Technology</h3>
              <p className="text-gray-600 relative z-10">Powered by sustainable energy sources.</p>
            </div>
          </div>
        </div>
      </section>    

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-r from-blue-600 to-red-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Join the Future of Networking?</h2>
          <p className="text-xl mb-8">
            Get your SmartWave digital card today and experience the power of AI-enhanced connections.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Now
          </Button>
        </div>
      </section>    

      {/* Testimonials Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:rotate-1
              hover:bg-gradient-to-br hover:from-purple-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="flex items-center mb-4">
                <Image
                  src="/images/landing/techlady.png"
                  alt="Client 1"
                  width={100}
                  height={100}
                  className="rounded-full transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="ml-4 relative z-10">
                  <h3 className="font-semibold">Aizel Johnson</h3>
                  <p className="text-gray-600">CEO, TechStart</p>
                </div>
              </div>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">
                "SmartWave has revolutionized how we network. The AI features are truly game-changing!"
              </p>
              <div className="mt-4 text-yellow-400 relative z-10 transform group-hover:scale-105 transition-transform">
                ★★★★★
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:-rotate-1
              hover:bg-gradient-to-br hover:from-blue-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="flex items-center mb-4">
                <Image
                  src="/images/landing/techindian.png"
                  alt="Client 2"
                  width={100}
                  height={100}
                  className="rounded-full transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="ml-4 relative z-10">
                  <h3 className="font-semibold">Haresh Aiyengar</h3>
                  <p className="text-gray-600">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">
                "The digital business cards have made our networking efforts much more sustainable."
              </p>
              <div className="mt-4 text-yellow-400 relative z-10 transform group-hover:scale-105 transition-transform">
                ★★★★★
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group relative bg-white p-6 rounded-xl shadow-lg 
              hover:scale-105 hover:shadow-xl
              transform transition-all duration-300 ease-out
              hover:rotate-1
              hover:bg-gradient-to-br hover:from-teal-50 hover:to-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="flex items-center mb-4">
                <Image
                  src="/images/landing/techsaudi.png"
                  alt="Client 3"
                  width={100}
                  height={100}
                  className="rounded-full transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="ml-4 relative z-10">
                  <h3 className="font-semibold">Ahmed Al Aiman</h3>
                  <p className="text-gray-600">Sales Manager</p>
                </div>
              </div>
              <p className="text-gray-600 relative z-10 group-hover:text-gray-700">
                "The analytics features help us track our networking ROI effectively."
              </p>
              <div className="mt-4 text-yellow-400 relative z-10 transform group-hover:scale-105 transition-transform">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;