import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PriceChart = ({ data, type = 'line', dataKey = 'price', xAxisKey = 'date' }) => {
  // Format data for charts
  const formatData = (rawData) => {
    if (!rawData) return [];
    
    return rawData.map(item => ({
      ...item,
      formattedDate: new Date(item[xAxisKey]).toLocaleDateString(),
      formattedPrice: item[dataKey]
    }));
  };

  const chartData = formatData(data);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Price: <span className="font-medium text-tanzania-green">
              TZS {payload[0].value.toLocaleString()}
            </span>
          </p>
          {payload[0].payload.platform && (
            <p className="text-sm text-gray-600">
              Platform: <span className="font-medium">{payload[0].payload.platform}</span>
            </p>
          )}
          {payload[0].payload.location && (
            <p className="text-sm text-gray-600">
              Location: <span className="font-medium">{payload[0].payload.location}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format Y-axis labels
  const formatYAxis = (value) => {
    return `TZS ${(value / 1000).toFixed(0)}K`;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="formattedPrice" 
              stroke="#00a651" 
              strokeWidth={2}
              dot={{ fill: '#00a651', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Price (TZS)"
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="formattedPrice" 
              fill="#0066cc" 
              name="Price (TZS)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
