import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, TrendingUp, Eye, RefreshCw } from 'lucide-react';

interface RealTimeData {
  timestamp: string;
  platform: string;
  product: string;
  price: number;
  change: number;
  location: string;
}

const RealTimeTracking: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate real-time data updates
    const generateRandomData = (): RealTimeData => {
      const platforms = ['Jumia', 'Azam Pay', 'Mo Kwanza', 'Asas Digital', 'JamboMart'];
      const products = ['Rice 5kg', 'Cooking Oil 1L', 'Sugar 2kg', 'Maize Flour 2kg', 'Salt 1kg'];
      const locations = ['Dar es Salaam', 'Dodoma', 'Mwanza', 'Arusha'];
      
      return {
        timestamp: new Date().toISOString(),
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        product: products[Math.floor(Math.random() * products.length)],
        price: Math.floor(Math.random() * 20000) + 5000,
        change: (Math.random() - 0.5) * 10,
        location: locations[Math.floor(Math.random() * locations.length)]
      };
    };

    // Initial data
    const initialData = Array.from({ length: 10 }, () => generateRandomData());
    setRealTimeData(initialData);

    // Real-time updates
    if (isTracking) {
      const interval = setInterval(() => {
        const newData = generateRandomData();
        setRealTimeData(prev => [newData, ...prev.slice(0, 19)]);
        setLastUpdate(new Date());
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTracking]);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Real-Time Price Tracking
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Live price monitoring across all Tanzanian e-commerce platforms
        </p>
      </motion.div>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-white font-medium">
                {isTracking ? 'Live Tracking' : 'Paused'}
              </span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Activity className="w-4 h-4 mr-2" />
              <span>{realTimeData.length} updates</span>
            </div>
          </div>
          
          <button
            onClick={toggleTracking}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center ${
              isTracking 
                ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' 
                : 'bg-tanzania-green/20 border border-tanzania-green/30 text-tanzania-green hover:bg-tanzania-green/30'
            }`}
          >
            {isTracking ? (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Pause Tracking
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Resume Tracking
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-tanzania-green/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-tanzania-green" />
            </div>
            <span className="text-green-400 text-sm font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">1,247</h3>
          <p className="text-gray-300">Active Products</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-tanzania-blue/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-tanzania-blue" />
            </div>
            <span className="text-blue-400 text-sm font-medium">2.3s</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Avg Response</h3>
          <p className="text-gray-300">Update Speed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-yellow-400 text-sm font-medium">24/7</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Monitoring</h3>
          <p className="text-gray-300">Coverage</p>
        </motion.div>
      </div>

      {/* Live Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-tanzania-green mr-2" />
            <h2 className="text-xl font-semibold text-white">Live Price Feed</h2>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Auto-refresh every 2s
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {realTimeData.map((item, index) => (
            <motion.div
              key={`${item.timestamp}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-glass-white/50 rounded-xl border border-glass-border hover:bg-glass-white/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="px-3 py-1 bg-tanzania-blue/20 text-tanzania-blue rounded-full text-sm font-medium">
                      {item.platform}
                    </span>
                    <span className="text-white font-medium">{item.product}</span>
                    <span className="text-gray-400 text-sm">{item.location}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-white">
                      TZS {item.price.toLocaleString()}
                    </span>
                    <span className={`text-sm font-medium ${
                      item.change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                  {index === 0 && (
                    <div className="flex items-center text-green-400 text-xs mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
                      LIVE
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Platform Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Platform Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Jumia', status: 'online', updates: 1247, lastUpdate: '2s ago' },
            { name: 'Azam Pay', status: 'online', updates: 892, lastUpdate: '3s ago' },
            { name: 'Mo Kwanza', status: 'online', updates: 634, lastUpdate: '1s ago' },
            { name: 'Asas Digital', status: 'online', updates: 445, lastUpdate: '4s ago' },
            { name: 'JamboMart', status: 'online', updates: 312, lastUpdate: '2s ago' },
            { name: 'ZoomTZ', status: 'maintenance', updates: 0, lastUpdate: '5m ago' }
          ].map((platform, index) => (
            <div key={platform.name} className="p-4 bg-glass-white/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">{platform.name}</h3>
                <div className={`w-2 h-2 rounded-full ${
                  platform.status === 'online' ? 'bg-green-500 animate-pulse' : 
                  platform.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className={`capitalize font-medium ${
                    platform.status === 'online' ? 'text-green-400' : 
                    platform.status === 'maintenance' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {platform.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Updates:</span>
                  <span className="text-white">{platform.updates}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last:</span>
                  <span className="text-white">{platform.lastUpdate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeTracking;
