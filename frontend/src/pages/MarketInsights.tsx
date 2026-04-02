import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, MapPin, ShoppingCart, DollarSign, Activity } from 'lucide-react';

interface MarketData {
  totalProducts: number;
  averagePrice: number;
  priceChange: number;
  topGainers: Array<{ name: string; change: number; price: number }>;
  topLosers: Array<{ name: string; change: number; price: number }>;
  regionalData: Array<{ region: string; avgPrice: number; trend: string }>;
}

const MarketInsights: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    totalProducts: 0,
    averagePrice: 0,
    priceChange: 0,
    topGainers: [],
    topLosers: [],
    regionalData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching market insights
    setTimeout(() => {
      setMarketData({
        totalProducts: 1247,
        averagePrice: 15420,
        priceChange: 3.2,
        topGainers: [
          { name: 'Rice 5kg', change: 8.5, price: 13200 },
          { name: 'Cooking Oil 1L', change: 6.2, price: 9200 },
          { name: 'Sugar 2kg', change: 4.8, price: 7100 }
        ],
        topLosers: [
          { name: 'Maize Flour 2kg', change: -3.2, price: 4600 },
          { name: 'Salt 1kg', change: -1.8, price: 2400 },
          { name: 'Beans 1kg', change: -0.5, price: 5800 }
        ],
        regionalData: [
          { region: 'Dar es Salaam', avgPrice: 15200, trend: 'up' },
          { region: 'Dodoma', avgPrice: 16800, trend: 'up' },
          { region: 'Mwanza', avgPrice: 17100, trend: 'down' },
          { region: 'Arusha', avgPrice: 14500, trend: 'stable' }
        ]
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-tanzania-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading Market Insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Market Insights
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Real-time analysis of Tanzanian e-commerce market trends and price movements
        </p>
      </motion.div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-tanzania-green/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-tanzania-green" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              marketData.priceChange > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {marketData.priceChange > 0 ? '+' : ''}{marketData.priceChange}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{marketData.totalProducts.toLocaleString()}</h3>
          <p className="text-gray-300">Total Products</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-tanzania-blue/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-tanzania-blue" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">TZS {marketData.averagePrice.toLocaleString()}</h3>
          <p className="text-gray-300">Average Price</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
              Live
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
          <p className="text-gray-300">Real-time Tracking</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
              4 Regions
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Nationwide</h3>
          <p className="text-gray-300">Market Coverage</p>
        </motion.div>
      </div>

      {/* Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Top Gainers</h2>
          </div>
          <div className="space-y-4">
            {marketData.topGainers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">{item.name}</h4>
                  <p className="text-gray-400 text-sm">TZS {item.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-green-400 font-semibold">+{item.change}%</span>
                  <TrendingUp className="w-4 h-4 text-green-400 ml-1 inline" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
        >
          <div className="flex items-center mb-6">
            <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Top Losers</h2>
          </div>
          <div className="space-y-4">
            {marketData.topLosers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">{item.name}</h4>
                  <p className="text-gray-400 text-sm">TZS {item.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-red-400 font-semibold">{item.change}%</span>
                  <TrendingDown className="w-4 h-4 text-red-400 ml-1 inline" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Regional Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
      >
        <div className="flex items-center mb-6">
          <MapPin className="w-5 h-5 text-tanzania-blue mr-2" />
          <h2 className="text-xl font-semibold text-white">Regional Price Analysis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.regionalData.map((region, index) => (
            <div key={index} className="p-4 bg-glass-white/50 rounded-xl">
              <h3 className="text-white font-medium mb-2">{region.region}</h3>
              <p className="text-2xl font-bold text-white mb-2">TZS {region.avgPrice.toLocaleString()}</p>
              <div className="flex items-center">
                {region.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400 mr-1" />}
                {region.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400 mr-1" />}
                {region.trend === 'stable' && <Activity className="w-4 h-4 text-yellow-400 mr-1" />}
                <span className={`text-sm capitalize ${
                  region.trend === 'up' ? 'text-green-400' : 
                  region.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {region.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
      >
        <div className="flex items-center mb-6">
          <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
          <h2 className="text-xl font-semibold text-white">Market Alerts</h2>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
              <div>
                <h4 className="text-white font-medium">Price Surge Alert</h4>
                <p className="text-gray-300 text-sm">Rice prices increased by 8.5% in Dar es Salaam</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <h4 className="text-white font-medium">New Platform Integration</h4>
                <p className="text-gray-300 text-sm">Azam Pay data now available in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketInsights;
