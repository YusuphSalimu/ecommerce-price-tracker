import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Search, BarChart3 } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-tanzania-green/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-tanzania-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-glass-white backdrop-blur-md border border-glass-border rounded-full mb-8">
            <span className="w-2 h-2 bg-tanzania-green rounded-full mr-2 animate-pulse" />
            <span className="text-white text-sm font-medium">🇹🇿 #1 AI-Powered E-commerce Intelligence Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Tanzania's
            <span className="block text-tanzania-green">Smart Price</span>
            Intelligence
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Real-time AI predictions for Tanzanian e-commerce platforms. 
            Track prices across Jumia, Azam, Mo, Asas, Jambo and more - 
            all in one powerful business intelligence platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-tanzania-green hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-glow"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-glass-white backdrop-blur-md border border-glass-border text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/20"
            >
              View Demo
            </motion.button>
          </div>

          {/* Platform logos */}
          <div className="mb-16">
            <p className="text-gray-300 mb-6 text-sm uppercase tracking-wider">Integrated Platforms</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {['Jumia', 'Azam Pay', 'Mo Kwanza', 'Asas Digital', 'JamboMart', 'ZoomTZ'].map((platform, index) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="px-6 py-3 bg-glass-white backdrop-blur-md border border-glass-border rounded-lg"
                >
                  <span className="text-white font-medium">{platform}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="p-8 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300">
            <div className="w-16 h-16 bg-tanzania-green/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <TrendingUp className="w-8 h-8 text-tanzania-green" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AI Predictions</h3>
            <p className="text-gray-300">
              Advanced machine learning algorithms predict price trends with 95% accuracy
            </p>
          </div>

          <div className="p-8 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300">
            <div className="w-16 h-16 bg-tanzania-blue/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Search className="w-8 h-8 text-tanzania-blue" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Real-time Tracking</h3>
            <p className="text-gray-300">
              Monitor prices across all major Tanzanian e-commerce platforms in real-time
            </p>
          </div>

          <div className="p-8 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <BarChart3 className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Business Analytics</h3>
            <p className="text-gray-300">
              Comprehensive insights and analytics for data-driven business decisions
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
