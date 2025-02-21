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
  workEmail?: string
}

interface UserDataFormProps {
  initialData?: UserData | null
  sessionEmail?: string
}

export function UserDataForm({ initialData, sessionEmail }: UserDataFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Check if initialData exists and has any non-empty values
  const isEditMode = !!initialData && Object.values(initialData).some(value => !!value)

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
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">First Name</label>}
            <Input 
              name="firstName" 
              placeholder={!isEditMode ? "First Name" : ""} 
              defaultValue={initialData?.firstName || ""}
              required 
            />
          </div>
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Middle Name</label>}
            <Input 
              name="middleName" 
              placeholder={!isEditMode ? "Middle Name" : ""} 
              defaultValue={initialData?.middleName || ""}
            />
          </div>
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Last Name</label>}
            <Input 
              name="lastName" 
              placeholder={!isEditMode ? "Last Name" : ""} 
              defaultValue={initialData?.lastName || ""}
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Organization</label>}
            <Input 
              name="organization" 
              placeholder={!isEditMode ? "Organization" : ""} 
              defaultValue={initialData?.organization || ""}
              required 
            />
          </div>
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Title</label>}
            <Input 
              name="title" 
              placeholder={!isEditMode ? "Title" : ""} 
              defaultValue={initialData?.title || ""}
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Session Email (Login Email)</label>
            <Input 
              name="sessionEmail" 
              type="email" 
              value={sessionEmail}
              disabled
              className="bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Work Email</label>}
            <Input 
              name="workEmail" 
              type="email" 
              placeholder={!isEditMode ? "Work Email" : ""} 
              defaultValue={initialData?.workEmail || ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Website</label>}
            <Input 
              name="website" 
              type="url" 
              placeholder={!isEditMode ? "Website" : ""} 
              defaultValue={initialData?.website || ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Mobile Phone</label>}
            <Input 
              name="mobilePhone" 
              placeholder={!isEditMode ? "Mobile Phone" : ""} 
              defaultValue={initialData?.mobilePhone || ""}
            />
          </div>
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Work Phone</label>}
            <Input 
              name="workPhone" 
              placeholder={!isEditMode ? "Work Phone" : ""} 
              defaultValue={initialData?.workPhone || ""}
            />
          </div>
          <div className="space-y-2">
            {isEditMode && <label className="text-sm text-gray-600">Home Phone</label>}
            <Input 
              name="homePhone" 
              placeholder={!isEditMode ? "Home Phone" : ""} 
              defaultValue={initialData?.homePhone || ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          {isEditMode && <label className="text-sm text-gray-600">Fax</label>}
          <Input 
            name="fax" 
            placeholder={!isEditMode ? "Fax" : ""} 
            defaultValue={initialData?.fax || ""}
          />
        </div>
        <div className="space-y-2">
          {isEditMode && <label className="text-sm text-gray-600">Address</label>}
          <Textarea 
            name="address" 
            placeholder={!isEditMode ? "Address" : ""} 
            rows={3} 
            defaultValue={initialData?.address || ""}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {isEditMode && <label className="text-sm text-gray-600">LinkedIn URL</label>}
              <Input 
                name="linkedin" 
                placeholder={!isEditMode ? "LinkedIn URL" : ""} 
                defaultValue={initialData?.linkedin || ""}
              />
            </div>
            <div className="space-y-2">
              {isEditMode && <label className="text-sm text-gray-600">Twitter URL</label>}
              <Input 
                name="twitter" 
                placeholder={!isEditMode ? "Twitter URL" : ""} 
                defaultValue={initialData?.twitter || ""}
              />
            </div>
            <div className="space-y-2">
              {isEditMode && <label className="text-sm text-gray-600">Facebook URL</label>}
              <Input 
                name="facebook" 
                placeholder={!isEditMode ? "Facebook URL" : ""} 
                defaultValue={initialData?.facebook || ""}
              />
            </div>
            <div className="space-y-2">
              {isEditMode && <label className="text-sm text-gray-600">Instagram URL</label>}
              <Input 
                name="instagram" 
                placeholder={!isEditMode ? "Instagram URL" : ""} 
                defaultValue={initialData?.instagram || ""}
              />
            </div>
            <div className="space-y-2">
              {isEditMode && <label className="text-sm text-gray-600">YouTube URL</label>}
              <Input 
                name="youtube" 
                placeholder={!isEditMode ? "YouTube URL" : ""} 
                defaultValue={initialData?.youtube || ""}
              />
            </div>
            <div className="space-y-2">
              {isEditMode && <label className="text-sm text-gray-600">GitHub URL</label>}
              <Input 
                name="github" 
                placeholder={!isEditMode ? "GitHub URL" : ""} 
                defaultValue={initialData?.github || ""}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {isEditMode && <label className="text-sm text-gray-600">Notes</label>}
          <Textarea 
            name="notes" 
            placeholder={!isEditMode ? "Notes" : ""} 
            rows={4} 
            defaultValue={initialData?.notes || ""}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
} 