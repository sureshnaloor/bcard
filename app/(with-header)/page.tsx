"use client"

import Image from 'next/image';
import { useState, useEffect } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Hero Section with Carousel */}
      <div className="relative w-full h-[600px]">
        {/* Carousel Container */}
        <div className="relative w-full h-full overflow-hidden">
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
                style={{ objectFit: 'cover' }}
                className="brightness-75"
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
          &#10094;x§
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
          <a 
            href="/auth/signup" 
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-lg font-semibold"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                "{testimonial.text}"
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;