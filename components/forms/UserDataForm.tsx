"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import type { VCardData } from "@/types/vcard"
import { Separator } from "@/components/ui/separator"
interface UserDataFormProps {
  initialData?: VCardData | null
  sessionEmail?: string
}

export function UserDataForm({ initialData, sessionEmail }: UserDataFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl mx-auto p-6">
      {/* Name Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Name</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Input
            name="namePrefix"
            placeholder="Prefix"
            defaultValue={initialData?.namePrefix}
            className="md:col-span-1"
          />
          <Input
            name="firstName"
            placeholder="First Name"
            defaultValue={initialData?.firstName}
            required
            className="md:col-span-2"
          />
          <Input
            name="middleName"
            placeholder="Middle Name"
            defaultValue={initialData?.middleName}
            className="md:col-span-1"
          />
          <Input
            name="lastName"
            placeholder="Last Name"
            defaultValue={initialData?.lastName}
            required
            className="md:col-span-2"
          />
        </div>
      </div>

      <Separator />

      {/* Organization Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Organization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="organization"
            placeholder="Organization"
            defaultValue={initialData?.organization}
          />
          <Input
            name="title"
            placeholder="Title"
            defaultValue={initialData?.title}
          />
          <Input
            name="role"
            placeholder="Role"
            defaultValue={initialData?.role}
          />
        </div>
      </div>

      <Separator />

      {/* Contact Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="workEmail"
            type="email"
            placeholder="Work Email"
            defaultValue={initialData?.workEmail}
          />
          <Input
            name="personalEmail"
            type="email"
            placeholder="Personal Email"
            defaultValue={initialData?.personalEmail}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="mobilePhone"
            placeholder="Mobile Phone"
            defaultValue={initialData?.mobilePhone}
          />
          <Input
            name="workPhone"
            placeholder="Work Phone"
            defaultValue={initialData?.workPhone}
          />
          <Input
            name="homePhone"
            placeholder="Home Phone"
            defaultValue={initialData?.homePhone}
          />
          <Input
            name="fax"
            placeholder="Fax"
            defaultValue={initialData?.fax}
          />
        </div>
      </div>

      <Separator />

      {/* Work Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Work Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="workStreet"
            placeholder="Street"
            defaultValue={initialData?.workStreet}
            className="md:col-span-2"
          />
          <Input
            name="workCity"
            placeholder="City"
            defaultValue={initialData?.workCity}
          />
          <Input
            name="workState"
            placeholder="State"
            defaultValue={initialData?.workState}
          />
          <Input
            name="workPostalCode"
            placeholder="Postal Code"
            defaultValue={initialData?.workPostalCode}
          />
          <Input
            name="workCountry"
            placeholder="Country"
            defaultValue={initialData?.workCountry}
          />
        </div>
      </div>

      <Separator />

      {/* Online Presence Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Online Presence</h3>
        <Input
          name="website"
          type="url"
          placeholder="Website"
          defaultValue={initialData?.website}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="linkedin"
            placeholder="LinkedIn URL"
            defaultValue={initialData?.linkedin}
          />
          <Input
            name="twitter"
            placeholder="Twitter URL"
            defaultValue={initialData?.twitter}
          />
          <Input
            name="facebook"
            placeholder="Facebook URL"
            defaultValue={initialData?.facebook}
          />
          <Input
            name="instagram"
            placeholder="Instagram URL"
            defaultValue={initialData?.instagram}
          />
          <Input
            name="youtube"
            placeholder="YouTube URL"
            defaultValue={initialData?.youtube}
          />
          <Input
            name="github"
            placeholder="GitHub URL"
            defaultValue={initialData?.github}
          />
        </div>
      </div>

      <Separator />

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>
        <Input
          name="birthday"
          type="date"
          placeholder="Birthday"
          defaultValue={initialData?.birthday}
        />
        <Textarea
          name="notes"
          placeholder="Notes"
          rows={4}
          defaultValue={initialData?.notes}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
} 