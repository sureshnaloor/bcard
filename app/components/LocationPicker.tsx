import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useState, useCallback, useEffect } from 'react';

interface Landmark {
  name: string;
  location: google.maps.LatLngLiteral;
  address: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    landmarks?: Landmark[];
  }) => void;
  onLocationSave: (savedLocation: {
    lat: number;
    lng: number;
    address: string;
    landmark?: string;
  }) => void;
}

export default function LocationPicker({ onLocationSelect, onLocationSave }: LocationPickerProps) {
  const [marker, setMarker] = useState<google.maps.LatLngLiteral | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [currentAddress, setCurrentAddress] = useState('');
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const [savedLocation, setSavedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    landmark?: string;
  } | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const findNearbyLandmarks = async (location: google.maps.LatLngLiteral) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: location,
      radius: 1000, // 1km radius
      type: 'point_of_interest'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const landmarks = results.slice(0, 5).map(place => ({
          name: place.name || '',
          location: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
          },
          address: place.vicinity || ''
        }));
        setLandmarks(landmarks);
        onLocationSelect({
          ...location,
          address: currentAddress,
          landmarks
        });
      }
    });
  };

  // Calculate zoom level for approximately 50km radius
  const INITIAL_ZOOM = 10; // This zoom level shows roughly 50km radius

  useEffect(() => {
    // Only fetch initial location if it hasn't been set yet
    if (!initialLocationSet && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(currentLocation);
          setMarker(currentLocation);
          setInitialLocationSet(true);
          
          if (isLoaded) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: currentLocation }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const address = results[0].formatted_address;
                setCurrentAddress(address);
                onLocationSelect({
                  ...currentLocation,
                  address,
                  landmarks: []
                });
                findNearbyLandmarks(currentLocation);
              }
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setInitialLocationSet(true); // Prevent further attempts
        }
      );
    }
  }, [isLoaded, onLocationSelect, initialLocationSet]);

  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newLocation = { lat, lng };
    setMarker(newLocation);
    setSavedLocation(null); // Reset saved location when new location is picked

    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({ location: newLocation });
    const address = result.results[0]?.formatted_address || '';
    setCurrentAddress(address);
    
    findNearbyLandmarks(newLocation);
  }, [onLocationSelect]);

  const handleSaveLocation = () => {
    if (marker) {
      const nearestLandmark = landmarks.find(l => 
        l.location.lat === marker.lat && 
        l.location.lng === marker.lng
      );
      
      const locationToSave = {
        lat: marker.lat,
        lng: marker.lng,
        address: currentAddress,
        landmark: nearestLandmark?.name
      };
      
      setSavedLocation(locationToSave);
      onLocationSave(locationToSave);
    }
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full rounded-lg overflow-hidden border">
        <GoogleMap
          zoom={INITIAL_ZOOM}
          center={center}
          mapContainerClassName="w-full h-full"
          onClick={handleMapClick}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            minZoom: 3, // Prevent zooming out too far
            maxZoom: 18, // Limit maximum zoom
          }}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Selected Location</h3>
            {marker ? (
              <div className="mt-1 text-sm">
                <p className="text-gray-600">{currentAddress}</p>
                <p className="text-gray-500">
                  {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Click on map to select location</p>
            )}
          </div>
          <button
            onClick={handleSaveLocation}
            disabled={!marker}
            className={`px-3 py-1.5 rounded text-sm font-medium ${
              marker 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {savedLocation ? 'Update Pin' : 'Pin Location'}
          </button>
        </div>

        {savedLocation && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-green-800">Pinned Location</h3>
                <div className="mt-1 text-sm">
                  {savedLocation.landmark && (
                    <p className="text-green-700 font-medium">{savedLocation.landmark}</p>
                  )}
                  <p className="text-green-600">{savedLocation.address}</p>
                  <p className="text-green-500">
                    {savedLocation.lat.toFixed(6)}, {savedLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-green-600 italic">
                Click on map to select new location
              </p>
            </div>
          </div>
        )}

        <div className="w-full h-px bg-gray-200 my-4" />

        {landmarks.length > 0 && (
          <div>
            <span className="font-medium block mb-2">Nearby Landmarks:</span>
            <ul className="list-disc pl-5 space-y-1">
              {landmarks.map((landmark, index) => (
                <li key={index} className="text-gray-600">{landmark.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 