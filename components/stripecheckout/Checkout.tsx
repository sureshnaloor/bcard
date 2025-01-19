'use client'

import { useState } from 'react'
import { ProductSelection } from './ProductSelection'
import { ContactInfo } from './ContactInfo'
import { ShippingInfo } from './ShippingInfo'
import { PaymentForm } from './PaymentForm'
import { ProgressIndicator } from './ProgressIndicator'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

const steps = ['Product Selection', 'Contact Info', 'Shipping Info', 'Payment']

export function Checkout() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    products: [],
    contactInfo: {},
    shippingInfo: {},
  })
  const { theme } = useTheme()

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleFormDataChange = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ProductSelection onDataChange={handleFormDataChange} />
      case 1:
        return <ContactInfo onDataChange={handleFormDataChange} />
      case 2:
        return <ShippingInfo onDataChange={handleFormDataChange} />
      case 3:
        return <PaymentForm formData={formData} theme={theme} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressIndicator steps={steps} currentStep={currentStep} />
      {renderStep()}
      <div className="mt-8 flex justify-between">
        {currentStep > 0 && (
          <Button onClick={handlePrevious}>Previous</Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  )
}

