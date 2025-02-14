'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { useState, Suspense, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Create a separate component for the sign-in form
function SignInForm() {
  const searchParams = useSearchParams() ?? null;
  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const error = searchParams?.get('error');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setShowError(false);
      
      const result = await signIn('google', { 
        callbackUrl,
        redirect: true,
      });

      // We'll only reach this code if there's an actual error
      // Normal OAuth redirects won't trigger this
      if (result?.error) {
        setErrorMessage('Failed to sign in with Google. Please try again.');
        console.error('Sign in error:', result.error);
      }
      
    } catch (error) {
      console.error('Sign in error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only show error messages that are actual errors
  useEffect(() => {
    let errorTimer: NodeJS.Timeout;
    
    if (error || (errorMessage && !isLoading)) {
      errorTimer = setTimeout(() => {
        setShowError(true);
      }, 1000);
    } else {
      setShowError(false);
    }

    return () => {
      if (errorTimer) {
        clearTimeout(errorTimer);
      }
    };
  }, [error, errorMessage, isLoading]);

  // Error message mapping
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'OAuthCallback':
        return 'Error connecting to Google. Please try again.';
      case 'AccessDenied':
        return 'Access denied. Please try again.';
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      default:
        return 'An error occurred during sign in.';
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#5f9dc6] to-[#091218]">
        <div className="w-full max-w-4xl h-[75%] p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col justify-center">
          {showError && (
            <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
              {error ? getErrorMessage(error) : errorMessage}
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
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-gray-700 rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <FcGoogle className="w-6 h-6" />
                  <span>Continue with Google</span>
                </>
              )}
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
                <p className="mt-3 pt-3">
                  We do not use any of your data for any purpose.
                  You will never get any spam emails from any of our services. This is a secure authentication powered by Google.
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