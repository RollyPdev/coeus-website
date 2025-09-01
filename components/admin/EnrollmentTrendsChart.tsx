"use client";

import { useState, useEffect } from 'react';

interface EnrollmentTrendsData {
  date: string;
  label: string;
  completed: number;
  pending: number;
  total: number;
}

interface EnrollmentTrendsResponse {
  period: string;
  data: EnrollmentTrendsData[];
  summary: {
    totalEnrollments: number;
    totalCompleted: number;
    totalPending: number;
    completionRate: number;
    growthRate: number;
  };
}

interface EnrollmentTrendsChartProps {
  className?: string;
}

export default function EnrollmentTrendsChart({ className = '' }: EnrollmentTrendsChartProps) {
  const [trendsData, setTrendsData] = useState<EnrollmentTrendsResponse | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendsData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchTrendsData = async (period: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/enrollment-trends?period=${period}`);
      const data = await response.json();
      setTrendsData(data);
    } catch (error) {
      console.error('Error fetching enrollment trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`relative bg-gradient-to-br from-white/95 via-blue-50/30 to-indigo-50/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/40 shadow-2xl overflow-hidden ${className}`}>
        {/* Loading background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative flex flex-col xl:flex-row xl:items-start xl:justify-between mb-6 sm:mb-8 space-y-6 xl:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-sm animate-pulse"></div>
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Enrollment Trends Analytics
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 shadow-sm animate-pulse">
                <div className="w-32 h-4 bg-blue-200/60 rounded-full"></div>
              </div>
              <div className="bg-gradient-to-r from-amber-50/80 to-amber-100/60 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-200/50 shadow-sm animate-pulse">
                <div className="w-28 h-4 bg-amber-200/60 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-center xl:justify-end">
            <div className="flex space-x-1 bg-gradient-to-r from-white/60 to-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-lg">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-5 py-2.5 bg-gray-200/60 rounded-xl animate-pulse w-12 h-9"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Loading stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gradient-to-br from-slate-100/60 to-white/80 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-gray-200/40 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl animate-pulse"></div>
                <div className="text-right space-y-2">
                  <div className="w-16 h-8 bg-gray-200/80 rounded-lg animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200/60 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-gray-200/40 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-300/60 to-gray-400/60 h-3 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="relative bg-gradient-to-br from-slate-50/60 via-white/80 to-blue-50/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/50 shadow-2xl">
          <div className="h-80 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin mx-auto" style={{animationDuration: '1.5s', animationDirection: 'reverse'}}></div>
              </div>
              <div className="space-y-3">
                <p className="text-blue-800 font-bold text-xl">Loading Analytics</p>
                <p className="text-blue-600 text-base max-w-xs mx-auto leading-relaxed">Fetching enrollment data and calculating trends...</p>
                <div className="flex justify-center space-x-1 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-2 h-2 bg-blue-500 rounded-full animate-bounce`} style={{animationDelay: `${i * 0.1}s`}}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trendsData) {
    return (
      <div className={`relative bg-gradient-to-br from-white/95 via-red-50/30 to-red-100/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-red-200/50 shadow-2xl overflow-hidden ${className}`}>
        {/* Error background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full shadow-sm"></div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Enrollment Trends Analytics</h3>
          </div>
        </div>
        
        <div className="relative bg-gradient-to-br from-red-50/60 via-white/80 to-red-50/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-red-200/50 shadow-inner">
          <div className="h-80 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/40">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-ping"></div>
              </div>
              <div className="space-y-3">
                <p className="text-red-800 font-bold text-xl">Failed to Load Chart</p>
                <p className="text-red-600 text-base max-w-sm mx-auto leading-relaxed">Unable to fetch enrollment data. Please check your connection and try refreshing the page.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...trendsData.data.map(d => d.total)) || 1;
  const chartHeight = 200; // Increased height for better visibility

  return (
    <div className={`relative bg-gradient-to-br from-white/95 via-blue-50/30 to-indigo-50/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/40 shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(59,130,246,0.3)] transition-all duration-500 overflow-hidden ${className}`}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Header */}
      <div className="relative flex flex-col xl:flex-row xl:items-start xl:justify-between mb-6 sm:mb-8 space-y-6 xl:space-y-0">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-sm"></div>
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Enrollment Trends Analytics
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50/80 to-blue-100/60 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-sm ring-2 ring-blue-100"></div>
              <span className="text-sm font-bold text-blue-800">Completed</span>
              <span className="text-sm font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full min-w-[2rem] text-center">{trendsData.summary.totalCompleted}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50/80 to-amber-100/60 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-200/50 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
              <div className="w-3 h-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-sm ring-2 ring-amber-100"></div>
              <span className="text-sm font-bold text-amber-800">Pending</span>
              <span className="text-sm font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full min-w-[2rem] text-center">{trendsData.summary.totalPending}</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Period Selector */}
        <div className="flex justify-center xl:justify-end">
          <div className="flex space-x-1 bg-gradient-to-r from-white/60 to-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-lg">
            {['7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`relative px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 transform ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40 scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/80 hover:shadow-md hover:scale-102'
                }`}
              >
                {selectedPeriod === period && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-xl blur-xl"></div>
                )}
                <span className="relative z-10">{period.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="group relative overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500/5 via-blue-600/10 to-blue-700/15 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-blue-200/40 hover:border-blue-300/60 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse"></div>
              </div>
              <div className="text-right">
                <p className="text-3xl sm:text-4xl font-black text-blue-800 group-hover:scale-110 transition-transform duration-300">{trendsData.summary.totalEnrollments}</p>
                <p className="text-sm font-bold text-blue-600/80 uppercase tracking-wider">Total Enrollments</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-blue-700">
                <span>Progress</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-blue-200/40 rounded-full h-3 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-3 rounded-full shadow-lg animate-pulse" style={{width: '100%'}}>
                  <div className="w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500/5 via-emerald-600/10 to-emerald-700/15 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border border-emerald-200/40 hover:border-emerald-300/60 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:rotate-12 transition-transform duration-500">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg animate-pulse"></div>
              </div>
              <div className="text-right">
                <p className="text-3xl sm:text-4xl font-black text-emerald-800 group-hover:scale-110 transition-transform duration-300">{trendsData.summary.completionRate}%</p>
                <p className="text-sm font-bold text-emerald-600/80 uppercase tracking-wider">Completion Rate</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-emerald-700">
                <span>Success Rate</span>
                <span>{trendsData.summary.completionRate}%</span>
              </div>
              <div className="w-full bg-emerald-200/40 rounded-full h-3 overflow-hidden shadow-inner">
                <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 h-3 rounded-full transition-all duration-1000 shadow-lg" style={{width: `${trendsData.summary.completionRate}%`}}>
                  <div className="w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden">
          <div className={`bg-gradient-to-br ${
            trendsData.summary.growthRate >= 0 
              ? 'from-purple-500/5 via-purple-600/10 to-purple-700/15 border-purple-200/40 hover:border-purple-300/60 hover:shadow-purple-500/25' 
              : 'from-red-500/5 via-red-600/10 to-red-700/15 border-red-200/40 hover:border-red-300/60 hover:shadow-red-500/25'
          } backdrop-blur-sm rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer`}>
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${
              trendsData.summary.growthRate >= 0 ? 'from-purple-400/20' : 'from-red-400/20'
            } to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <div className={`w-14 h-14 bg-gradient-to-br ${
                  trendsData.summary.growthRate >= 0 
                    ? 'from-purple-500 to-purple-700 shadow-purple-500/40' 
                    : 'from-red-500 to-red-700 shadow-red-500/40'
                } rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500`}>
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={trendsData.summary.growthRate >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                  </svg>
                </div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r ${
                  trendsData.summary.growthRate >= 0 ? 'from-green-400 to-emerald-500' : 'from-red-400 to-red-500'
                } rounded-full shadow-lg animate-pulse`}></div>
              </div>
              <div className="text-right">
                <p className={`text-3xl sm:text-4xl font-black ${
                  trendsData.summary.growthRate >= 0 ? 'text-purple-800' : 'text-red-800'
                } group-hover:scale-110 transition-transform duration-300`}>
                  {trendsData.summary.growthRate >= 0 ? '+' : ''}{trendsData.summary.growthRate}%
                </p>
                <p className={`text-sm font-bold ${
                  trendsData.summary.growthRate >= 0 ? 'text-purple-600/80' : 'text-red-600/80'
                } uppercase tracking-wider`}>Growth Rate</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className={`flex justify-between items-center text-xs font-semibold ${
                trendsData.summary.growthRate >= 0 ? 'text-purple-700' : 'text-red-700'
              }`}>
                <span>{trendsData.summary.growthRate >= 0 ? 'Growth' : 'Decline'}</span>
                <span>{Math.abs(trendsData.summary.growthRate)}%</span>
              </div>
              <div className={`w-full ${
                trendsData.summary.growthRate >= 0 ? 'bg-purple-200/40' : 'bg-red-200/40'
              } rounded-full h-3 overflow-hidden shadow-inner`}>
                <div className={`bg-gradient-to-r ${
                  trendsData.summary.growthRate >= 0 
                    ? 'from-purple-500 via-purple-600 to-purple-700' 
                    : 'from-red-500 via-red-600 to-red-700'
                } h-3 rounded-full transition-all duration-1000 shadow-lg`} 
                     style={{width: `${Math.min(Math.abs(trendsData.summary.growthRate), 100)}%`}}>
                  <div className="w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chart */}
      <div className="relative bg-gradient-to-br from-slate-50/60 via-white/80 to-blue-50/40 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
        {/* Chart background pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234f46e5' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 20h20v20H0V20zm10-10a10 10 0 1 1 0-20 10 10 0 0 1 0 20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Chart container with proper layout structure */}
        <div className="relative w-full h-72 mt-8">
          {/* Chart wrapper with proper Y-axis spacing */}
          <div className="flex h-full">
            {/* Y-axis labels container */}
            <div className="w-14 sm:w-16 flex flex-col justify-between py-2 pr-2 h-full">
              <div className="flex flex-col justify-between" style={{ height: '200px' }}>
                {[maxValue, Math.round(maxValue * 0.8), Math.round(maxValue * 0.6), Math.round(maxValue * 0.4), Math.round(maxValue * 0.2), 0].map((value, index) => (
                  <div key={index} className="relative group flex justify-end">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md border border-gray-200/60 text-gray-800 hover:bg-blue-50/80 hover:border-blue-200/80 hover:text-blue-800 transition-all duration-300 hover:scale-105 cursor-default text-xs">
                      {value}
                    </span>
                    {index === 0 && (
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-gray-800 text-white px-2 py-1 rounded-md whitespace-nowrap">Max Value</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chart area container */}
            <div className="flex-1 relative h-full">
              {/* Enhanced Grid Lines */}
              <div className="absolute inset-0 p-2 pointer-events-none z-10">
                <div className="relative w-full h-52">
                  {[0, 0.2, 0.4, 0.6, 0.8, 1].map((percent, index) => (
                    <div
                      key={index}
                      className={`absolute w-full transition-opacity duration-300 ${
                        index === 0 ? 'border-t-2 border-gray-300/80' : 'border-t border-gray-200/60'
                      } ${index % 2 === 0 ? 'opacity-80' : 'opacity-40'}`}
                      style={{ bottom: `${percent * 200}px` }}
                    />
                  ))}
                  {/* Vertical grid lines */}
                  {trendsData.data.map((_, index) => (
                    <div
                      key={`v-${index}`}
                      className="absolute h-full border-l border-gray-200/30 opacity-20"
                      style={{ left: `${((index + 0.5) / trendsData.data.length) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Chart content area */}
              <div className="relative p-2 h-full">
                <div className="relative flex items-end justify-between gap-2 sm:gap-4 px-2" style={{ height: '200px', paddingBottom: '50px' }}>
                  {trendsData.data.map((item, index) => {
                    const completedHeight = maxValue > 0 ? (item.completed / maxValue) * 150 : 0;
                    const pendingHeight = maxValue > 0 ? (item.pending / maxValue) * 150 : 0;
                    const totalHeight = completedHeight + pendingHeight;
                    const barWidth = Math.max(24, Math.min(48, (100 / trendsData.data.length) * 0.8));

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group relative">
                        {/* Enhanced Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-sm rounded-2xl px-4 py-3 shadow-2xl z-30 border border-white/10 backdrop-blur-xl min-w-max">
                          <div className="space-y-2">
                            <div className="text-center">
                              <p className="font-bold text-white text-base">{item.label}</p>
                              <p className="text-gray-300 text-xs">{item.date}</p>
                            </div>
                            <div className="border-t border-white/20 pt-2 space-y-1.5">
                              <div className="flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-sm"></div>
                                  <span className="font-semibold text-blue-200">Completed:</span>
                                </div>
                                <span className="font-bold text-white">{item.completed}</span>
                              </div>
                              <div className="flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-sm"></div>
                                  <span className="font-semibold text-amber-200">Pending:</span>
                                </div>
                                <span className="font-bold text-white">{item.pending}</span>
                              </div>
                              <div className="border-t border-white/20 pt-1.5 mt-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-gray-200">Total:</span>
                                  <span className="font-bold text-white text-lg">{item.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45 border-r border-b border-white/10"></div>
                        </div>

                        {/* Enhanced Bar with improved animations */}
                        <div 
                          className="relative bg-gradient-to-t from-gray-200/60 to-gray-100/40 rounded-t-3xl overflow-hidden shadow-inner border border-gray-200/50 transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-300/50 group-hover:scale-105" 
                          style={{ width: `${barWidth}px`, height: '150px' }}
                        >
                          {/* Completed portion with enhanced styling */}
                          {completedHeight > 0 && (
                            <div 
                              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-700 via-blue-600 to-blue-500 transition-all duration-700 group-hover:from-blue-800 group-hover:via-blue-700 group-hover:to-blue-600 shadow-xl"
                              style={{ 
                                height: completedHeight,
                                boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/25"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                            </div>
                          )}
                          
                          {/* Pending portion with enhanced styling */}
                          {pendingHeight > 0 && (
                            <div 
                              className="absolute w-full bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 transition-all duration-700 group-hover:from-amber-800 group-hover:via-amber-700 group-hover:to-amber-600 shadow-xl"
                              style={{ 
                                height: pendingHeight,
                                bottom: completedHeight,
                                boxShadow: '0 0 30px rgba(245, 158, 11, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)'
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/25"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                            </div>
                          )}
                          
                          {/* Empty state with better styling */}
                          {totalHeight === 0 && (
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-400/60 to-gray-300/40 h-3 rounded-t-full opacity-60 border-t-2 border-gray-300/80">
                              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30"></div>
                            </div>
                          )}
                        </div>

                        {/* Enhanced X-axis label */}
                        <div className="mt-3 text-center group-hover:transform group-hover:scale-110 transition-transform duration-300">
                          <div className="bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-md border border-gray-200/60 group-hover:bg-blue-50/90 group-hover:border-blue-200/80 group-hover:shadow-lg transition-all duration-300">
                            <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-800 transition-colors duration-300 whitespace-nowrap">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                              {item.total > 0 ? `${item.total} total` : 'No data'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* Add custom CSS for animations */}
<style jsx>{`
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }
`}</style>