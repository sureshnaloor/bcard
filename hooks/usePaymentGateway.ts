import { useState, useEffect } from 'react';
import { PaymentGateway } from '@/types/payment';
import { LocationService } from '@/services/location-service';
import { defaultGateway } from '@/config/payment-gateways';

export function usePaymentGateway() {
  const [gateway, setGateway] = useState<PaymentGateway>(defaultGateway.gateway);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string>(defaultGateway.country);

  useEffect(() => {
    async function detectAndSetGateway() {
      try {
        const detectedCountry = await LocationService.detectCountry();
        setCountry(detectedCountry);
        const appropriateGateway = LocationService.getGatewayForCountry(detectedCountry);
        setGateway(appropriateGateway);
      } catch (error) {
        console.error('Error setting payment gateway:', error);
      } finally {
        setLoading(false);
      }
    }

    detectAndSetGateway();
  }, []);

  return { gateway, loading, country };
} 