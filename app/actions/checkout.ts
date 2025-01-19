'use server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export async function createCheckoutSession(formData: {
  quantity: number;
  cardType: string;
  shippingInfo?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}) {
  try {
    // Calculate price based on card type
    const prices = {
      'standard': 999, // $9.99
      'premium': 1999, // $19.99
      'enterprise': 4999 // $49.99
    };
    
    const unitAmount = prices[formData.cardType as keyof typeof prices] || prices.standard;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: formData.cardType 
                ? `${formData.cardType.charAt(0).toUpperCase() + formData.cardType.slice(1)} Business Card`
                : 'Standard Business Card',
              description: `${formData.quantity || 1} business card(s)`,
            },
            unit_amount: unitAmount,
          },
          quantity: formData.quantity || 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'], // Add more countries as needed
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 500, // $5.00
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // $15.00
              currency: 'usd',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 2,
              },
            },
          },
        },
      ],
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
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

