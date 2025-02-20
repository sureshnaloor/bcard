"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
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

interface UserDataFormProps {
  initialData?: UserData | null
}

export function UserDataForm({ initialData }: UserDataFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      const response = await fetch("/api/userdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save data")

      toast.success("Profile updated successfully")
      router.refresh()
      router.push("/landing")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            name="firstName" 
            placeholder="First Name" 
            defaultValue={initialData?.firstName || ""}
            required 
          />
          <Input 
            name="middleName" 
            placeholder="Middle Name" 
            defaultValue={initialData?.middleName || ""}
          />
          <Input 
            name="lastName" 
            placeholder="Last Name" 
            defaultValue={initialData?.lastName || ""}
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            name="organization" 
            placeholder="Organization" 
            defaultValue={initialData?.organization || ""}
            required 
          />
          <Input 
            name="title"
            placeholder="Title" 
            defaultValue={initialData?.title || ""}
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            name="email" 
            type="email" 
            placeholder="Email" 
            defaultValue={initialData?.email || ""}
            required 
          />
          <Input 
            name="website" 
            type="url" 
            placeholder="Website" 
            defaultValue={initialData?.website || ""}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            name="mobilePhone" 
            placeholder="Mobile Phone" 
            defaultValue={initialData?.mobilePhone || ""}
          />
          <Input 
            name="workPhone" 
            placeholder="Work Phone" 
            defaultValue={initialData?.workPhone || ""}
          />
          <Input 
            name="homePhone" 
            placeholder="Home Phone" 
            defaultValue={initialData?.homePhone || ""}
          />
        </div>

        <Input 
          name="fax" 
          placeholder="Fax" 
          defaultValue={initialData?.fax || ""}
        />
        <Textarea 
          name="address" 
          placeholder="Address" 
          rows={3} 
          defaultValue={initialData?.address || ""}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              name="linkedin" 
              placeholder="LinkedIn URL" 
              defaultValue={initialData?.linkedin || ""}
            />
            <Input 
              name="twitter" 
              placeholder="Twitter URL" 
              defaultValue={initialData?.twitter || ""}
            />
            <Input 
              name="facebook" 
              placeholder="Facebook URL" 
              defaultValue={initialData?.facebook || ""}
            />
            <Input 
              name="instagram" 
              placeholder="Instagram URL" 
              defaultValue={initialData?.instagram || ""}
            />
            <Input 
              name="youtube" 
              placeholder="YouTube URL" 
              defaultValue={initialData?.youtube || ""}
            />
            <Input 
              name="github" 
              placeholder="GitHub URL" 
              defaultValue={initialData?.github || ""}
            />
          </div>
        </div>

        <Textarea 
          name="notes" 
          placeholder="Notes" 
          rows={4} 
          defaultValue={initialData?.notes || ""}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
} 