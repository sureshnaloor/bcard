import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DigitalCardProps {
  name: string
  company: string
  title: string
  address: {
    street: string
    city: string
    country: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  email: string
  website: string
  phone: string
}

export function DigitalCard({ name, company, title, address, email, website, phone }: DigitalCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{name} - Digital Business Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">{company}</h2>
            <p className="text-sm text-gray-600">{title}</p>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-1">Contact Information</h3>
            <p className="text-sm">Email: {email}</p>
            <p className="text-sm">Phone: {phone}</p>
            <p className="text-sm">Website: {website}</p>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-1">Address</h3>
            <p className="text-sm">{address.street}</p>
            <p className="text-sm">
              {address.city}, {address.country}
            </p>
            <p className="text-sm flex items-center mt-1">
              <MapPin size={16} className="mr-1" />
              Coordinates: {address.coordinates.latitude}, {address.coordinates.longitude}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

