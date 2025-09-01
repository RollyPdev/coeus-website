"use client";

import { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart, MetricCard, ProgressCard } from '@/components/admin/AnalyticsCharts';

interface AnalyticsData {
  overview?: {
    totalStudents: number;
    activeStudents: number;
    totalEnrollments: number;
    completedEnrollments: number;
    completionRate: string;
    totalRevenue: number;
    averageAttendance: number;
  };
  [key: string]: any;
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const reports = [
    { id: 'overview', name: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'blue' },
    { id: 'enrollment', name: 'Enrollments', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'green' },
    { id: 'attendance', name: 'Attendance', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', color: 'purple' },
    { id: 'financial', name: 'Financial', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', color: 'orange' },
    { id: 'student', name: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'red' }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [selectedReport, selectedPeriod, dateRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: selectedReport,
        period: selectedPeriod,
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end })
      });
      
      const response = await fetch(`/api/admin/reports/analytics?${params}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        type: selectedReport,
        format,
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end })
      });
      
      const response = await fetch(`/api/admin/reports/export?${params}`);
      
      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights and data visualization</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Export Buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => exportReport('csv')}
                  disabled={isExporting}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                </button>
                <button 
                  onClick={() => exportReport('json')}
                  disabled={isExporting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{isExporting ? 'Exporting...' : 'Export JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {reports.map((report) => {
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              green: 'from-green-500 to-green-600', 
              purple: 'from-purple-500 to-purple-600',
              orange: 'from-orange-500 to-orange-600',
              red: 'from-red-500 to-red-600'
            };
            
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedReport === report.id 
                    ? `bg-gradient-to-br ${colorClasses[report.color as keyof typeof colorClasses]} text-white shadow-2xl transform scale-105` 
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white border border-white/50 shadow-xl hover:shadow-2xl'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`rounded-xl p-3 mb-3 ${
                    selectedReport === report.id 
                      ? 'bg-white bg-opacity-20' 
                      : `bg-gradient-to-br ${colorClasses[report.color as keyof typeof colorClasses]}`
                  }`}>
                    <svg className={`h-6 w-6 ${
                      selectedReport === report.id ? 'text-white' : 'text-white'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={report.icon} />
                    </svg>
                  </div>
                  <h3 className="font-semibold">{report.name}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Report Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Period Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>

              {/* Custom Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.print()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H3a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Report</span>
              </button>
              
              <button 
                onClick={fetchAnalytics}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        {isLoading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-blue-800 font-semibold text-lg">Loading Analytics...</p>
                <p className="text-blue-600 text-sm">Fetching {selectedReport} data</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Report */}
            {selectedReport === 'overview' && analyticsData?.overview && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total Students"
                    value={analyticsData.overview.totalStudents}
                    icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    color="blue"
                  />
                  <MetricCard
                    title="Active Students"
                    value={analyticsData.overview.activeStudents}
                    icon="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    color="green"
                  />
                  <MetricCard
                    title="Total Revenue"
                    value={analyticsData.overview.totalRevenue}
                    icon="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    color="purple"
                    format="currency"
                  />
                  <ProgressCard
                    title="Completion Rate"
                    current={parseFloat(analyticsData.overview.completionRate)}
                    total={100}
                    color="orange"
                    subtitle="Enrollment completion"
                    icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {analyticsData.trends && (
                    <LineChart
                      data={analyticsData.trends.map((item: any) => ({
                        label: item.label,
                        value: item.completed,
                        secondary: item.pending
                      }))}
                      title="Enrollment Trends"
                      primaryLabel="Completed"
                      secondaryLabel="Pending"
                      colorScheme="blue"
                    />
                  )}
                  {analyticsData.topPrograms && (
                    <PieChart
                      data={analyticsData.topPrograms.map((item: any) => ({
                        label: item.reviewType,
                        value: item._count.reviewType
                      }))}
                      title="Popular Programs"
                    />
                  )}
                </div>
              </>
            )}

            {/* Enrollment Report */}
            {selectedReport === 'enrollment' && analyticsData && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {analyticsData.statusDistribution && (
                    <BarChart
                      data={analyticsData.statusDistribution.map((item: any) => ({
                        label: item.status,
                        value: item._count.status
                      }))}
                      title="Enrollment Status Distribution"
                      colorScheme="green"
                    />
                  )}
                  {analyticsData.programDistribution && (
                    <PieChart
                      data={analyticsData.programDistribution.map((item: any) => ({
                        label: item.reviewType,
                        value: item._count.reviewType
                      }))}
                      title="Programs Distribution"
                    />
                  )}
                </div>
                {analyticsData.monthlyTrends && (
                  <LineChart
                    data={analyticsData.monthlyTrends.map((item: any) => ({
                      label: item.label,
                      value: item.completed,
                      secondary: item.pending
                    }))}
                    title="Monthly Enrollment Trends"
                    primaryLabel="Completed"
                    secondaryLabel="Pending"
                    colorScheme="green"
                  />
                )}
              </>
            )}

            {/* Other report types */}
            {selectedReport === 'attendance' && analyticsData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {analyticsData.statusDistribution && (
                  <PieChart
                    data={analyticsData.statusDistribution.map((item: any) => ({
                      label: item.status,
                      value: item._count.status
                    }))}
                    title="Attendance Distribution"
                  />
                )}
                {analyticsData.programAttendance && (
                  <BarChart
                    data={analyticsData.programAttendance.map((item: any) => ({
                      label: item.program,
                      value: parseFloat(item.attendanceRate)
                    }))}
                    title="Attendance by Program"
                    colorScheme="purple"
                  />
                )}
              </div>
            )}

            {selectedReport === 'financial' && analyticsData && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {analyticsData.revenueByMethod && (
                    <BarChart
                      data={analyticsData.revenueByMethod.map((item: any) => ({
                        label: item.paymentMethod,
                        value: item._sum.amount || 0
                      }))}
                      title="Revenue by Payment Method"
                      colorScheme="orange"
                    />
                  )}
                  {analyticsData.programRevenue && (
                    <PieChart
                      data={analyticsData.programRevenue.map((item: any) => ({
                        label: item.program,
                        value: item.revenue
                      }))}
                      title="Revenue by Program"
                    />
                  )}
                </div>
                {analyticsData.monthlyRevenue && (
                  <LineChart
                    data={analyticsData.monthlyRevenue.map((item: any) => ({
                      label: item.label,
                      value: item.revenue
                    }))}
                    title="Monthly Revenue Trends"
                    colorScheme="orange"
                  />
                )}
              </>
            )}

            {selectedReport === 'student' && analyticsData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {analyticsData.genderDistribution && (
                  <PieChart
                    data={analyticsData.genderDistribution.map((item: any) => ({
                      label: item.gender,
                      value: item._count.gender
                    }))}
                    title="Gender Distribution"
                    size={180}
                  />
                )}
                {analyticsData.ageDistribution && (
                  <BarChart
                    data={analyticsData.ageDistribution.map((item: any) => ({
                      label: item.ageRange,
                      value: item.count
                    }))}
                    title="Age Distribution"
                    colorScheme="purple"
                    height={240}
                  />
                )}
                {analyticsData.statusDistribution && (
                  <PieChart
                    data={analyticsData.statusDistribution.map((item: any) => ({
                      label: item.status,
                      value: item._count.status
                    }))}
                    title="Student Status"
                    size={180}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}