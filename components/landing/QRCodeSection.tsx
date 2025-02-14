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
  }
}

export function QRCodeSection({ isComplete, userData }: QRCodeSectionProps) {
  const qrCodeData = `BEGIN:VCARD\nVERSION:3.0\nFN:${userData.name}\nEMAIL:${userData.email}\nEND:VCARD`
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

