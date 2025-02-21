"use client"

import { useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FileSaver from "file-saver"


interface QRCodeSectionProps {
  isComplete: boolean
  userData: {
    name: string
    email: string
    organization: string
    title: string
    address: string
    website: string
    phone: string
    fax: string
    notes: string
    linkedin: string
    twitter: string
    facebook: string
    instagram: string
    youtube: string
    github: string
    mobilePhone?: string
    workPhone?: string
    homePhone?: string
    workEmail?: string
    firstName?: string
    middleName?: string
    lastName?: string
  }
}

export function QRCodeSection({ isComplete, userData }: QRCodeSectionProps) {
  // Ensure each name component exists and is properly formatted
  const lastName = userData.lastName?.trim() || ''
  const firstName = userData.firstName?.trim() || ''
  const middleName = userData.middleName?.trim() || ''
  
  // Construct full name for FN field
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')

  const qrCodeData = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};${middleName};;;
FN:${fullName}
${userData.organization ? `ORG:${userData.organization}\n` : ''}
${userData.title ? `TITLE:${userData.title}\n` : ''}
${userData.workEmail ? `EMAIL;type=WORK:${userData.workEmail}\n` : ''}
${userData.mobilePhone ? `TEL;type=CELL:${userData.mobilePhone}\n` : ''}
${userData.workPhone ? `TEL;type=WORK:${userData.workPhone}\n` : ''}
${userData.homePhone ? `TEL;type=HOME:${userData.homePhone}\n` : ''}
${userData.fax ? `TEL;type=FAX:${userData.fax}\n` : ''}
${userData.website ? `URL:${userData.website}\n` : ''}
${userData.address ? `ADR:;;${userData.address}\n` : ''}
${userData.linkedin ? `X-SOCIALPROFILE;type=linkedin:${userData.linkedin}\n` : ''}
${userData.twitter ? `X-SOCIALPROFILE;type=twitter:${userData.twitter}\n` : ''}
${userData.facebook ? `X-SOCIALPROFILE;type=facebook:${userData.facebook}\n` : ''}
${userData.instagram ? `X-SOCIALPROFILE;type=instagram:${userData.instagram}\n` : ''}
${userData.youtube ? `X-SOCIALPROFILE;type=youtube:${userData.youtube}\n` : ''}
${userData.github ? `X-SOCIALPROFILE;type=github:${userData.github}\n` : ''}
${userData.notes ? `NOTE:${userData.notes}\n` : ''}
END:VCARD`.replace(/\n+/g, '\n')  // Remove any double newlines
  const qrRef = useRef<SVGSVGElement>(null)

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = document.createElement("canvas")
      const svg = qrRef.current
      const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)))
      const w = Number.parseInt(svg.getAttribute("width") || "200")
      const h = Number.parseInt(svg.getAttribute("height") || "200")
      const img_to_download = document.createElement("img")
      img_to_download.src = "data:image/svg+xml;base64," + base64doc
      console.log(w, h)
      img_to_download.onload = () => {
        console.log("img loaded")
        canvas.setAttribute("width", w.toString())
        canvas.setAttribute("height", h.toString())
        const context = canvas.getContext("2d")
        if (context) {
          context.drawImage(img_to_download, 0, 0, w, h)
          const dataURL = canvas.toDataURL("image/png")
          FileSaver.saveAs(dataURL, "qr-code.png")
        }
      }
    }
  }

  if (!isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Complete your digital card to generate a QR Code.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <QRCodeSVG
          ref={qrRef}
          id="qr-code"
          value={qrCodeData}
          size={200}
          level={"H"}
          includeMargin={true}
          imageSettings={{
            src: "/backgrounds/businesscard.png",
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
        <Button onClick={downloadQRCode}>Download QR Code</Button>
      </CardContent>
    </Card>
  )
}

