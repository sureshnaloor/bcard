"use client"

import { useState, useEffect } from "react"
import { QRCodeSection } from "./QRCodeSection"
import { DigitalCardSection } from "./DigitalCardSection"
import { VCardSection } from "./VCardSection"
// import { DigitalProfileSection } from "./DigitalProfileSection"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle, UserCircle, ChevronRight } from "lucide-react"
import type { VCardData } from "@/types/vcard"
import Link from "next/link"

const isEmptyUserData = (userData: VCardData | null): boolean => {
  if (!userData) return true
  return !Object.values(userData).some(value => value && value.toString().trim() !== '')
}

export function Dashboard() {
  const [userData, setUserData] = useState<VCardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/userdata")
        if (!response.ok) throw new Error("Failed to fetch user data")
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const isEmpty = isEmptyUserData(userData)

  if (loading) return (
    <div className="container mx-auto py-8 flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  )

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Digital Presence Dashboard</h1>

      {isEmpty ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your profile information is empty. Please visit the{' '}
            <a href="/profile" className="font-medium underline hover:text-primary">
              Profile page
            </a>{' '}
            to add your details and generate your digital business cards and QR code.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-700">
            <UserCircle className="h-5 w-5" />
            <span>Want to update your profile information?</span>
          </div>
          <Link
            href="/profile"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1 transition-colors"
          >
            <span>Edit Profile</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <TransitionGroup className="space-y-8">
        <CSSTransition key="qr-code" timeout={300} classNames="fade">
          <QRCodeSection userData={userData} />
        </CSSTransition>

        <CSSTransition key="digital-card" timeout={300} classNames="fade">
          <DigitalCardSection userData={userData} />
        </CSSTransition>

        <CSSTransition key="vcard" timeout={300} classNames="fade">
          <VCardSection userData={userData} />
        </CSSTransition>

        {/* <CSSTransition key="digital-profile" timeout={300} classNames="fade">
          <DigitalProfileSection userData={userData} setUserData={setUserData} />
        </CSSTransition> */}
      </TransitionGroup>
    </div>
  )
}

