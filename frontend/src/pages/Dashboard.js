import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, MapPin, ShoppingCart, Activity } from 'lucide-react';
import PriceChart from '../components/PriceChart';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    averagePrice: 0,
    priceChange: 0,
    platformsCount: 0
  });
  const [recentPrices, setRecentPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Fetch recent prices
        const pricesResponse = await fetch('/prices?limit=10');
        const pricesData = await pricesResponse.json();
        
        if (pricesData.prices) {
          setRecentPrices(pricesData.prices);
          
          // Calculate stats
          const uniqueProducts = [...new Set(pricesData.prices.map(p => p.product_name))].length;
          const avgPrice = pricesData.prices.reduce((sum, p) => sum + p.price, 0) / pricesData.prices.length;
          const platforms = [...new Set(pricesData.prices.map(p => p.platform))].length;
          
          // Calculate price change (mock data for now)
          const priceChange = Math.random() * 10 - 5; // Random between -5 and 5
          
          setStats({
            totalProducts: uniqueProducts,
            averagePrice: Math.round(avgPrice),
            priceChange: priceChange,
            platformsCount: platforms
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tanzania-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Tanzania E-commerce Price Intelligence Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
          change={null}
        />
        
        <StatsCard
          title="Average Price"
          value={`TZS ${stats.averagePrice.toLocaleString()}`}
          icon={ShoppingCart}
          color="green"
          change={stats.priceChange}
          changeType="percentage"
        />
        
        <StatsCard
          title="Price Trend"
          value={stats.priceChange >= 0 ? 'Up' : 'Down'}
          icon={stats.priceChange >= 0 ? TrendingUp : TrendingDown}
          color={stats.priceChange >= 0 ? 'green' : 'red'}
          change={Math.abs(stats.priceChange)}
          changeType="percentage"
        />
        
        <StatsCard
          title="Platforms"
          value={stats.platformsCount}
          icon={MapPin}
          color="purple"
          change={null}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Trends Chart */}
        <div className="chart-container">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Price Trends</h2>
          <PriceChart 
            data={recentPrices} 
            type="line"
            dataKey="price"
            xAxisKey="date"
          />
        </div>

        {/* Platform Comparison */}
        <div className="chart-container">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Platform Price Comparison</h2>
          <PriceChart 
            data={recentPrices} 
            type="bar"
            dataKey="price"
            xAxisKey="platform"
          />
        </div>
      </div>

      {/* Recent Prices Table */}
      <div className="chart-container">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Price Updates</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPrices.slice(0, 5).map((price, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {price.product_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    TZS {price.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {price.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {price.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(price.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
