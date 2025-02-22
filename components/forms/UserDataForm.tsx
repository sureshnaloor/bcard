"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"
import type { VCardData } from "@/types/vcard"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"

interface UserDataFormProps {
  initialData?: VCardData | null
  sessionEmail?: string
}

export function UserDataForm({ initialData, sessionEmail }: UserDataFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [photo, setPhoto] = useState<string>(initialData?.photo || '')
  const [logo, setLogo] = useState<string>(initialData?.logo || '')

  // const isEditMode = !!initialData && Object.values(initialData).some(value => !!value)

  // Add this function to handle file conversion to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Modify the onSubmit function
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    // Add the base64 images to the data object
    const finalData = {
      ...data,
      photo,
      logo,
    }

    try {
      const response = await fetch("/api/userdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
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

  // Add this function to handle file changes
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${type === 'photo' ? 'Photo' : 'Logo'} must be less than 5MB`);
        return;
      }
      try {
        const base64 = await convertToBase64(file);
        if (type === 'photo') {
          setPhoto(base64);
        } else {
          setLogo(base64);
        }
        toast.success(`${type === 'photo' ? 'Photo' : 'Logo'} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${type === 'photo' ? 'photo' : 'logo'}`);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Name Section - Blue Theme */}
      <Card className="section-card section-blue">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-blue-500"></span>
            Name
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Input
              name="namePrefix"
              placeholder="Prefix"
              defaultValue={initialData?.namePrefix}
              className="md:col-span-1 rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="firstName"
              placeholder="First Name"
              defaultValue={initialData?.firstName}
              required
              className="md:col-span-2 rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="middleName"
              placeholder="Middle Name"
              defaultValue={initialData?.middleName}
              className="md:col-span-1 rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              defaultValue={initialData?.lastName}
              required
              className="md:col-span-2 rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Profile Images Section - Purple Theme */}
      <Card className="section-card section-purple">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-purple-500"></span>
            Profile Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Profile Photo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
                className="cursor-pointer rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {photo && (
                <div className="mt-2 p-2 border rounded-lg bg-zinc-50">
                  <img src={photo} alt="Profile" className="w-24 h-24 object-cover rounded-lg" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Company Logo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'logo')}
                className="cursor-pointer rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {logo && (
                <div className="mt-2 p-2 border rounded-lg bg-zinc-50">
                  <img src={logo} alt="Logo" className="w-24 h-24 object-cover rounded-lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Organization Section - Green Theme */}
      <Card className="section-card section-green">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-emerald-500"></span>
            Organization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="organization"
              placeholder="Organization"
              defaultValue={initialData?.organization}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="title"
              placeholder="Title"
              defaultValue={initialData?.title}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="role"
              placeholder="Role"
              defaultValue={initialData?.role}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Contact Information Section - Orange Theme */}
      <Card className="section-card section-orange">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-orange-500"></span>
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Personal Email (Login Email)</label>
              <Input
                name="sessionEmail"
                type="email"
                value={sessionEmail}
                disabled
                className="bg-zinc-50 rounded-lg border-zinc-200"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="workEmail"
                type="email"
                placeholder="Work Email"
                defaultValue={initialData?.workEmail}
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {/* <Input
                name="personalEmail"
                type="email"
                placeholder="Personal Email"
                defaultValue={initialData?.personalEmail}
              /> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="mobilePhone"
                placeholder="Mobile Phone"
                defaultValue={initialData?.mobilePhone}
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                name="workPhone"
                placeholder="Work Phone"
                defaultValue={initialData?.workPhone}
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                name="homePhone"
                placeholder="Home Phone"
                defaultValue={initialData?.homePhone}
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                name="fax"
                placeholder="Fax"
                defaultValue={initialData?.fax}
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Work Address Section - Teal Theme */}
      <Card className="section-card section-teal">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-teal-500"></span>
            Work Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="workStreet"
              placeholder="Street"
              defaultValue={initialData?.workStreet}
              className="md:col-span-2 rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="workCity"
              placeholder="City"
              defaultValue={initialData?.workCity}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="workState"
              placeholder="State"
              defaultValue={initialData?.workState}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="workPostalCode"
              placeholder="Postal Code"
              defaultValue={initialData?.workPostalCode}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="workCountry"
              placeholder="Country"
              defaultValue={initialData?.workCountry}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Home Address Section - Rose Theme */}
      <Card className="section-card section-rose">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-rose-500"></span>
            Home Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                name="homeStreet"
                placeholder="Street Address"
                defaultValue={initialData?.homeStreet}
                className="input-base w-full"
              />
            </div>
            <Input
              name="homeDistrict"
              placeholder="District"
              defaultValue={initialData?.homeDistrict}
              className="input-base"
            />
            <Input
              name="homeCity"
              placeholder="City"
              defaultValue={initialData?.homeCity}
              className="input-base"
            />
            <Input
              name="homeState"
              placeholder="State/Province"
              defaultValue={initialData?.homeState}
              className="input-base"
            />
            <Input
              name="homeCountry"
              placeholder="Country"
              defaultValue={initialData?.homeCountry}
              className="input-base"
            />
          </div>
        </div>
      </Card>

      {/* Online Presence Section - Indigo Theme */}
      <Card className="section-card section-indigo">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-indigo-500"></span>
            Online Presence
          </h3>
          <Input
            name="website"
            type="url"
            placeholder="Website"
            defaultValue={initialData?.website}
            className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="linkedin"
              placeholder="LinkedIn URL"
              defaultValue={initialData?.linkedin}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="twitter"
              placeholder="Twitter URL"
              defaultValue={initialData?.twitter}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="facebook"
              placeholder="Facebook URL"
              defaultValue={initialData?.facebook}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="instagram"
              placeholder="Instagram URL"
              defaultValue={initialData?.instagram}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="youtube"
              placeholder="YouTube URL"
              defaultValue={initialData?.youtube}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              name="github"
              placeholder="GitHub URL"
              defaultValue={initialData?.github}
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Additional Information - Rose Theme */}
      <Card className="section-card section-rose">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-rose-500"></span>
            Additional Information
          </h3>
          <Input
            name="birthday"
            type="date"
            placeholder="Birthday"
            defaultValue={initialData?.birthday}
            className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <Textarea
            name="notes"
            placeholder="Notes"
            rows={4}
            defaultValue={initialData?.notes}
            className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </Card>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Saving...
          </div>
        ) : (
          "Save Profile"
        )}
      </Button>
    </form>
  )
} 