import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, TrendingDown, Activity, Package, Search, Layers, Navigation, ZoomIn, ZoomOut } from 'lucide-react';

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  avgPrice: number;
  productCount: number;
  trend: 'up' | 'down' | 'stable';
  topProducts: Array<{ name: string; price: number; platform: string }>;
}

interface GoogleMapsIntegrationProps {
  selectedProduct?: string;
  selectedCategory?: string;
  onLocationClick?: (location: LocationData) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({ 
  selectedProduct, 
  selectedCategory, 
  onLocationClick 
}) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite' | 'terrain' | 'hybrid'>('roadmap');
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Tanzania regions with accurate coordinates
  const tanzaniaRegions: LocationData[] = [
    {
      name: 'Dar es Salaam',
      lat: -6.7924,
      lng: 39.2083,
      avgPrice: 15200,
      productCount: 1247,
      trend: 'up',
      topProducts: [
        { name: 'Rice 5kg', price: 13200, platform: 'Jumia' },
        { name: 'Smartphone', price: 450000, platform: 'Azam Pay' }
      ]
    },
    {
      name: 'Dodoma',
      lat: -6.1630,
      lng: 35.7516,
      avgPrice: 16800,
      productCount: 892,
      trend: 'up',
      topProducts: [
        { name: 'Cooking Oil 1L', price: 9200, platform: 'Mo Kwanza' },
        { name: 'Laptop', price: 1250000, platform: 'Jumia' }
      ]
    },
    {
      name: 'Mwanza',
      lat: -2.5164,
      lng: 32.9175,
      avgPrice: 17100,
      productCount: 734,
      trend: 'down',
      topProducts: [
        { name: 'Sugar 2kg', price: 7100, platform: 'JamboMart' },
        { name: 'TV 55 inch', price: 890000, platform: 'Azam Pay' }
      ]
    },
    {
      name: 'Arusha',
      lat: -3.3870,
      lng: 36.6830,
      avgPrice: 14500,
      productCount: 645,
      trend: 'stable',
      topProducts: [
        { name: 'Maize Flour 2kg', price: 4600, platform: 'Jumia' },
        { name: 'Headphones', price: 35000, platform: 'Mo Kwanza' }
      ]
    },
    {
      name: 'Mbeya',
      lat: -8.9145,
      lng: 33.4567,
      avgPrice: 13800,
      productCount: 523,
      trend: 'up',
      topProducts: [
        { name: 'Salt 1kg', price: 2400, platform: 'Asas Digital' },
        { name: 'Camera', price: 280000, platform: 'Jumia' }
      ]
    },
    {
      name: 'Tanga',
      lat: -5.0689,
      lng: 39.2988,
      avgPrice: 14200,
      productCount: 412,
      trend: 'stable',
      topProducts: [
        { name: 'Men\'s T-Shirt', price: 8500, platform: 'JamboMart' },
        { name: 'Shoes', price: 45000, platform: 'Azam Pay' }
      ]
    },
    {
      name: 'Morogoro',
      lat: -6.8240,
      lng: 37.6612,
      avgPrice: 14900,
      productCount: 389,
      trend: 'up',
      topProducts: [
        { name: 'Women\'s Dress', price: 12000, platform: 'Mo Kwanza' },
        { name: 'Bag', price: 28000, platform: 'Jumia' }
      ]
    },
    {
      name: 'Kilimanjaro',
      lat: -3.3617,
      lng: 37.3556,
      avgPrice: 15800,
      productCount: 367,
      trend: 'down',
      topProducts: [
        { name: 'Jewelry', price: 65000, platform: 'Azam Pay' },
        { name: 'Watch', price: 45000, platform: 'JamboMart' }
      ]
    },
    {
      name: 'Zanzibar',
      lat: -6.1659,
      lng: 39.2026,
      avgPrice: 16500,
      productCount: 189,
      trend: 'up',
      topProducts: [
        { name: 'Perfume', price: 85000, platform: 'Jumia' },
        { name: 'Makeup', price: 35000, platform: 'Azam Pay' }
      ]
    },
    {
      name: 'Iringa',
      lat: -7.4355,
      lng: 35.6920,
      avgPrice: 13600,
      productCount: 298,
      trend: 'stable',
      topProducts: [
        { name: 'Furniture', price: 95000, platform: 'Jumia' },
        { name: 'Kitchen Items', price: 28000, platform: 'Mo Kwanza' }
      ]
    }
  ];

  useEffect(() => {
    // Load Google Maps API
    loadGoogleMapsAPI();
    
    // Load location data
    setTimeout(() => {
      setLocations(tanzaniaRegions);
      setLoading(false);
    }, 1000);
  }, []);

  const loadGoogleMapsAPI = () => {
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap`;
    
    window.initMap = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapOptions = {
      center: { lat: -6.7924, lng: 35.7516 }, // Tanzania center
      zoom: 6,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [{ color: '#ffffff' }, { lightness: 17 }]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{ color: '#ffffff' }, { lightness: 18 }]
        },
        {
          featureType: 'road.local',
          elementType: 'geometry',
          stylers: [{ color: '#ffffff' }, { lightness: 16 }]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#dedede' }, { lightness: 21 }]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }]
        },
        {
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#f2f2f2' }, { lightness: 19 }]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.fill',
          stylers: [{ color: '#fefefe' }, { lightness: 20 }]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }]
        }
      ]
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Add markers for all locations
    addMarkers(newMap);
    
    // Initialize search box
    initializeSearchBox(newMap);
  };

  const addMarkers = (mapInstance: any) => {
    const newMarkers: any[] = [];

    locations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstance,
        title: location.name,
        icon: createCustomIcon(location.trend),
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(location)
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
        setSelectedLocation(location);
        onLocationClick?.(location);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  };

  const createCustomIcon = (trend: string) => {
    const colors = {
      up: '#10b981',
      down: '#ef4444',
      stable: '#f59e0b'
    };

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: colors[trend as keyof typeof colors],
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      anchor: new window.google.maps.Point(0, 0)
    };
  };

  const createInfoWindowContent = (location: LocationData) => {
    const trendIcon = {
      up: '📈',
      down: '📉',
      stable: '➡️'
    };

    return `
      <div style="padding: 12px; max-width: 250px; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px; font-weight: bold;">
          ${location.name}
        </h3>
        <div style="margin-bottom: 8px;">
          <span style="color: #666; font-size: 14px;">Average Price:</span>
          <span style="color: #333; font-weight: bold; font-size: 14px; margin-left: 8px;">
            TZS ${location.avgPrice.toLocaleString()}
          </span>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="color: #666; font-size: 14px;">Products:</span>
          <span style="color: #333; font-weight: bold; font-size: 14px; margin-left: 8px;">
            ${location.productCount.toLocaleString()}
          </span>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="color: #666; font-size: 14px;">Trend:</span>
          <span style="font-size: 14px; margin-left: 8px;">
            ${trendIcon[location.trend]} ${location.trend.charAt(0).toUpperCase() + location.trend.slice(1)}
          </span>
        </div>
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #eee;">
          <div style="color: #666; font-size: 12px; margin-bottom: 4px;">Top Products:</div>
          ${location.topProducts.map(product => `
            <div style="margin-bottom: 4px;">
              <div style="color: #333; font-size: 13px; font-weight: 500;">${product.name}</div>
              <div style="color: #666; font-size: 11px;">
                ${product.platform} • TZS ${product.price.toLocaleString()}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  const initializeSearchBox = (mapInstance: any) => {
    if (!searchInputRef.current || !window.google) return;

    const searchBox = new window.google.maps.places.SearchBox(searchInputRef.current);

    mapInstance.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchInputRef.current);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(10);
        }
      }
    });
  };

  const changeMapStyle = (style: string) => {
    if (!map || !window.google) return;

    const mapTypeIds = {
      roadmap: window.google.maps.MapTypeId.ROADMAP,
      satellite: window.google.maps.MapTypeId.SATELLITE,
      terrain: window.google.maps.MapTypeId.TERRAIN,
      hybrid: window.google.maps.MapTypeId.HYBRID
    };

    map.setMapTypeId(mapTypeIds[style as keyof typeof mapTypeIds]);
    setMapStyle(style as any);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPriceColor = (price: number) => {
    if (price > 16000) return 'text-red-500';
    if (price > 14000) return 'text-yellow-500';
    return 'text-green-500';
  };

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="glass-card p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-tanzania-green border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
            <p className="text-white text-lg">Loading Google Maps...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Google Maps Style Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-tanzania-green" />
          Google Maps Integration
        </h2>
        <div className="flex items-center space-x-4">
          {/* Map Style Selector */}
          <div className="flex bg-white/10 backdrop-blur-md rounded-lg p-1">
            {(['roadmap', 'satellite', 'terrain', 'hybrid'] as const).map((style) => (
              <button
                key={style}
                onClick={() => changeMapStyle(style)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  mapStyle === style 
                    ? 'bg-white text-gray-800' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-all"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Google Maps API Key Notice */}
      <div className="glass-card p-4 border-yellow-500/30 bg-yellow-500/10">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 pulse-animation" />
          <div>
            <p className="text-yellow-100 font-medium">Google Maps API Key Required</p>
            <p className="text-yellow-200 text-sm mt-1">
              To use actual Google Maps, replace 'YOUR_API_KEY' with your Google Maps JavaScript API key in the component.
            </p>
            <p className="text-yellow-200 text-xs mt-2">
              Get your API key from: <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a>
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-tanzania-green transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Google Maps Container */}
      <div className="glass-card p-0 relative overflow-hidden rounded-2xl">
        <div 
          ref={mapRef}
          className="w-full h-[500px] bg-gray-100"
          style={{ position: 'relative' }}
        >
          {/* Fallback message when Google Maps is not loaded */}
          {!window.google?.maps && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Google Maps Loading</h3>
                <p className="text-gray-600 mb-4">Please ensure you have a valid Google Maps API key</p>
                <div className="bg-gray-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-700 font-medium mb-2">To enable Google Maps:</p>
                  <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Get a Google Maps JavaScript API key</li>
                    <li>Replace 'YOUR_API_KEY' in the component</li>
                    <li>Enable Maps JavaScript API in Google Cloud Console</li>
                    <li>Refresh the page to load Google Maps</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-tanzania-green" />
              {selectedLocation.name}
            </h3>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Average Price:</span>
                <span className={`font-bold ${getPriceColor(selectedLocation.avgPrice)}`}>
                  TZS {selectedLocation.avgPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Products:</span>
                <span className="font-bold text-white">
                  {selectedLocation.productCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Trend:</span>
                <div className="flex items-center">
                  {getTrendIcon(selectedLocation.trend)}
                  <span className="ml-1 capitalize text-white">{selectedLocation.trend}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Coordinates:</span>
                <span className="text-xs text-gray-400">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Top Products */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Top Products
              </h4>
              <div className="space-y-3">
                {selectedLocation.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">TZS {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Regional Comparison */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Regional Price Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLocations.slice(0, 6).map((location, index) => (
            <div
              key={location.name}
              onClick={() => setSelectedLocation(location)}
              className="p-4 glass rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{location.name}</h4>
                {getTrendIcon(location.trend)}
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${getPriceColor(location.avgPrice)}`}>
                  TZS {location.avgPrice.toLocaleString()}
                </span>
                <span className="text-gray-400 text-sm">
                  {location.productCount} products
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsIntegration;
