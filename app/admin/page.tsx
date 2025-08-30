"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    studentsGrowth: 0,
    enrollments: 0,
    enrollmentsGrowth: 0,
    attendance: 0,
    attendanceChange: 0,
    goodMorals: 0,
    goodMoralsGrowth: 0,
    payments: 0,
    paymentsGrowth: 0,
    lecturers: 0,
    lecturersNew: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg shadow-sm border">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.students}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${stats.studentsGrowth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${stats.studentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.studentsGrowth >= 0 ? '+' : ''}{stats.studentsGrowth}% this month
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Enrollments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.enrollments}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${stats.enrollmentsGrowth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${stats.enrollmentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.enrollmentsGrowth >= 0 ? '+' : ''}{stats.enrollmentsGrowth}% this week
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Attendance</p>
                <p className="text-3xl font-bold text-gray-900">{stats.attendance}%</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${stats.attendanceChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${stats.attendanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.attendanceChange >= 0 ? '+' : ''}{stats.attendanceChange}% this week
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.goodMorals}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${stats.goodMoralsGrowth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${stats.goodMoralsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.goodMoralsGrowth >= 0 ? '+' : ''}{stats.goodMoralsGrowth}% this month
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₱{stats.payments?.toLocaleString() || '0'}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${stats.paymentsGrowth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${stats.paymentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.paymentsGrowth >= 0 ? '+' : ''}{stats.paymentsGrowth}% this month
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Lecturers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.lecturers}</p>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${stats.lecturersNew >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${stats.lecturersNew >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {stats.lecturersNew} new this month
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Placeholder */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Enrollment Trends</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">7D</button>
                <button className="px-3 py-1 text-xs font-medium text-gray-500 rounded-full">30D</button>
                <button className="px-3 py-1 text-xs font-medium text-gray-500 rounded-full">90D</button>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Analytics Chart</p>
                <p className="text-sm text-gray-500">Chart integration coming soon</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin/students" className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 group">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add Student</p>
                  <p className="text-sm text-gray-600">Register new student</p>
                </div>
              </Link>

              <Link href="/admin/attendance" className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-xl transition-all duration-200 group">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Take Attendance</p>
                  <p className="text-sm text-gray-600">Mark student attendance</p>
                </div>
              </Link>

              <Link href="/admin/good-moral" className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-xl transition-all duration-200 group">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Issue Certificate</p>
                  <p className="text-sm text-gray-600">Generate good moral</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">New student enrolled</p>
                <p className="text-sm text-gray-600">Maria Santos joined Criminology Review Program</p>
              </div>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">2m ago</span>
            </div>

            <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Certificate issued</p>
                <p className="text-sm text-gray-600">Good moral certificate for John Dela Cruz</p>
              </div>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">1h ago</span>
            </div>

            <div className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Payment received</p>
                <p className="text-sm text-gray-600">₱15,000 payment from Anna Reyes</p>
              </div>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">3h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}