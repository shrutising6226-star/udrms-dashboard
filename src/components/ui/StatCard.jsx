import React from 'react';

export const StatCard = ({ icon: Icon, label, value, change, trend = 'up' }) => {
  const isPositive = trend === 'up';

  return (
    <div className="bg-surface rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-border flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="text-text-secondary text-sm uppercase tracking-wide font-medium">
          {label}
        </div>
        <div className="p-2 bg-primary-light rounded-lg">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-text-primary">
          {value}
        </div>
        {change && (
          <div className={`text-sm font-medium flex items-center ${isPositive ? 'text-primary' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );
};
