import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PricePrediction from './pages/PricePrediction';
import PriceComparison from './pages/PriceComparison';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    // Check API health on app load
    const checkApiHealth = async () => {
      try {
        const response = await fetch('/health');
        if (response.ok) {
          setApiStatus('healthy');
        } else {
          setApiStatus('unhealthy');
        }
      } catch (error) {
        setApiStatus('unhealthy');
      } finally {
        setLoading(false);
      }
    };

    checkApiHealth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tanzania-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Tanzania Price Intelligence System...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar apiStatus={apiStatus} />
        <main className="container mx-auto px-4 py-8">
          {apiStatus === 'unhealthy' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong className="font-bold">Warning:</strong>
              <span className="block sm:inline"> Backend API is not responding. Some features may not work properly.</span>
            </div>
          )}
          
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<PricePrediction />} />
            <Route path="/compare" element={<PriceComparison />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-lg font-semibold mb-2">Tanzania E-commerce Price Intelligence System</h3>
            <p className="text-gray-400">AI-powered price tracking and prediction for Tanzanian markets</p>
            <div className="mt-4 text-sm text-gray-500">
              © 2026 Tanzania Price Intelligence. Built with ❤️ for Tanzanian e-commerce
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
