"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DigitalCard } from "./DigitalCard"
import type { VCardData } from "@/types/vcard"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface DigitalCardSectionProps {
  userData: VCardData | null
}

export function DigitalCardSection({ userData }: DigitalCardSectionProps) {
  if (!userData) return null
  const frontCardRef = useRef<HTMLDivElement>(null)
  const backCardRef = useRef<HTMLDivElement>(null)

  const downloadCards = async () => {
    if (!frontCardRef.current || !backCardRef.current) return

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [3.5, 2]
    })

    // Capture front card
    const frontCanvas = await html2canvas(frontCardRef.current)
    const frontImgData = frontCanvas.toDataURL("image/png")
    pdf.addImage(frontImgData, "PNG", 0, 0, 3.5, 2)

    // Add new page and capture back card
    pdf.addPage()
    const backCanvas = await html2canvas(backCardRef.current)
    const backImgData = backCanvas.toDataURL("image/png")
    pdf.addImage(backImgData, "PNG", 0, 0, 3.5, 2)

    pdf.save("digital-cards.pdf")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Digital Business Card</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <div ref={frontCardRef}>
            <DigitalCard userData={userData} side="front" />
          </div>
          <div ref={backCardRef}>
            <DigitalCard userData={userData} side="back" />
          </div>
        </div>
        
        <Button onClick={downloadCards} className="w-full">
          Download Business Cards
        </Button>
      </CardContent>
    </Card>
  )
}

