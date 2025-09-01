"use client";

import { useState, useEffect } from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
  percentage?: number;
  color?: string;
}

interface BarChartProps {
  data: ChartDataPoint[];
  title: string;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'multi';
}

interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
    secondary?: number;
  }>;
  title: string;
  height?: number;
  showGrid?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

interface PieChartProps {
  data: ChartDataPoint[];
  title: string;
  showLegend?: boolean;
  size?: number;
}

// Color schemes
const colorSchemes = {
  blue: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A'],
  green: ['#10B981', '#059669', '#047857', '#065F46'],
  purple: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'],
  orange: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
  multi: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']
};

export function BarChart({ 
  data, 
  title, 
  height = 300, 
  showGrid = true, 
  showLabels = true,
  colorScheme = 'blue' 
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value)) || 1;
  const colors = colorSchemes[colorScheme];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      
      <div className="relative" style={{ height: `${height}px` }}>
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200/50 first:border-t-0"></div>
            ))}
          </div>
        )}
        
        <div className="absolute inset-0 flex items-end justify-around px-4">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (height - 60);
            const color = item.color || colors[index % colors.length];
            
            return (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div className="relative mb-2 min-w-[40px]">
                  {/* Hover tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {item.value.toLocaleString()}
                    {item.percentage && ` (${item.percentage}%)`}
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full rounded-t-lg transition-all duration-500 hover:scale-105 shadow-lg"
                    style={{ 
                      height: `${barHeight}px`, 
                      backgroundColor: color,
                      boxShadow: `0 4px 20px ${color}40`
                    }}
                  ></div>
                </div>
                
                {showLabels && (
                  <span className="text-xs font-medium text-gray-600 text-center max-w-[60px] truncate">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 font-medium">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="transform -translate-y-1/2">
              {((maxValue / 4) * (4 - i)).toFixed(0)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LineChart({ 
  data, 
  title, 
  height = 300, 
  showGrid = true,
  primaryLabel = 'Primary',
  secondaryLabel = 'Secondary',
  colorScheme = 'blue'
}: LineChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.secondary || 0))) || 1;
  const colors = colorSchemes[colorScheme];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[0] }}></div>
            <span className="font-medium text-gray-600">{primaryLabel}</span>
          </div>
          {data.some(d => d.secondary !== undefined) && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[1] }}></div>
              <span className="font-medium text-gray-600">{secondaryLabel}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200/50 first:border-t-0"></div>
            ))}
          </div>
        )}
        
        {/* Primary line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`gradient-${title}-primary`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colors[0]} stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id={`gradient-${title}-secondary`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors[1]} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colors[1]} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Primary area fill */}
          <path
            d={`M 0 ${height} ${data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = height - (item.value / maxValue) * (height - 40);
              return `L ${x}% ${y}`;
            }).join(' ')} L 100% ${height} Z`}
            fill={`url(#gradient-${title}-primary)`}
            className="transition-all duration-500"
          />
          
          {/* Primary line */}
          <path
            d={`M ${data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = height - (item.value / maxValue) * (height - 40);
              return `${index === 0 ? 'M' : 'L'} ${x}% ${y}`;
            }).join(' ')}`}
            stroke={colors[0]}
            strokeWidth="3"
            fill="none"
            className="drop-shadow-sm"
          />
          
          {/* Secondary line if data exists */}
          {data.some(d => d.secondary !== undefined) && (
            <>
              <path
                d={`M 0 ${height} ${data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = height - ((item.secondary || 0) / maxValue) * (height - 40);
                  return `L ${x}% ${y}`;
                }).join(' ')} L 100% ${height} Z`}
                fill={`url(#gradient-${title}-secondary)`}
                className="transition-all duration-500"
              />
              
              <path
                d={`M ${data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 100;
                  const y = height - ((item.secondary || 0) / maxValue) * (height - 40);
                  return `${index === 0 ? 'M' : 'L'} ${x}% ${y}`;
                }).join(' ')}`}
                stroke={colors[1]}
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="drop-shadow-sm"
              />
            </>
          )}
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = height - (item.value / maxValue) * (height - 40);
            
            return (
              <g key={index}>
                <circle
                  cx={`${x}%`}
                  cy={y}
                  r="5"
                  fill={colors[0]}
                  className="hover:r-7 transition-all duration-200 cursor-pointer drop-shadow-md"
                />
                {item.secondary !== undefined && (
                  <circle
                    cx={`${x}%`}
                    cy={height - ((item.secondary || 0) / maxValue) * (height - 40)}
                    r="5"
                    fill={colors[1]}
                    className="hover:r-7 transition-all duration-200 cursor-pointer drop-shadow-md"
                  />
                )}
              </g>
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500 font-medium">
          {data.map((item, index) => (
            <span key={index} className="text-center">
              {item.label}
            </span>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 font-medium">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="transform -translate-y-1/2">
              {((maxValue / 4) * (4 - i)).toFixed(0)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PieChart({ data, title, showLegend = true, size = 200 }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = colorSchemes.multi;
  
  let cumulativeAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;
    
    const color = item.color || colors[index % colors.length];
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      color
    };
  });

  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    const x1 = radius + radius * Math.cos(startAngleRad);
    const y1 = radius + radius * Math.sin(startAngleRad);
    const x2 = radius + radius * Math.cos(endAngleRad);
    const y2 = radius + radius * Math.sin(endAngleRad);
    
    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      
      <div className={`flex ${showLegend ? 'flex-col lg:flex-row lg:items-center' : 'justify-center'} gap-8`}>
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <svg width={size} height={size} className="transform hover:scale-105 transition-transform duration-300">
            {segments.map((segment, index) => (
              <g key={index} className="group cursor-pointer">
                <path
                  d={createArcPath(segment.startAngle, segment.endAngle, size / 2 - 10)}
                  fill={segment.color}
                  className="transition-all duration-300 hover:brightness-110 drop-shadow-lg"
                  style={{
                    filter: `drop-shadow(0 4px 8px ${segment.color}40)`
                  }}
                />
                {/* Hover effect - slightly larger segment */}
                <path
                  d={createArcPath(segment.startAngle, segment.endAngle, size / 2 - 5)}
                  fill={segment.color}
                  className="opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
              </g>
            ))}
          </svg>
        </div>
        
        {/* Legend */}
        {showLegend && (
          <div className="flex-1 space-y-3">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-md" 
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="font-medium text-gray-700">{segment.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{segment.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{segment.percentage.toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel, 
  color = 'blue',
  format = 'number'
}: {
  title: string;
  value: number | string;
  icon: string;
  trend?: number;
  trendLabel?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  format?: 'number' | 'currency' | 'percentage';
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `₱${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
            {formatValue(value)}
          </p>
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full mr-2 ${trend >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '+' : ''}{trend}% {trendLabel}
              </span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ProgressCard({
  title,
  current,
  total,
  color = 'blue',
  subtitle,
  icon
}: {
  title: string;
  current: number;
  total: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  subtitle?: string;
  icon: string;
}) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const colorClasses = {
    blue: { bg: 'from-blue-500 to-blue-600', progress: 'from-blue-400 to-blue-500', ring: 'ring-blue-200' },
    green: { bg: 'from-green-500 to-green-600', progress: 'from-green-400 to-green-500', ring: 'ring-green-200' },
    purple: { bg: 'from-purple-500 to-purple-600', progress: 'from-purple-400 to-purple-500', ring: 'ring-purple-200' },
    orange: { bg: 'from-orange-500 to-orange-600', progress: 'from-orange-400 to-orange-500', ring: 'ring-orange-200' }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color].bg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ring-4 ${colorClasses[color].ring}`}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
            {percentage.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">{current}/{total}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span>Progress</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className={`bg-gradient-to-r ${colorClasses[color].progress} h-3 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}