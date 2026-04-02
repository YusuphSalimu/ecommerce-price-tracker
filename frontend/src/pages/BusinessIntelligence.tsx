import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Briefcase, Award, PieChart } from 'lucide-react';

interface BusinessMetrics {
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  avgOrderValue: number;
  marketShare: number;
  customerSatisfaction: number;
}

const BusinessIntelligence: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    totalRevenue: 0,
    activeUsers: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    marketShare: 0,
    customerSatisfaction: 0
  });

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching business intelligence data
    setTimeout(() => {
      setMetrics({
        totalRevenue: 45800000,
        activeUsers: 12450,
        conversionRate: 3.8,
        avgOrderValue: 15420,
        marketShare: 28.5,
        customerSatisfaction: 4.6
      });
      setLoading(false);
    }, 1500);
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-tanzania-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading Business Intelligence...</p>
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
          Business Intelligence
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Comprehensive analytics and insights for data-driven business decisions
        </p>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="inline-flex bg-glass-white backdrop-blur-md border border-glass-border rounded-xl p-1">
          {['day', 'week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                selectedPeriod === period
                  ? 'bg-tanzania-green text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-tanzania-green/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-tanzania-green" />
            </div>
            <span className="text-green-400 text-sm font-medium">+18.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            TZS {(metrics.totalRevenue / 1000000).toFixed(1)}M
          </h3>
          <p className="text-gray-300">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-tanzania-blue/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-tanzania-blue" />
            </div>
            <span className="text-blue-400 text-sm font-medium">+24.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {metrics.activeUsers.toLocaleString()}
          </h3>
          <p className="text-gray-300">Active Users</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-yellow-400 text-sm font-medium">+2.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{metrics.conversionRate}%</h3>
          <p className="text-gray-300">Conversion Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-purple-400 text-sm font-medium">+8.7%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            TZS {metrics.avgOrderValue.toLocaleString()}
          </h3>
          <p className="text-gray-300">Avg Order Value</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-red-400 text-sm font-medium">+5.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{metrics.marketShare}%</h3>
          <p className="text-gray-300">Market Share</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl hover:shadow-glass transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-green-400 text-sm font-medium">+0.3</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{metrics.customerSatisfaction}/5</h3>
          <p className="text-gray-300">Customer Satisfaction</p>
        </motion.div>
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-tanzania-green mr-2" />
            <h2 className="text-xl font-semibold text-white">Revenue Breakdown</h2>
          </div>
          <div className="space-y-4">
            {[
              { category: 'Jumia', revenue: 18400000, percentage: 40.2, color: 'bg-blue-500' },
              { category: 'Azam Pay', revenue: 13740000, percentage: 30.0, color: 'bg-green-500' },
              { category: 'Mo Kwanza', revenue: 9160000, percentage: 20.0, color: 'bg-yellow-500' },
              { category: 'Others', revenue: 4580000, percentage: 9.8, color: 'bg-purple-500' }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{item.category}</span>
                  <span className="text-gray-300">
                    TZS {(item.revenue / 1000000).toFixed(1)}M ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
        >
          <div className="flex items-center mb-6">
            <TrendingUp className="w-5 h-5 text-tanzania-blue mr-2" />
            <h2 className="text-xl font-semibold text-white">Growth Metrics</h2>
          </div>
          <div className="space-y-4">
            {[
              { metric: 'User Growth', current: 12450, previous: 10020, change: 24.3 },
              { metric: 'Revenue Growth', current: 45800000, previous: 38600000, change: 18.5 },
              { metric: 'Order Volume', current: 2984, previous: 2456, change: 21.5 },
              { metric: 'Platform Adoption', current: 6, previous: 4, change: 50.0 }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-glass-white/50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{item.metric}</span>
                  <span className={`text-sm font-medium ${
                    item.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Previous: {item.previous.toLocaleString()}</span>
                  <span className="text-white">Current: {item.current.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Strategic Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="p-6 bg-glass-white backdrop-blur-md border border-glass-border rounded-2xl"
      >
        <div className="flex items-center mb-6">
          <Target className="w-5 h-5 text-yellow-400 mr-2" />
          <h2 className="text-xl font-semibold text-white">Strategic Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h3 className="text-green-400 font-semibold mb-2">🎯 Focus on High-Value Platforms</h3>
            <p className="text-gray-300 text-sm">
              Jumia and Azam Pay contribute 70% of revenue. Optimize integration and marketing efforts.
            </p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <h3 className="text-blue-400 font-semibold mb-2">📈 Expand User Base</h3>
            <p className="text-gray-300 text-sm">
              24% user growth shows strong market demand. Invest in user acquisition campaigns.
            </p>
          </div>
          <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
            <h3 className="text-yellow-400 font-semibold mb-2">⚡ Improve Conversion</h3>
            <p className="text-gray-300 text-sm">
              3.8% conversion rate can be improved with better UI/UX and personalized recommendations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BusinessIntelligence;
