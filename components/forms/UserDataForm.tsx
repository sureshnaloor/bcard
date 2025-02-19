"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-hot-toast"

export function UserDataForm() {
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
          <Input name="firstName" placeholder="First Name" required />
          <Input name="middleName" placeholder="Middle Name" />
          <Input name="lastName" placeholder="Last Name" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="organization" placeholder="Organization" required />
          <Input name="title" placeholder="Title" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="website" type="url" placeholder="Website" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="mobilePhone" placeholder="Mobile Phone" />
          <Input name="workPhone" placeholder="Work Phone" />
          <Input name="homePhone" placeholder="Home Phone" />
        </div>

        <Input name="fax" placeholder="Fax" />
        <Textarea name="address" placeholder="Address" rows={3} />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="linkedin" placeholder="LinkedIn URL" />
            <Input name="twitter" placeholder="Twitter URL" />
            <Input name="facebook" placeholder="Facebook URL" />
            <Input name="instagram" placeholder="Instagram URL" />
            <Input name="youtube" placeholder="YouTube URL" />
            <Input name="github" placeholder="GitHub URL" />
          </div>
        </div>

        <Textarea name="notes" placeholder="Notes" rows={4} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
} 