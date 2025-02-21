"use client"

import { useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VCardData } from "@/types/vcard"

interface QRCodeSectionProps {
  userData: VCardData | null
}

export function QRCodeSection({ userData }: QRCodeSectionProps) {
  if (!userData) return null

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
${userData.notes ? `NOTE:${userData.notes}\n` : ''}
END:VCARD`.replace(/\n+/g, '\n')  // Remove any double newlines
  const qrRef = useRef<SVGSVGElement>(null)

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = document.createElement("canvas")
      const svg = qrRef.current
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)
      
      const img = new Image()
      img.onload = () => {
        canvas.width = svg.width.baseVal.value
        canvas.height = svg.height.baseVal.value
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          
          const pngUrl = canvas.toDataURL("image/png")
          const downloadLink = document.createElement("a")
          downloadLink.href = pngUrl
          downloadLink.download = "qr-code.png"
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
          URL.revokeObjectURL(svgUrl)
        }
      }
      img.src = svgUrl
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <QRCodeSVG
          ref={qrRef}
          value={qrCodeData}
          size={200}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/backgrounds/businesscard.png",
            height: 24,
            width: 24,
            excavate: true
          }}
        />
        <Button onClick={downloadQRCode}>Download QR Code</Button>
      </CardContent>
    </Card>
  )
}

