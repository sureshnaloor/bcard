"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DigitalCardSectionProps {
  isComplete: boolean
  userData: {
    name: string
    company: string
    title: string
  }
  setUserData: React.Dispatch<React.SetStateAction<any>>
}

export function DigitalCardSection({ isComplete, userData, setUserData }: DigitalCardSectionProps) {
  const [isEditing, setIsEditing] = useState(!isComplete)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
  }

  if (isComplete && !isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Digital Card</CardTitle>
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
          <Button onClick={() => setIsEditing(true)} className="mt-4">
            Edit Digital Card
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isComplete ? "Edit Digital Card" : "Create Digital Card"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={userData.company}
              onChange={(e) => setUserData({ ...userData, company: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={userData.title}
              onChange={(e) => setUserData({ ...userData, title: e.target.value })}
            />
          </div>
          <Button type="submit">Save Digital Card</Button>
        </form>
      </CardContent>
    </Card>
  )
}

