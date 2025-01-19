'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createCheckoutSession } from '@/app/actions/checkout'

export function PaymentForm({ formData, theme }: { formData: any; theme: string | undefined }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    try {
      const { sessionId } = await createCheckoutSession(formData)
      const result = await stripe.redirectToCheckout({
        sessionId,
      })

      if (result.error) {
        setError(result.error.message ?? 'An error occurred')
      }
    } catch (error) {
      setError('An error occurred while processing your payment')
    }

    setProcessing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: theme === 'dark' ? '#ffffff' : '#424770',
                    '::placeholder': {
                      color: theme === 'dark' ? '#aab7c4' : '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Button
            type="submit"
            disabled={!stripe || processing}
            className="w-full"
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function getProductPrice(productType: string): number {
  switch (productType) {
    case 'single':
      return 999 // $9.99
    case 'triple':
      return 2499 // $24.99
    case 'set_of_5':
      return 3999 // $39.99
    default:
      return 999 // Default to single card price
  }
}

