"use client";

import { Dashboard } from "@/components/landing/landing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Correct import path
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin?callbackUrl=/landing');
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return <Dashboard />;
}
