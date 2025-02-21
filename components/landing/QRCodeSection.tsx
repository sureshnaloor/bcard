"use client"

import { useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VCardData } from "@/types/vcard"
import { generateVCardString } from "@/lib/utils/generateVCard"

interface QRCodeSectionProps {
  userData: VCardData | null
}

export function QRCodeSection({ userData }: QRCodeSectionProps) {
  if (!userData) return null

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
          value={generateVCardString(userData)}
          size={200}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/images/logo.png",
            height: 40,
            width: 40,
            excavate: true
          }}
        />
        <Button onClick={downloadQRCode}>Download QR Code</Button>
      </CardContent>
    </Card>
  )
}

