import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, TrendingDown, Activity, DollarSign, Package, Search, Layers, Navigation, ZoomIn, ZoomOut } from 'lucide-react';

interface LocationData {
  name: string;
  lat: number;
  lng: number;
  avgPrice: number;
  productCount: number;
  trend: 'up' | 'down' | 'stable';
  topProducts: Array<{ name: string; price: number; platform: string }>;
  coordinates: { x: number; y: number };
}

interface TanzaniaMapProps {
  selectedProduct?: string;
  selectedCategory?: string;
  onLocationClick?: (location: LocationData) => void;
}

const TanzaniaMap: React.FC<TanzaniaMapProps> = ({ 
  selectedProduct, 
  selectedCategory, 
  onLocationClick 
}) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [zoom, setZoom] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Enhanced Tanzania regions with accurate coordinates and more realistic data
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
      ],
      coordinates: { x: 65, y: 75 }
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
      ],
      coordinates: { x: 45, y: 55 }
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
      ],
      coordinates: { x: 25, y: 25 }
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
      ],
      coordinates: { x: 55, y: 35 }
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
      ],
      coordinates: { x: 50, y: 80 }
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
      ],
      coordinates: { x: 75, y: 60 }
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
      ],
      coordinates: { x: 60, y: 65 }
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
      ],
      coordinates: { x: 58, y: 30 }
    },
    {
      name: 'Shinyanga',
      lat: -3.6632,
      lng: 33.4231,
      avgPrice: 13500,
      productCount: 298,
      trend: 'stable',
      topProducts: [
        { name: 'Furniture Sofa', price: 180000, platform: 'Jumia' },
        { name: 'Kitchen Set', price: 95000, platform: 'Mo Kwanza' }
      ],
      coordinates: { x: 30, y: 35 }
    },
    {
      name: 'Tabora',
      lat: -5.0259,
      lng: 32.7275,
      avgPrice: 14100,
      productCount: 234,
      trend: 'up',
      topProducts: [
        { name: 'Bed Frame', price: 75000, platform: 'Asas Digital' },
        { name: 'Office Chair', price: 55000, platform: 'JamboMart' }
      ],
      coordinates: { x: 35, y: 50 }
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
      ],
      coordinates: { x: 70, y: 85 }
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
      ],
      coordinates: { x: 52, y: 72 }
    }
  ];

  useEffect(() => {
    // Simulate fetching location data
    setTimeout(() => {
      setLocations(tanzaniaRegions);
      setLoading(false);
    }, 1000);
  }, [selectedProduct, selectedCategory]);

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

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'bg-green-500/20 border-green-500/40 shadow-green-500/50';
      case 'down':
        return 'bg-red-500/20 border-red-500/40 shadow-red-500/50';
      default:
        return 'bg-yellow-500/20 border-yellow-500/40 shadow-yellow-500/50';
    }
  };

  const getPriceColor = (price: number) => {
    if (price > 16000) return 'text-red-500';
    if (price > 14000) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getMapBackground = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #2d3748 100%)';
      case 'terrain':
        return 'linear-gradient(135deg, #8b7355 0%, #a0826d 50%, #8b7355 100%)';
      default:
        return 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)';
    }
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
            <p className="text-white text-lg">Loading Tanzania Map...</p>
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
          Tanzania Price Map
        </h2>
        <div className="flex items-center space-x-4">
          {/* Map Style Selector */}
          <div className="flex bg-white/10 backdrop-blur-md rounded-lg p-1">
            {(['roadmap', 'satellite', 'terrain'] as const).map((style) => (
              <button
                key={style}
                onClick={() => setMapStyle(style)}
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
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-tanzania-green transition-all"
            />
          </div>
        </motion.div>
      )}

      {/* Google Maps Style Container */}
      <div className="glass-card p-0 relative overflow-hidden rounded-2xl">
        {/* Map Container */}
        <div 
          className="relative w-full h-[500px] overflow-hidden"
          style={{ background: getMapBackground() }}
        >
          {/* Google Maps Style Grid */}
          {mapStyle === 'roadmap' && (
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}

          {/* Tanzania Border (Enhanced) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
            <defs>
              <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00a651" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0066cc" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Enhanced Tanzania border with more accurate shape */}
            <path
              d="M 150 180 Q 200 140, 280 160 T 420 170 Q 520 180, 580 220 T 620 320 Q 650 380, 620 420 T 580 480 Q 520 520, 420 510 T 280 500 Q 200 480, 160 420 T 140 320 Q 130 250, 150 180"
              fill="none"
              stroke="url(#borderGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner border for depth */}
            <path
              d="M 150 180 Q 200 140, 280 160 T 420 170 Q 520 180, 580 220 T 620 320 Q 650 380, 620 420 T 580 480 Q 520 520, 420 510 T 280 500 Q 200 480, 160 420 T 140 320 Q 130 250, 150 180"
              fill="rgba(0, 166, 81, 0.05)"
              stroke="rgba(0, 102, 204, 0.2)"
              strokeWidth="1"
            />
          </svg>

          {/* Location Markers (Google Maps Style) */}
          {filteredLocations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${location.coordinates.x}%`,
                top: `${location.coordinates.y}%`
              }}
            >
              {/* Google Maps Style Shadow */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/20 rounded-full blur-sm" />
              
              {/* Main Marker */}
              <button
                onClick={() => {
                  setSelectedLocation(location);
                  onLocationClick?.(location);
                }}
                onMouseEnter={() => setHoveredLocation(location.name)}
                onMouseLeave={() => setHoveredLocation(null)}
                className={`relative group transition-all duration-300 transform hover:scale-110`}
              >
                {/* Google Maps Style Pin */}
                <div className={`relative ${getTrendColor(location.trend)} rounded-full p-1 shadow-lg`}>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${
                      location.trend === 'up' ? 'bg-green-500' : 
                      location.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                  {/* Pin point */}
                  <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                    location.trend === 'up' ? 'border-t-green-500' : 
                    location.trend === 'down' ? 'border-t-red-500' : 'border-t-yellow-500'
                  }`} />
                </div>
                
                {/* Google Maps Style Tooltip */}
                {hoveredLocation === location.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 whitespace-nowrap z-50 min-w-[200px]"
                  >
                    <div className="text-gray-800">
                      <p className="font-semibold text-sm mb-1">{location.name}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Avg Price:</span>
                        <span className={`font-bold ${getPriceColor(location.avgPrice)}`}>
                          TZS {location.avgPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-gray-600">Products:</span>
                        <span className="font-medium">{location.productCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-gray-600">Trend:</span>
                        <div className="flex items-center">
                          {getTrendIcon(location.trend)}
                          <span className="ml-1 capitalize">{location.trend}</span>
                        </div>
                      </div>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}

          {/* Google Maps Style Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            {/* Zoom Controls */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => setZoom(Math.min(zoom + 1, 10))}
                className="p-2 hover:bg-gray-100 transition-colors border-b"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setZoom(Math.max(zoom - 1, 1))}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Layers Button */}
            <button className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-100 transition-colors">
              <Layers className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Google Maps Style Scale */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="w-16 h-1 bg-gray-800" />
              <span>{20 * zoom} km</span>
            </div>
          </div>

          {/* Google Maps Style Attribution */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
            Tanzania Price Intelligence Pro
          </div>
        </div>
      </div>

      {/* Selected Location Details (Enhanced) */}
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

      {/* Regional Comparison (Enhanced) */}
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

export default TanzaniaMap;
