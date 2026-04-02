import React, { useState } from 'react';
import { BarChart3, MapPin, ShoppingBag, ArrowRightLeft } from 'lucide-react';
import PriceChart from '../components/PriceChart';

const PriceComparison = () => {
  const [comparisonType, setComparisonType] = useState('platforms');
  const [formData, setFormData] = useState({
    product_name: '',
    location: '',
    platform: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0]
  });
  
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint;
      const params = new URLSearchParams();

      if (comparisonType === 'platforms') {
        endpoint = '/compare/platforms';
        params.append('product_name', formData.product_name);
        params.append('location', formData.location);
        params.append('quantity', formData.quantity);
        params.append('date', formData.date);
      } else {
        endpoint = '/compare/locations';
        params.append('product_name', formData.product_name);
        params.append('platform', formData.platform);
        params.append('quantity', formData.quantity);
        params.append('date', formData.date);
      }

      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error('Comparison failed');
      }

      const result = await response.json();
      setComparisonData(result);

    } catch (err) {
      setError('Failed to get comparison. Please try again.');
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBestDeal = () => {
    if (!comparisonData.length) return null;
    return comparisonData.reduce((min, current) => 
      current.predicted_price < min.predicted_price ? current : min
    );
  };

  const getWorstDeal = () => {
    if (!comparisonData.length) return null;
    return comparisonData.reduce((max, current) => 
      current.predicted_price > max.predicted_price ? current : max
    );
  };

  const bestDeal = getBestDeal();
  const worstDeal = getWorstDeal();

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Price Comparison</h1>
        <p className="text-gray-600 mt-2">Compare prices across platforms and locations in Tanzania</p>
      </div>

      {/* Comparison Type Selector */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setComparisonType('platforms')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            comparisonType === 'platforms'
              ? 'bg-tanzania-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <BarChart3 className="inline w-4 h-4 mr-2" />
          Compare Platforms
        </button>
        <button
          onClick={() => setComparisonType('locations')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            comparisonType === 'locations'
              ? 'bg-tanzania-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <MapPin className="inline w-4 h-4 mr-2" />
          Compare Locations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Form */}
        <div className="chart-container">
          <div className="flex items-center mb-4">
            <ArrowRightLeft className="w-5 h-5 text-tanzania-green mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              {comparisonType === 'platforms' ? 'Platform Comparison' : 'Location Comparison'}
            </h2>
          </div>
          
          <form onSubmit={handleCompare} className="space-y-4">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ShoppingBag className="inline w-4 h-4 mr-1" />
                Product
              </label>
              <select
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tanzania-green focus:border-transparent"
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>

            {/* Conditional Fields based on comparison type */}
            {comparisonType === 'platforms' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tanzania-green focus:border-transparent"
                  required
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tanzania-green focus:border-transparent"
                  required
                >
                  <option value="">Select a platform</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tanzania-green focus:border-transparent"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tanzania-green focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full tanzania-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Comparing...
                </span>
              ) : (
                'Compare Prices'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Comparison Results */}
        <div className="space-y-6">
          {/* Best Deal */}
          {bestDeal && (
            <div className="chart-container bg-green-50 border-2 border-green-200">
              <div className="text-center py-4">
                <p className="text-sm text-green-600 font-medium mb-2">🎉 Best Deal</p>
                <p className="text-2xl font-bold text-green-700">
                  TZS {bestDeal.predicted_price.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  {comparisonType === 'platforms' ? bestDeal.platform : bestDeal.location}
                </p>
              </div>
            </div>
          )}

          {/* Worst Deal */}
          {worstDeal && (
            <div className="chart-container bg-red-50 border-2 border-red-200">
              <div className="text-center py-4">
                <p className="text-sm text-red-600 font-medium mb-2">💸 Most Expensive</p>
                <p className="text-2xl font-bold text-red-700">
                  TZS {worstDeal.predicted_price.toLocaleString()}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  {comparisonType === 'platforms' ? worstDeal.platform : worstDeal.location}
                </p>
              </div>
            </div>
          )}

          {/* Savings */}
          {bestDeal && worstDeal && (
            <div className="chart-container bg-blue-50 border-2 border-blue-200">
              <div className="text-center py-4">
                <p className="text-sm text-blue-600 font-medium mb-2">💰 Potential Savings</p>
                <p className="text-2xl font-bold text-blue-700">
                  TZS {(worstDeal.predicted_price - bestDeal.predicted_price).toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  {((worstDeal.predicted_price - bestDeal.predicted_price) / worstDeal.predicted_price * 100).toFixed(1)}% cheaper
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Chart */}
      {comparisonData.length > 0 && (
        <div className="chart-container">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Price Comparison Chart
          </h2>
          <PriceChart 
            data={comparisonData} 
            type="bar"
            dataKey="predicted_price"
            xAxisKey={comparisonType === 'platforms' ? 'platform' : 'location'}
          />
        </div>
      )}
    </div>
  );
};

export default PriceComparison;
