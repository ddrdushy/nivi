import React from 'react';

type StatCardProps = {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
  };
  icon?: string;
};

export default function StatCard({ label, value, trend, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
        </div>
        {icon && <span style={{ fontSize: '24px' }}>{icon}</span>}
      </div>
      {trend && (
        <div className={`stat-trend ${trend.isUp ? 'trend-up' : 'trend-down'}`}>
          <span>{trend.isUp ? '↗' : '↘'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>vs last month</span>
        </div>
      )}
    </div>
  );
}
