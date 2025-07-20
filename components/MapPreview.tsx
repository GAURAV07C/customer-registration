import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapPreviewProps {
    latitude: number;
    longitude: number;
}

const MapPreview: React.FC<MapPreviewProps> = ({ latitude, longitude }) => {
    const apiKey = "";
    const mapUrl = apiKey
        ? `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=15`
        : null;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Location Preview
                </h3>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open in Maps
                </a>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="bg-white p-3 rounded border">
                    <span className="text-gray-600">Latitude:</span>
                    <div className="font-mono font-semibold">{latitude.toFixed(6)}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                    <span className="text-gray-600">Longitude:</span>
                    <div className="font-mono font-semibold">{longitude.toFixed(6)}</div>
                </div>
            </div>

            {/* Google Maps embed or placeholder */}
            {mapUrl ? (
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="256"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                />
            ) : (
                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Map Preview</p>
                        <p className="text-xs">{latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
                        <p className="text-xs mt-2 text-gray-500">Add VITE_GOOGLE_MAPS_API_KEY to .env for live map</p>
                    </div>
                </div>
            )}

            {!apiKey && (
                <p className="text-xs text-gray-500 mt-2">
                    * Add your Google Maps API key to .env file as VITE_GOOGLE_MAPS_API_KEY to enable live map preview
                </p>
            )}
        </div>
    );
};

export default MapPreview;