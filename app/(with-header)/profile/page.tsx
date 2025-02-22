"use client"

import { UserDataForm } from "@/components/forms/UserDataForm"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

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

interface ErrorStateProps {
  onRetry: () => void
}

const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Alert className="bg-red-50 border-red-200">
        <AlertTitle className="text-red-800 text-lg font-semibold">
          Unable to load your profile
        </AlertTitle>
        <AlertDescription className="text-red-600 mt-2">
          <p className="mb-4">
            We're having trouble connecting to our servers. This is usually temporary and can be fixed by refreshing the page.
          </p>
          <Button 
            onClick={onRetry}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const { data: session, status } = useSession()
  const router = useRouter()

  async function fetchUserData() {
    try {
      setLoading(true)
      setError(false)
      const response = await fetch("/api/userdata", {
        signal: AbortSignal.timeout(5000)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/profile")
      return
    }

   

    if (status === "authenticated") {
      fetchUserData()
    }
  }, [status, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }
  if (error) {
    return (
      <ErrorState onRetry={fetchUserData} />
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-xl font-bold text-center mb-8">Update Your Profile</h1>
      <UserDataForm 
        initialData={userData} 
        sessionEmail={session?.user?.email || ''}
      />
    </div>
  )
} 