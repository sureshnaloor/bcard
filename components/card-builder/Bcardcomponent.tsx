"use client"

import { QRCodeSVG } from "qrcode.react"
import { Mail, Phone, Globe, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BusinessCardProps {
  name: string
  company: string
  title: string
  address: {
    street: string
    city: string
    country: string
  }
  email: string
  website: string
  phone: string
}

export default function BCardcomponent({ name, company, title, address, email, website, phone }: BusinessCardProps) {
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
TITLE:${title}
ADR:;;${address.street};${address.city};;${address.country}
EMAIL:${email}
TEL:${phone}
URL:${website}
END:VCARD`

  return (
    <div className="w-[3.5in] h-[2in] bg-pearl-white p-4 rounded-lg shadow-lg flex">
      <div className="flex-grow">
        <h1 className="text-[16px] font-semibold text-gray-800">{name}</h1>
        <p className="text-[12px] text-gray-600 mb-2">{title}</p>
        <p className="text-[12px] font-medium text-gray-700 mb-4">{company}</p>

        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center">
            <MapPin size={12} className="mr-1" />
            {address.street}, {address.city}, {address.country}
          </p>
          <p className="text-xs text-gray-600 flex items-center">
            <Mail size={12} className="mr-1" />
            {email}
          </p>
          <p className="text-xs text-gray-600 flex items-center">
            <Globe size={12} className="mr-1" />
            {website}
          </p>
          <p className="text-xs text-gray-600 flex items-center">
            <Phone size={12} className="mr-1" />
            {phone}
          </p>
        </div>

        
      </div>

      <div className="flex flex-col items-end justify-between">
        <QRCodeSVG value={vCardData} size={64} />
      </div>
    </div>
  )
}

