import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Use the latest API version
  appInfo: {
    name: 'NFC Business Card Checkout',
    version: '0.1.0'
  }
})

