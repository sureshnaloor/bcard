import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Updated import path
import { redirect } from "next/navigation";
import SubscriberManagement from "@/components/admin/SubscriberManagement";

export default async function AdminSubscribersPage() {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Subscriber Management</h1>
      <SubscriberManagement />
    </div>
  );
} 