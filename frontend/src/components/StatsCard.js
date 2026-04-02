import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, change, changeType }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500',
    };
    return colors[color] || 'bg-gray-500';
  };

  const getChangeColor = (change) => {
    if (change === null || change === 0) return 'text-gray-500';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    if (change === null || change === 0) return Minus;
    return change > 0 ? TrendingUp : TrendingDown;
  };

  const ChangeIcon = getChangeIcon(change);

  return (
    <div className="tanzania-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          
          {change !== null && (
            <div className={`flex items-center mt-2 ${getChangeColor(change)}`}>
              <ChangeIcon className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                {Math.abs(change).toFixed(1)}{changeType === 'percentage' ? '%' : ''}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${getColorClasses(color)} bg-opacity-10`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
