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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"

interface UserDataFormProps {
  initialData?: VCardData | null
  sessionEmail?: string
}

// Define the validation schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  workCity: z.string().min(1, "City is required"),
  workCountry: z.string().min(1, "Country is required"),
  mobilePhone: z.string().min(1, "Mobile number is required"),
  // Optional fields
  workStreet: z.string().optional(),
  workState: z.string().optional(),
  workPostalCode: z.string().optional(),
  workDistrict: z.string().optional(),
  workEmail: z.string().optional(),
  workPhone: z.string().optional(),
  homePhone: z.string().optional(),
  fax: z.string().optional(),
  homeStreet: z.string().optional(),
  homeDistrict: z.string().optional(),
  homeCity: z.string().optional(),
  homeState: z.string().optional(),
  homeCountry: z.string().optional(),
  homePostalCode: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  github: z.string().optional(),
  birthday: z.string().optional(),
  notes: z.string().optional(),
})

export function UserDataForm({ initialData, sessionEmail }: UserDataFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
    trigger
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      // Required fields
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      title: initialData?.title || "",
      organization: initialData?.organization || "",
      workCity: initialData?.workCity || "",
      workCountry: initialData?.workCountry || "",
      mobilePhone: initialData?.mobilePhone || "",
      // Optional fields
      workStreet: initialData?.workStreet || "",
      workState: initialData?.workState || "",
      workPostalCode: initialData?.workPostalCode || "",
      workEmail: initialData?.workEmail || "",
      workPhone: initialData?.workPhone || "",
      homePhone: initialData?.homePhone || "",
      fax: initialData?.fax || "",
      homeStreet: initialData?.homeStreet || "",
      homeDistrict: initialData?.homeDistrict || "",
      homeCity: initialData?.homeCity || "",
      homeState: initialData?.homeState || "",
      homeCountry: initialData?.homeCountry || "",
      website: initialData?.website || "",
      linkedin: initialData?.linkedin || "",
      twitter: initialData?.twitter || "",
      facebook: initialData?.facebook || "",
      instagram: initialData?.instagram || "",
      youtube: initialData?.youtube || "",
      github: initialData?.github || "",
      birthday: initialData?.birthday || "",
      notes: initialData?.notes || "",
    }
  })
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
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      // Include photo and logo in the submission data
      const submissionData = {
        ...data,
        photo,
        logo,
      }

      const response = await fetch("/api/userdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
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

  // Add this to show validation messages for required fields
  const handleBlur = async (fieldName: keyof typeof formSchema["shape"]) => {
    await trigger(fieldName);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Name Section - Blue Theme */}
      <Card className="section-card section-blue">
        <div className="space-y-4">
          <h3 className="section-header">
            <span className="section-indicator bg-blue-500"></span>
            Name
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("firstName", {
                  onBlur: () => handleBlur("firstName")
                })}
                className={cn(
                  "rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                  errors.firstName && touchedFields.firstName && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.firstName && touchedFields.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("lastName", {
                  onBlur: () => handleBlur("lastName")
                })}
                className={cn(
                  "rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                  errors.lastName && touchedFields.lastName && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.lastName && touchedFields.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
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
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("organization", {
                  onBlur: () => handleBlur("organization")
                })}
                className={cn(
                  "rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                  errors.organization && touchedFields.organization && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.organization && touchedFields.organization && (
                <p className="mt-1 text-sm text-red-500">{errors.organization.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("title", {
                  onBlur: () => handleBlur("title")
                })}
                className={cn(
                  "rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                  errors.title && touchedFields.title && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.title && touchedFields.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
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
                {...register("mobilePhone", {
                  onBlur: () => handleBlur("mobilePhone")
                })}
                placeholder="Mobile Phone *"
                className={cn(
                  "rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                  errors.mobilePhone && touchedFields.mobilePhone && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.mobilePhone && touchedFields.mobilePhone && (
                <p className="mt-1 text-sm text-red-500">{errors.mobilePhone.message}</p>
              )}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <Input
                {...register("workStreet")}
                placeholder="Enter street address"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <Input
                {...register("workDistrict")}
                placeholder="Enter district"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("workCity", {
                  onBlur: () => handleBlur("workCity")
                })}
                placeholder="Enter city"
                className={cn(
                  "rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                  errors.workCity && touchedFields.workCity && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.workCity && touchedFields.workCity && (
                <p className="mt-1 text-sm text-red-500">{errors.workCity.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
              <Input
                {...register("workPostalCode")}
                placeholder="Enter postal code"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State/Province</label>
              <Input
                {...register("workState")}
                placeholder="Enter state/province"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("workCountry", {
                  onBlur: () => handleBlur("workCountry")
                })}
                placeholder="Enter country"
                className={cn(
                  "rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                  errors.workCountry && touchedFields.workCountry && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.workCountry && touchedFields.workCountry && (
                <p className="mt-1 text-sm text-red-500">{errors.workCountry.message}</p>
              )}
            </div>
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
              <label className="block text-sm font-medium mb-1">Street Address</label>
              <Input
                {...register("homeStreet")}
                placeholder="Enter street address"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <Input
                {...register("homeDistrict")}
                placeholder="Enter district"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                {...register("homeCity")}
                placeholder="Enter city"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
              <Input
                {...register("homePostalCode", {
                  onBlur: () => handleBlur("homePostalCode")
                })}
                placeholder="Enter postal code"
                className={cn(
                  "rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500",
                  errors.homePostalCode && touchedFields.homePostalCode && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              {errors.homePostalCode && touchedFields.homePostalCode && (
                <p className="mt-1 text-sm text-red-500">{errors.homePostalCode.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State/Province</label>
              <Input
                {...register("homeState")}
                placeholder="Enter state/province"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <Input
                {...register("homeCountry")}
                placeholder="Enter country"
                className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
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
            {...register("website")}
            type="url"
            placeholder="Website"
            className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("linkedin")}
              placeholder="LinkedIn URL"
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              {...register("twitter")}
              placeholder="Twitter URL"
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              {...register("facebook")}
              placeholder="Facebook URL"
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              {...register("instagram")}
              placeholder="Instagram URL"
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              {...register("youtube")}
              placeholder="YouTube URL"
              className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              {...register("github")}
              placeholder="GitHub URL"
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
            {...register("birthday")}
            type="date"
            placeholder="Birthday"
            className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
          />
          <Textarea
            {...register("notes")}
            placeholder="Notes"
            rows={4}
            className="rounded-lg border-zinc-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </Card>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors"
        disabled={loading}
        onClick={async () => {
          const isValid = await trigger();
          if (!isValid) {
            toast.error("Please fill in all required fields");
          }
        }}
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