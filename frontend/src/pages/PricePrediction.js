import React, { useState } from 'react';
import { TrendingUp, Calendar, MapPin, ShoppingBag, Calculator } from 'lucide-react';

const PricePrediction = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    location: '',
    platform: '',
    quantity: 1,
    date: new Date().toISOString().split('T')[0]
  });
  
  const [prediction, setPrediction] = useState(null);
  const [futurePredictions, setFuturePredictions] = useState([]);
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

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);

      // Also fetch future predictions
      const futureResponse = await fetch(
        `/predict/future?product_name=${encodeURIComponent(formData.product_name)}&location=${encodeURIComponent(formData.location)}&platform=${encodeURIComponent(formData.platform)}&quantity=${formData.quantity}&days_ahead=7`
      );

      if (futureResponse.ok) {
        const futureData = await futureResponse.json();
        setFuturePredictions(futureData.predictions || []);
      }

    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Price Prediction</h1>
        <p className="text-gray-600 mt-2">Predict future prices for products across Tanzanian e-commerce platforms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction Form */}
        <div className="chart-container">
          <div className="flex items-center mb-4">
            <Calculator className="w-5 h-5 text-tanzania-green mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Get Price Prediction</h2>
          </div>
          
          <form onSubmit={handlePredict} className="space-y-4">
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

            {/* Location Selection */}
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

            {/* Platform Selection */}
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
                <Calendar className="inline w-4 h-4 mr-1" />
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
                  Predicting...
                </span>
              ) : (
                'Predict Price'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Prediction Results */}
        <div className="space-y-6">
          {/* Current Prediction */}
          {prediction && (
            <div className="chart-container">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-tanzania-green mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Prediction Result</h2>
              </div>
              
              <div className="text-center py-6">
                <p className="text-sm text-gray-600 mb-2">Predicted Price</p>
                <p className="text-4xl font-bold text-tanzania-green">
                  TZS {prediction.predicted_price.toLocaleString()}
                </p>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Product:</strong> {prediction.product_name}</p>
                  <p><strong>Location:</strong> {prediction.location}</p>
                  <p><strong>Platform:</strong> {prediction.platform}</p>
                  <p><strong>Date:</strong> {new Date(prediction.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Future Predictions */}
          {futurePredictions.length > 0 && (
            <div className="chart-container">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-tanzania-blue mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">7-Day Forecast</h2>
              </div>
              
              <div className="space-y-3">
                {futurePredictions.map((pred, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      {new Date(pred.date).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-gray-900">
                      TZS {pred.predicted_price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;
