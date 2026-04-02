import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Dashboard from './pages/Dashboard';
import PricePrediction from './pages/PricePrediction';
import PriceComparison from './pages/PriceComparison';
import Analytics from './pages/Analytics';
import MarketInsights from './pages/MarketInsights';
import RealTimeTracking from './pages/RealTimeTracking';
import BusinessIntelligence from './pages/BusinessIntelligence';
import './App.css';

interface AppState {
  loading: boolean;
  apiStatus: 'healthy' | 'unhealthy' | 'checking';
  currentPage: string;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loading: true,
    apiStatus: 'checking',
    currentPage: 'dashboard'
  });

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch('/health');
        if (response.ok) {
          setState(prev => ({ ...prev, apiStatus: 'healthy' }));
        } else {
          setState(prev => ({ ...prev, apiStatus: 'unhealthy' }));
        }
      } catch (error) {
        setState(prev => ({ ...prev, apiStatus: 'unhealthy' }));
      } finally {
        setTimeout(() => {
          setState(prev => ({ ...prev, loading: false }));
        }, 2000);
      }
    };

    checkApiHealth();
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tanzania-green via-tanzania-blue to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-white border-t-transparent rounded-full mx-auto mb-8"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Tanzania Price Intelligence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white text-lg"
          >
            Loading AI-powered e-commerce insights...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with parallax effect */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-tanzania-green/20 via-tanzania-blue/20 to-black/40" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <Navbar apiStatus={state.apiStatus} />
          
          <AnimatePresence mode="wait">
            <main className="container mx-auto px-4 py-8">
              {state.apiStatus === 'unhealthy' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-100 px-6 py-4 rounded-2xl shadow-glass">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse" />
                      <strong className="font-semibold">Warning:</strong>
                      <span className="ml-2">Backend API is not responding. Some features may not work properly.</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/predict" element={<PricePrediction />} />
                <Route path="/compare" element={<PriceComparison />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/insights" element={<MarketInsights />} />
                <Route path="/realtime" element={<RealTimeTracking />} />
                <Route path="/business" element={<BusinessIntelligence />} />
              </Routes>
            </main>
          </AnimatePresence>

          {/* Footer */}
          <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-20">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">TZ Price Intelligence</h3>
                  <p className="text-gray-300">
                    Enterprise AI-powered price tracking and prediction for Tanzanian e-commerce markets
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Platforms</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>Jumia Tanzania</li>
                    <li>ZoomTanzania</li>
                    <li>Azam Pay</li>
                    <li>Mo Kwanza</li>
                    <li>Asas Digital</li>
                    <li>JamboMart</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>Real-time Price Tracking</li>
                    <li>AI Predictions</li>
                    <li>Market Analytics</li>
                    <li>Business Intelligence</li>
                    <li>API Integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>📧 info@tzpriceintel.com</li>
                    <li>📱 +255 712 345 678</li>
                    <li>📍 Dar es Salaam, Tanzania</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
                <p>© 2026 Tanzania Price Intelligence. Built with ❤️ for Tanzanian e-commerce ecosystem</p>
              </div>
            </div>
          </footer>
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;
