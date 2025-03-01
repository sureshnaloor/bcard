"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import FileSaver from "file-saver"
import type { VCardData } from "@/types/vcard"
import { toast } from "react-hot-toast"

interface VCardSectionProps {
  userData: VCardData | null
}

export function VCardSection({ userData }: VCardSectionProps) {
  if (!userData) return null

  const generateVCardString = (data: any) => {
    // Construct full name
    const lastName = data.lastName?.trim() || ''
    const firstName = data.firstName?.trim() || ''
    const middleName = data.middleName?.trim() || ''
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')

    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${lastName};${firstName};${middleName};;;`,
      `FN:${fullName}`,
      data.organization ? `ORG:${data.organization}` : '',
      data.title ? `TITLE:${data.title}` : '',
      data.role ? `ROLE:${data.role}` : '',
      data.workEmail ? `EMAIL;type=WORK:${data.workEmail}` : '',
      data.personalEmail ? `EMAIL;type=HOME:${data.personalEmail}` : '',
      data.mobilePhone ? `TEL;type=CELL:${data.mobilePhone}` : '',
      data.workPhone ? `TEL;type=WORK:${data.workPhone}` : '',
      data.homePhone ? `TEL;type=HOME:${data.homePhone}` : '',
      data.fax ? `TEL;type=FAX:${data.fax}` : '',
      data.website ? `URL:${data.website}` : '',
      data.workStreet ? `ADR;type=WORK:;;${data.workStreet};${data.workCity || ''};${data.workState || ''};${data.workPostalCode || ''};${data.workCountry || ''}` : '',
      data.homeStreet ? `ADR;type=HOME:;;${data.homeStreet};${data.homeCity || ''};${data.homeState || ''};${data.homeDistrict || ''};${data.homeCountry || ''}` : '',
      data.linkedin ? `X-SOCIALPROFILE;type=linkedin:${data.linkedin}` : '',
      data.twitter ? `X-SOCIALPROFILE;type=twitter:${data.twitter}` : '',
      data.facebook ? `X-SOCIALPROFILE;type=facebook:${data.facebook}` : '',
      data.instagram ? `X-SOCIALPROFILE;type=instagram:${data.instagram}` : '',
      data.youtube ? `X-SOCIALPROFILE;type=youtube:${data.youtube}` : '',
      data.github ? `X-SOCIALPROFILE;type=github:${data.github}` : '',
      data.birthday ? `BDAY:${data.birthday}` : '',
      data.notes ? `NOTE:${data.notes}` : '',
      // Updated PHOTO property format
      data.photo ? `PHOTO;ENCODING=BASE64;TYPE=JPEG;VALUE=URI:${data.photo.split(',')[1]}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\r\n')

    return vCardData
  }

  const downloadVCard = async () => {
    try {
      // Create a copy of userData without logo
      const vcardUserData = {
        ...userData,
        logo: undefined
      }

      const vCardString = generateVCardString(vcardUserData)
      const blob = new Blob([vCardString], { type: "text/vcard;charset=utf-8" })

      // Store vCard blob in MongoDB
      const response = await fetch("/api/userdata/vcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vCardContent: vCardString,
          userEmail: userData.workEmail // or any unique identifier
        })
      })

      if (!response.ok) {
        throw new Error("Failed to store vCard")
      }

      // Download the vCard
      FileSaver.saveAs(blob, "contact.vcf")
    } catch (error) {
      console.error("Error handling vCard:", error)
      toast.error("Failed to generate vCard")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>vCard</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6">
        <div className="text-sm space-y-6 border rounded-md p-6 bg-gray-50">
          {/* Show only photo in preview, not logo */}
          {userData.photo && (
            <div className="space-y-2">
              <h3 className="font-medium">Profile Photo</h3>
              <div>
                <img 
                  src={userData.photo} 
                  alt="Profile Photo" 
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
              <Separator className="my-2" />
            </div>
          )}

          {/* Name Information */}
          {(userData.firstName || userData.middleName || userData.lastName) && (
            <div className="space-y-2">
              <h3 className="font-medium">Name</h3>
              <p>Full Name: {[userData.firstName, userData.middleName, userData.lastName].filter(Boolean).join(' ')}</p>
              <Separator className="my-2" />
            </div>
          )}

          {/* Organization Information */}
          {(userData.organization || userData.title || userData.role) && (
            <div className="space-y-2">
              <h3 className="font-medium">Organization</h3>
              {userData.organization && <p>Organization: {userData.organization}</p>}
              {userData.title && <p>Title: {userData.title}</p>}
              {userData.role && <p>Role: {userData.role}</p>}
              <Separator className="my-2" />
            </div>
          )}

          {/* Contact Information */}
          {(userData.workEmail || userData.personalEmail || userData.mobilePhone || userData.workPhone || userData.homePhone || userData.fax) && (
            <div className="space-y-2">
              <h3 className="font-medium">Contact</h3>
              {userData.workEmail && <p>Work Email: {userData.workEmail}</p>}
              {userData.personalEmail && <p>Personal Email: {userData.personalEmail}</p>}
              {userData.mobilePhone && <p>Mobile: {userData.mobilePhone}</p>}
              {userData.workPhone && <p>Work Phone: {userData.workPhone}</p>}
              {userData.homePhone && <p>Home Phone: {userData.homePhone}</p>}
              {userData.fax && <p>Fax: {userData.fax}</p>}
              <Separator className="my-2" />
            </div>
          )}

          {/* Address Information */}
          {userData.workCountry && (
            <div className="space-y-2">
              <h3 className="font-medium">Work Address</h3>
              <p>{[
                userData.workStreet,
                userData.workCity,
                userData.workState,
                userData.workPostalCode,
                userData.workCountry
              ].filter(Boolean).join(', ')}</p>
              <Separator className="my-2" />
            </div>
          )}

          {/* Add Home Address preview */}
          {(userData.homeStreet || userData.homeCity || userData.homeState || userData.homeCountry) && (
            <div className="space-y-2">
              <h3 className="font-medium">Home Address</h3>
              <p className="text-gray-600">
                {[
                  userData.homeStreet,
                  userData.homeDistrict,
                  userData.homeCity,
                  userData.homeState,
                  userData.homeCountry
                ].filter(Boolean).join(', ')}
              </p>
              <Separator className="my-2" />
            </div>
          )}

          {/* Online Presence */}
          {(userData.website || userData.linkedin || userData.twitter || userData.facebook || userData.instagram || userData.youtube || userData.github) && (
            <div className="space-y-2">
              <h3 className="font-medium">Online Presence</h3>
              {userData.website && <p>Website: {userData.website}</p>}
              {userData.linkedin && <p>LinkedIn: {userData.linkedin}</p>}
              {userData.twitter && <p>Twitter: {userData.twitter}</p>}
              {userData.facebook && <p>Facebook: {userData.facebook}</p>}
              {userData.instagram && <p>Instagram: {userData.instagram}</p>}
              {userData.youtube && <p>YouTube: {userData.youtube}</p>}
              {userData.github && <p>GitHub: {userData.github}</p>}
              <Separator className="my-2" />
            </div>
          )}

          {/* Additional Information */}
          {(userData.birthday || userData.notes) && (
            <div className="space-y-2">
              <h3 className="font-medium">Additional Information</h3>
              {userData.birthday && <p>Birthday: {userData.birthday}</p>}
              {userData.notes && <p>Notes: {userData.notes}</p>}
            </div>
          )}
        </div>

        <Button onClick={downloadVCard} className="w-full">
          {Object.keys(userData).length > 0 ? 'Download vCard' : 'Create vCard'}
        </Button>
      </CardContent>
    </Card>
  )
}

