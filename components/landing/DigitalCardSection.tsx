"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DigitalCard } from "./DigitalCard"

interface DigitalCardSectionProps {
  isComplete: boolean
  userData: {
    name: string
    company: string
    title: string
    address: {
      street: string
      city: string
      country: string
    };
    email: string
    website: string
    phone: string
  };
  setUserData: React.Dispatch<React.SetStateAction<any>>
}

export function DigitalCardSection({ isComplete, userData, setUserData }: DigitalCardSectionProps) {
  const [isEditing, setIsEditing] = useState(!isComplete)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  if (isComplete && !isEditing) {
    const { name, company, title, address, email, website, phone } = userData;
    const digitalCardProps = {
      name,
      company,
      title,
      address: {
        ...address,
        coordinates: { latitude: 0, longitude: 0 } // Default coordinates, replace with actual values if available
      },
      email,
      website,
      phone
    };

    return (
      <div>
        <DigitalCard {...digitalCardProps} />
        <Button onClick={() => setIsEditing(true)} className="mt-4">
          Edit Digital Card
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields for editing the digital card */}
      <Button type="submit">Save Digital Card</Button>
    </form>
  );
}

