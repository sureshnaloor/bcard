import { GeoLocation, PaymentGateway } from '@/types/payment';
import { countryGatewayMappings, defaultGateway } from '@/config/payment-gateways';

export class LocationService {
  static async detectCountry(): Promise<string> {
    try {
      console.log('Starting country detection...');
      
      // Try IP detection first
      const ipCountry = await this.getCountryFromIP();
      if (ipCountry) {
        console.log('Country detected from IP:', ipCountry);
        return ipCountry;
      }

      // Try geolocation second
      const geoCountry = await this.getCountryFromGeolocation();
      if (geoCountry) {
        console.log('Country detected from Geolocation:', geoCountry);
        return geoCountry;
      }

      // Use browser locale as last resort
      const browserCountry = await this.getCountryFromBrowser();
      if (browserCountry) {
        console.log('Country detected from Browser:', browserCountry);
        return browserCountry;
      }

      console.log('No country detected, using default:', defaultGateway.country);
      return defaultGateway.country;

    } catch (error) {
      console.error('Error detecting country:', error);
      return defaultGateway.country;
    }
  }

  private static async getCountryFromIP(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      console.log('IP API response:', data);
      return data.country_code;
    } catch (error) {
      console.error('IP detection error:', error);
      return '';
    }
  }

  private static async getCountryFromGeolocation(): Promise<string> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              const countryCode = data.address?.country_code?.toUpperCase() || '';
              console.log('Geolocation response:', data);
              resolve(countryCode);
            } catch (error) {
              console.error('Geolocation error:', error);
              resolve('');
            }
          },
          (error) => {
            console.error('Geolocation permission error:', error);
            resolve('');
          }
        );
      } else {
        console.log('Geolocation not available');
        resolve('');
      }
    });
  }

  private static getCountryFromBrowser(): Promise<string> {
    return new Promise((resolve) => {
      try {
        if (typeof window !== 'undefined') {
          const language = navigator.language || (navigator as any).userLanguage;
          console.log('Browser language:', language);
          // Only use browser locale if it's clearly a country code
          const country = language.split('-')[1] || '';
          if (country.length === 2) {
            resolve(country.toUpperCase());
          } else {
            resolve('');
          }
        } else {
          resolve('');
        }
      } catch (error) {
        console.error('Browser detection error:', error);
        resolve('');
      }
    });
  }

  static getGatewayForCountry(countryCode: string): PaymentGateway {
    console.log('Finding gateway for country:', countryCode);
    const mapping = countryGatewayMappings.find(
      m => m.country === countryCode && m.enabled
    );
    console.log('Selected gateway:', mapping?.gateway || defaultGateway.gateway);
    return mapping?.gateway || defaultGateway.gateway;
  }
} 