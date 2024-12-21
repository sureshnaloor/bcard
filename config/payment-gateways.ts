import { CountryGatewayMap } from '@/types/payment';

export const countryGatewayMappings: CountryGatewayMap[] = [
  // GCC Countries - PayTabs
  { country: 'SA', gateway: 'paytabs', currency: 'SAR', enabled: true }, // Saudi Arabia
  { country: 'AE', gateway: 'paytabs', currency: 'AED', enabled: true }, // UAE
  { country: 'BH', gateway: 'paytabs', currency: 'BHD', enabled: true }, // Bahrain
  { country: 'KW', gateway: 'paytabs', currency: 'KWD', enabled: true }, // Kuwait
  { country: 'OM', gateway: 'paytabs', currency: 'OMR', enabled: true }, // Oman
  { country: 'QA', gateway: 'paytabs', currency: 'QAR', enabled: true }, // Qatar

  // India - Razorpay
  { country: 'IN', gateway: 'razorpay', currency: 'INR', enabled: true },

  // Other major countries - Stripe
  { country: 'US', gateway: 'stripe', currency: 'USD', enabled: true },
  { country: 'CA', gateway: 'stripe', currency: 'CAD', enabled: true },
  { country: 'GB', gateway: 'stripe', currency: 'GBP', enabled: true },
  // Add more countries as needed
];

export const defaultGateway: CountryGatewayMap = {
  country: 'US',
  gateway: 'stripe',
  currency: 'USD',
  enabled: true
}; 