import { MapPin, Mail, Phone, Globe, Calendar, MessageSquare } from "lucide-react"
import { FaLinkedin, FaTwitter, FaGithub, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"
import type { VCardData } from "@/types/vcard"

interface DigitalCardProps {
  userData: VCardData
  side: 'front' | 'back'
}

export function DigitalCard({ userData, side }: DigitalCardProps) {
  const fullName = [userData.firstName, userData.middleName, userData.lastName].filter(Boolean).join(' ')
  const fullAddress = [userData.workStreet, userData.workCity, userData.workState, userData.workPostalCode, userData.workCountry].filter(Boolean).join(', ')

  if (side === 'front') {
    return (
      <div className="w-[3.5in] h-[2in] bg-pearl-white p-4 rounded-lg shadow-lg">
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-[16px] font-bold text-gray-800">{fullName}</h1>
            <div className="text-right">
              <p className="text-[12px] font-semibold text-blue-600">{userData.title}</p>
              <p className="text-[12px] font-bold text-zinc-900">{userData.organization}</p>
            </div>
          </div>

          <div className="space-y-2">
            {fullAddress && (
              <p className="text-xs text-emerald-600 flex items-center">
                <MapPin size={12} className="mr-1 flex-shrink-0" />
                {fullAddress}
              </p>
            )}
            
            <div className="flex justify-between items-center">
              {userData.workEmail && (
                <p className="text-xs text-blue-600 flex items-center">
                  <Mail size={12} className="mr-1 flex-shrink-0" />
                  {userData.workEmail}
                </p>
              )}
              {userData.website && (
                <p className="text-xs text-purple-600 flex items-center">
                  <Globe size={12} className="mr-1 flex-shrink-0" />
                  {userData.website}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {userData.mobilePhone && (
                <p className="text-[10px] text-zinc-600 flex items-center">
                  <Phone size={10} className="mr-1 flex-shrink-0" />
                  {userData.mobilePhone} (mobile)
                </p>
              )}
              {userData.workPhone && (
                <p className="text-[10px] text-zinc-600 flex items-center">
                  <Phone size={10} className="mr-1 flex-shrink-0" />
                  {userData.workPhone} (work)
                </p>
              )}
              {userData.homePhone && (
                <p className="text-[10px] text-zinc-600 flex items-center">
                  <Phone size={10} className="mr-1 flex-shrink-0" />
                  {userData.homePhone} (home)
                </p>
              )}
              {userData.fax && (
                <p className="text-[10px] text-zinc-600 flex items-center">
                  <Phone size={10} className="mr-1 flex-shrink-0" />
                  {userData.fax} (fax)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[3.5in] h-[2in] bg-pearl-white p-4 rounded-lg shadow-lg">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {userData.linkedin && (
            <p className="text-[10px] text-blue-600 flex items-center">
              <FaLinkedin className="mr-1 text-[12px] flex-shrink-0 text-blue-600" />
              {userData.linkedin}
            </p>
          )}
          {userData.twitter && (
            <p className="text-[10px] text-purple-600 flex items-center">
              <FaTwitter className="mr-1 text-[12px] flex-shrink-0 text-purple-600" />
              {userData.twitter}
            </p>
          )}
          {userData.github && (
            <p className="text-[10px] text-blue-600 flex items-center">
              <FaGithub className="mr-1 text-[12px] flex-shrink-0 text-blue-600" />
              {userData.github}
            </p>
          )}
          {userData.facebook && (
            <p className="text-[10px] text-purple-600 flex items-center">
              <FaFacebook className="mr-1 text-[12px] flex-shrink-0 text-purple-600" />
              {userData.facebook}
            </p>
          )}
          {userData.instagram && (
            <p className="text-[10px] text-blue-600 flex items-center">
              <FaInstagram className="mr-1 text-[12px] flex-shrink-0 text-blue-600" />
              {userData.instagram}
            </p>
          )}
          {userData.youtube && (
            <p className="text-[10px] text-purple-600 flex items-center">
              <FaYoutube className="mr-1 text-[12px] flex-shrink-0 text-purple-600" />
              {userData.youtube}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-gray-200">
          {userData.birthday && (
            <p className="text-[10px] text-gray-600 flex items-center mb-2">
              <Calendar size={12} className="mr-1 flex-shrink-0" />
              {userData.birthday}
            </p>
          )}
          {userData.notes && (
            <p className="text-[10px] text-gray-600 flex items-center">
              <MessageSquare size={12} className="mr-1 flex-shrink-0" />
              {userData.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

