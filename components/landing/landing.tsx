"use client"

import { useState, useEffect } from "react"
import { QRCodeSection } from "./QRCodeSection"
import { DigitalCardSection } from "./DigitalCardSection"
import { VCardSection } from "./VCardSection"
import { DigitalProfileSection } from "./DigitalProfileSection"
import { Progress } from "@/components/ui/progress"
import { CSSTransition, TransitionGroup } from "react-transition-group"

interface UserData {
  firstName?: string;
  email?: string;
  organization?: string;
  title?: string;
  mobilePhone?: string;
  address?: string;
  website?: string;
  fax?: string;
  notes?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
  // ... add other fields as needed
}

export function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState({
    qrCode: false,
    digitalCard: false,
    vCard: false,
    digitalProfile: false,
  })

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/userdata")
        if (!response.ok) throw new Error("Failed to fetch user data")
        const data = await response.json()
        setUserData(data)
        console.log(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    if (userData) {
      const updatedProgress = {
        qrCode: userData?.firstName && userData?.email && userData?.organization && userData?.title ? true : false,
        digitalCard: userData?.firstName && userData?.organization && userData?.title ? true : false,
        vCard: userData?.firstName && userData?.email && userData?.mobilePhone ? true : false,
        digitalProfile: userData?.firstName && userData?.organization && userData?.title && userData?.address ? true : false,
      }
      setProgress(updatedProgress)
    }
  }, [userData])

  if (loading) return <div>Loading...</div>

  const overallProgress = Object.values(progress).filter(Boolean).length * 25

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Digital Presence Dashboard</h1>

      <Progress value={overallProgress} className="w-full" />

      <TransitionGroup className="space-y-8">
        <CSSTransition key="qr-code" timeout={300} classNames="fade">
          <QRCodeSection 
            isComplete={progress.qrCode} 
            userData={{
              name: `${userData?.firstName || ''}`,
              email: userData?.email || '',
              phone: userData?.mobilePhone || '',
              organization: userData?.organization || '',
              title: userData?.title || '',
              address: userData?.address || '',
              website: userData?.website || '',
              fax: userData?.fax || '',
              notes: userData?.notes || '',
              linkedin: userData?.linkedin || '',
              twitter: userData?.twitter || '',
              facebook: userData?.facebook || '',
              instagram: userData?.instagram || '',
              youtube: userData?.youtube || '',
              github: userData?.github || ''
            }} 
          />
        </CSSTransition>

        <CSSTransition key="digital-card" timeout={300} classNames="fade">
          <DigitalCardSection 
            isComplete={progress.digitalCard} 
            userData={{
              name: userData?.firstName || '',
              company: userData?.organization || '',
              title: userData?.title || '',
              address: {
                street: userData?.address || '',
                city: '',
                country: ''
              },
              email: userData?.email || '',
              website: userData?.website || '',
              phone: userData?.mobilePhone || ''
            }}
            setUserData={setUserData}
          />
        </CSSTransition>

        <CSSTransition key="vcard" timeout={300} classNames="fade">
          <VCardSection 
            isComplete={progress.vCard} 
            userData={{
              name: userData?.firstName || '',
              email: userData?.email || '',
              phone: userData?.mobilePhone || ''
            }}
            setUserData={setUserData}
          />
        </CSSTransition>

        <CSSTransition key="digital-profile" timeout={300} classNames="fade">
          <DigitalProfileSection 
            isComplete={progress.digitalProfile} 
            userData={{
              name: userData?.firstName || '',
              company: userData?.organization || '',
              title: userData?.title || '',
              address: {
                street: userData?.address || '',
                city: '',
                country: '',
                coordinates: {
                  latitude: 0,
                  longitude: 0
                }
              }
            }}
            setUserData={setUserData}
          />
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

