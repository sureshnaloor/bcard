export type PaymentGateway = 'stripe' | 'paytabs' | 'razorpay';

export interface CountryGatewayMap {
  country: string;
  gateway: PaymentGateway;
  currency: string;
  enabled: boolean;
}

export interface GeoLocation {
  country?: string;
  ip?: string;
  timezone?: string;
  browserLocale?: string;
} 