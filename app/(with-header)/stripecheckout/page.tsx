'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Checkout } from '@/components/stripecheckout/Checkout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        <Checkout />
        <h2> Hello  </h2>
      </div>
    </Elements>
  )
}

