"use client"

import { useState, useEffect } from "react"
import { QRCodeSection } from "./QRCodeSection"
import { DigitalCardSection } from "./DigitalCardSection"
import { VCardSection } from "./VCardSection"
// import { DigitalProfileSection } from "./DigitalProfileSection"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import type { VCardData } from "@/types/vcard"

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

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Digital Presence Dashboard</h1>

      <TransitionGroup className="space-y-8">
        <CSSTransition key="qr-code" timeout={300} classNames="fade">
          <QRCodeSection userData={userData} />
        </CSSTransition>

        <CSSTransition key="digital-card" timeout={300} classNames="fade">
          <DigitalCardSection userData={userData} setUserData={setUserData} />
        </CSSTransition>

        <CSSTransition key="vcard" timeout={300} classNames="fade">
          <VCardSection userData={userData} setUserData={setUserData} />
        </CSSTransition>

        {/* <CSSTransition key="digital-profile" timeout={300} classNames="fade">
          <DigitalProfileSection userData={userData} setUserData={setUserData} />
        </CSSTransition> */}
      </TransitionGroup>
    </div>
  )
}

