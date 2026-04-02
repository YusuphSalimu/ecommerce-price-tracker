import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity, Filter } from 'lucide-react';
import PriceChart from '../components/PriceChart';

const Analytics = () => {
  const [trends, setTrends] = useState(null);
  const [filterData, setFilterData] = useState({
    product_name: '',
    location: '',
    platform: ''
  });
  const [loading, setLoading] = useState(true);

  const products = [
    'Rice 5kg',
    'Cooking Oil 1L', 
    'Sugar 2kg',
    'Maize Flour 2kg',
    'Salt 1kg'
  ];

  const locations = [
    'Dar es Salaam',
    'Dodoma',
    'Mwanza'
  ];

  const platforms = [
    'Jumia',
    'ZoomTanzania'
  ];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      if (filterData.product_name) params.append('product_name', filterData.product_name);
      if (filterData.location) params.append('location', filterData.location);
      if (filterData.platform) params.append('platform', filterData.platform);

      const response = await fetch(`/analytics/trends?${params}`);
      const data = await response.json();
      setTrends(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setLoading(true);
    fetchAnalytics();
  };

  const clearFilters = () => {
    setFilterData({
      product_name: '',
      location: '',
      platform: ''
    });
    setLoading(true);
    setTimeout(fetchAnalytics, 100);
  };

  const formatTrendData = (trendsObject) => {
    if (!trendsObject) return [];
    
    const data = [];
    
    // Convert different trend objects to chart format
    if (trendsObject.by_location) {
      Object.entries(trendsObject.by_location).forEach(([location, price]) => {
        data.push({ name: location, value: price, category: 'Location' });
      });
    }
    
    if (trendsObject.by_platform) {
      Object.entries(trendsObject.by_platform).forEach(([platform, price]) => {
        data.push({ name: platform, value: price, category: 'Platform' });
      });
    }
    
    if (trendsObject.by_category) {
      Object.entries(trendsObject.by_category).forEach(([category, price]) => {
        data.push({ name: category, value: price, category: 'Category' });
      });
    }
    
    return data;
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Trends</h1>
        <p className="text-gray-600 mt-2">Comprehensive price analysis and market insights for Tanzania</p>
      </div>

      {/* Filters */}
      <div className="chart-container">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-tanzania-green mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>
            <select
              name="product_name"
              value={filterData.product_name}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tanzania-green focus:border-transparent"
            >
              <option value="">All Products</option>
              {products.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              name="location"
              value={filterData.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tanzania-green focus:border-transparent"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              name="platform"
              value={filterData.platform}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tanzania-green focus:border-transparent"
            >
              <option value="">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            onClick={applyFilters}
            className="tanzania-button"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {trends && (
        <>
          {/* Overall Trends */}
          {trends.trends?.overall && (
            <div className="chart-container">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-tanzania-green mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Overall Market Trends</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Start Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    TZS {trends.trends.overall.start_price.toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">End Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    TZS {trends.trends.overall.end_price.toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Price Change</p>
                  <p className={`text-lg font-bold ${trends.trends.overall.price_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trends.trends.overall.price_change >= 0 ? '+' : ''}
                    TZS {trends.trends.overall.price_change.toLocaleString()}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Percentage Change</p>
                  <p className={`text-lg font-bold ${trends.trends.overall.price_change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trends.trends.overall.price_change_percent >= 0 ? '+' : ''}
                    {trends.trends.overall.price_change_percent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Comparison */}
            {trends.trends?.by_location && (
              <div className="chart-container">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-5 h-5 text-tanzania-blue mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Average Prices by Location</h2>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(trends.trends.by_location).map(([location, price]) => (
                    <div key={location} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{location}</span>
                      <span className="font-bold text-tanzania-blue">
                        TZS {price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Platform Comparison */}
            {trends.trends?.by_platform && (
              <div className="chart-container">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-tanzania-green mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Average Prices by Platform</h2>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(trends.trends.by_platform).map(([platform, price]) => (
                    <div key={platform} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{platform}</span>
                      <span className="font-bold text-tanzania-green">
                        TZS {price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Comparison */}
          {trends.trends?.by_category && (
            <div className="chart-container">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 text-tanzania-yellow mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Average Prices by Category</h2>
              </div>
              
              <PriceChart 
                data={Object.entries(trends.trends.by_category).map(([category, price]) => ({
                  name: category,
                  value: price,
                  category: 'Category'
                }))} 
                type="bar"
                dataKey="value"
                xAxisKey="name"
              />
            </div>
          )}

          {/* Data Summary */}
          <div className="chart-container">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Data Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 mb-2">Data Points Analyzed</p>
                <p className="text-2xl font-bold text-blue-700">
                  {trends.data_points?.toLocaleString() || 0}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 mb-2">Analysis Period</p>
                <p className="text-lg font-bold text-green-700">
                  {trends.date_range?.start && trends.date_range?.end ? 
                    `${new Date(trends.date_range.start).toLocaleDateString()} - ${new Date(trends.date_range.end).toLocaleDateString()}` : 
                    'N/A'
                  }
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 mb-2">Market Status</p>
                <p className="text-lg font-bold text-purple-700">
                  {trends.trends?.overall?.price_change_percent >= 0 ? '📈 Rising' : '📉 Falling'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {!trends && (
        <div className="chart-container">
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No analytics data available</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or check back later</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
