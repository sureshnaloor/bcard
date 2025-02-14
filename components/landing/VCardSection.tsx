"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import FileSaver from "file-saver"

interface VCardSectionProps {
  isComplete: boolean
  userData: {
    name: string
    email: string
    phone: string
  }
  setUserData: React.Dispatch<React.SetStateAction<any>>
}

export function VCardSection({ isComplete, userData, setUserData }: VCardSectionProps) {
  const [isEditing, setIsEditing] = useState(!isComplete)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${userData.name}
EMAIL:${userData.email}
TEL:${userData.phone}
END:VCARD`
    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" })
    FileSaver.saveAs(blob, "contact.vcf")
  }

  if (isComplete && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>vCard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phone}
          </p>
          <div className="space-x-4 mt-4">
            <Button onClick={downloadVCard}>Download vCard</Button>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit vCard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isComplete ? "Edit vCard" : "Create vCard"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vcard-name">Name</Label>
            <Input
              id="vcard-name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="vcard-email">Email</Label>
            <Input
              id="vcard-email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="vcard-phone">Phone</Label>
            <Input
              id="vcard-phone"
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            />
          </div>
          <Button type="submit">Save vCard</Button>
        </form>
      </CardContent>
    </Card>
  )
}

