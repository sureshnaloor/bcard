import { UserDataForm } from "@/components/forms/UserDataForm"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Update Your Profile</h1>
      <UserDataForm />
    </div>
  )
} 