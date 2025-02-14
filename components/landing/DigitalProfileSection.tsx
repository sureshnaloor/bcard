"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DigitalProfileSectionProps {
  isComplete: boolean
  userData: {
    name: string
    company: string
    title: string
    address: {
      street: string
      city: string
      country: string
      coordinates: {
        latitude: number
        longitude: number
      }
    }
  }
  setUserData: React.Dispatch<React.SetStateAction<any>>
}

export function DigitalProfileSection({ isComplete, userData, setUserData }: DigitalProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(!isComplete)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  if (isComplete && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Digital Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Company:</strong> {userData.company}
          </p>
          <p>
            <strong>Title:</strong> {userData.title}
          </p>
          <p>
            <strong>Address:</strong> {userData.address.street}, {userData.address.city}, {userData.address.country}
          </p>
          <p>
            <strong>Coordinates:</strong> {userData.address.coordinates.latitude},{" "}
            {userData.address.coordinates.longitude}
          </p>
          <Button onClick={() => setIsEditing(true)} className="mt-4">
            Edit Digital Profile
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isComplete ? "Edit Digital Profile" : "Create Digital Profile"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="profile-company">Company</Label>
            <Input
              id="profile-company"
              value={userData.company}
              onChange={(e) => setUserData({ ...userData, company: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="profile-title">Title</Label>
            <Input
              id="profile-title"
              value={userData.title}
              onChange={(e) => setUserData({ ...userData, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="profile-street">Street</Label>
            <Input
              id="profile-street"
              value={userData.address.street}
              onChange={(e) => setUserData({ ...userData, address: { ...userData.address, street: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="profile-city">City</Label>
            <Input
              id="profile-city"
              value={userData.address.city}
              onChange={(e) => setUserData({ ...userData, address: { ...userData.address, city: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="profile-country">Country</Label>
            <Input
              id="profile-country"
              value={userData.address.country}
              onChange={(e) => setUserData({ ...userData, address: { ...userData.address, country: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="profile-latitude">Latitude</Label>
            <Input
              id="profile-latitude"
              type="number"
              value={userData.address.coordinates.latitude}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  address: {
                    ...userData.address,
                    coordinates: { ...userData.address.coordinates, latitude: Number.parseFloat(e.target.value) },
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="profile-longitude">Longitude</Label>
            <Input
              id="profile-longitude"
              type="number"
              value={userData.address.coordinates.longitude}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  address: {
                    ...userData.address,
                    coordinates: { ...userData.address.coordinates, longitude: Number.parseFloat(e.target.value) },
                  },
                })
              }
            />
          </div>
          <Button type="submit">Save Digital Profile</Button>
        </form>
      </CardContent>
    </Card>
  )
}

