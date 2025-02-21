"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import FileSaver from "file-saver"
import type { VCardData } from "@/types/vcard"

interface VCardSectionProps {
  userData: VCardData | null
}

export function VCardSection({ userData }: VCardSectionProps) {
  if (!userData) return null

  const downloadVCard = () => {
    // Construct full name
    const lastName = userData.lastName?.trim() || ''
    const firstName = userData.firstName?.trim() || ''
    const middleName = userData.middleName?.trim() || ''
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')

    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};${middleName};;;
FN:${fullName}
${userData.organization ? `ORG:${userData.organization}\n` : ''}
${userData.title ? `TITLE:${userData.title}\n` : ''}
${userData.role ? `ROLE:${userData.role}\n` : ''}
${userData.workEmail ? `EMAIL;type=WORK:${userData.workEmail}\n` : ''}
${userData.personalEmail ? `EMAIL;type=HOME:${userData.personalEmail}\n` : ''}
${userData.mobilePhone ? `TEL;type=CELL:${userData.mobilePhone}\n` : ''}
${userData.workPhone ? `TEL;type=WORK:${userData.workPhone}\n` : ''}
${userData.homePhone ? `TEL;type=HOME:${userData.homePhone}\n` : ''}
${userData.fax ? `TEL;type=FAX:${userData.fax}\n` : ''}
${userData.website ? `URL:${userData.website}\n` : ''}
${userData.workStreet ? `ADR;type=WORK:;;${userData.workStreet};${userData.workCity || ''};${userData.workState || ''};${userData.workPostalCode || ''};${userData.workCountry || ''}\n` : ''}
${userData.linkedin ? `X-SOCIALPROFILE;type=linkedin:${userData.linkedin}\n` : ''}
${userData.twitter ? `X-SOCIALPROFILE;type=twitter:${userData.twitter}\n` : ''}
${userData.facebook ? `X-SOCIALPROFILE;type=facebook:${userData.facebook}\n` : ''}
${userData.instagram ? `X-SOCIALPROFILE;type=instagram:${userData.instagram}\n` : ''}
${userData.youtube ? `X-SOCIALPROFILE;type=youtube:${userData.youtube}\n` : ''}
${userData.github ? `X-SOCIALPROFILE;type=github:${userData.github}\n` : ''}
${userData.birthday ? `BDAY:${userData.birthday}\n` : ''}
${userData.notes ? `NOTE:${userData.notes}\n` : ''}
${userData.photoUrl ? `PHOTO;VALUE=URL:${userData.photoUrl}\n` : ''}
${userData.logoUrl ? `LOGO;VALUE=URL:${userData.logoUrl}\n` : ''}
END:VCARD`.replace(/\n+/g, '\n')

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" })
    FileSaver.saveAs(blob, "contact.vcf")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>vCard</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6">
        {/* <p className="text-sm text-gray-500">
          Your vCard contains the following information. Click the download button to save as a .vcf file.
        </p> */}
        
        <div className="text-sm space-y-6 border rounded-md p-6 bg-gray-50">
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
          {userData.workStreet && (
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

        <Button onClick={downloadVCard} className="w-full">Download vCard</Button>
      </CardContent>
    </Card>
  )
}

