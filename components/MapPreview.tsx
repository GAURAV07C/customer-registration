import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapPreviewProps {
    latitude: number;
    longitude: number;
}


const MapPreview: React.FC<MapPreviewProps> = ({ latitude, longitude }) => {
    const apiKey = process.env.MAP_API ?? 'AIzaSyBKr0IAuR83tMcwL76B2Zw9yslPJYs0q9U';
    const mapUrl =  `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=15`
        ;
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
            

        
        </div>
    );
};

export default MapPreview;
