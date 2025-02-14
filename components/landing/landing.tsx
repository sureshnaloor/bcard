"use client"

import { useState, useEffect } from "react"
import { QRCodeSection } from "./QRCodeSection"
import { DigitalCardSection } from "./DigitalCardSection"
import { VCardSection } from "./VCardSection"
import { DigitalProfileSection } from "./DigitalProfileSection"
import { Progress } from "@/components/ui/progress"
import { CSSTransition, TransitionGroup } from "react-transition-group"

// This would typically come from your backend
const mockUserData = {
  name: "John Doe",
  company: "Acme Inc",
  title: "Software Engineer",
  email: "john@acme.com",
  phone: "+1234567890",
  website: "www.acme.com",
  address: {
    street: "123 Tech St",
    city: "San Francisco",
    country: "USA",
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
}

export function Dashboard() {
  const [userData, setUserData] = useState(mockUserData)
  const [progress, setProgress] = useState({
    qrCode: false,
    digitalCard: false,
    vCard: false,
    digitalProfile: false,
  })

  useEffect(() => {
    // Check completeness of user data
    const updatedProgress = {
      qrCode: !!userData.name && !!userData.email,
      digitalCard: !!userData.name && !!userData.company && !!userData.title,
      vCard: !!userData.name && !!userData.email && !!userData.phone,
      digitalProfile: !!userData.name && !!userData.company && !!userData.title && !!userData.address,
    }
    setProgress(updatedProgress)
  }, [userData])

  const overallProgress = Object.values(progress).filter(Boolean).length * 25

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Digital Presence Dashboard</h1>

      <Progress value={overallProgress} className="w-full" />

      <TransitionGroup className="space-y-8">
        <CSSTransition key="qr-code" timeout={300} classNames="fade">
          <QRCodeSection isComplete={progress.qrCode} userData={userData} />
        </CSSTransition>

        <CSSTransition key="digital-card" timeout={300} classNames="fade">
          <DigitalCardSection isComplete={progress.digitalCard} userData={userData} setUserData={setUserData} />
        </CSSTransition>

        <CSSTransition key="vcard" timeout={300} classNames="fade">
          <VCardSection isComplete={progress.vCard} userData={userData} setUserData={setUserData} />
        </CSSTransition>

        <CSSTransition key="digital-profile" timeout={300} classNames="fade">
          <DigitalProfileSection isComplete={progress.digitalProfile} userData={userData} setUserData={setUserData} />
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

