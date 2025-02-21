"use client"

import { UserDataForm } from "@/components/forms/UserDataForm"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface UserData {
  firstName?: string
  middleName?: string
  lastName?: string
  organization?: string
  title?: string
  email?: string
  mobilePhone?: string
  workPhone?: string
  homePhone?: string
  fax?: string
  website?: string
  address?: string
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
  github?: string
  notes?: string
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/profile")
      return
    }

    async function fetchUserData() {
      try {
        const response = await fetch("/api/userdata")
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchUserData()
    }
  }, [status, router])

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Update Your Profile</h1>
      <UserDataForm 
        initialData={userData} 
        sessionEmail={session?.user?.email || ''}
      />
    </div>
  )
} 