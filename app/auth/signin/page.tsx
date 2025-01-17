'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { useState, Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';

// Create a separate component for the sign-in form
function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { 
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#5f9dc6] to-[#091218]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg">
        {error && (
          <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
            {error === 'OAuthCallback' ? 
              'Error connecting to Google. Please try again.' : 
              'An error occurred during sign in.'}
          </div>
        )}
        
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-red-500">smart</span>
            <span className="text-cyan-500">wave</span>
            <span className="text-zinc-800 dark:text-white"> CardMaker</span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to manage your digital business cards
          </p>
          <h3 className="text-teal-500 dark:text-white text-sm mt-2 italic font-light">
            (Currently we support only google sign-in)
          </h3>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <FcGoogle className="w-6 h-6" />
            <span>Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                Secure authentication powered by Google
              </span>
            </div>
            <div className="text-center italic text-xs text-teal-600 dark:text-teal-400 mt-4">
              <p className=" mt-3 pt-3">
                We do not use any of your data for any purpose.
              
               You will never get any spam emails from any of our services. this is a secure authentication powered by Google.
                We do not share any of your data.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          By signing in, you agree to our{' '}
          <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

// Main component with Suspense wrapper
export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
} 