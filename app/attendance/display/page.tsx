"use client";

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  student: Student;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  createdAt: string;
}

export default function AttendanceDisplayPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({ present: 0, late: 0, total: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [session, setSession] = useState<'morning' | 'afternoon'>('morning');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const hour = new Date().getHours();
    setSession(hour < 13 ? 'morning' : 'afternoon');

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 3000);
    return () => clearInterval(interval);
  }, [session]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/students');
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/admin/attendance?date=${today}`);
      const data = await response.json();
      
      const newRecords = data.attendance || [];
      
      // Find truly new records (not in previous fetch)
      const oldAttendanceIds = attendanceRecords.map(r => r.id);
      const freshRecords = newRecords.filter((r: AttendanceRecord) => !oldAttendanceIds.includes(r.id));
      
      // Only add to recent if there are actually new records
      if (freshRecords.length > 0) {
        setRecentAttendance(prev => {
          const combined = [...freshRecords, ...prev];
          // Keep only one entry per student (most recent)
          const uniqueByStudent = combined.filter((record, index, self) => 
            index === self.findIndex(r => r.studentId === record.studentId)
          );
          return uniqueByStudent.slice(0, 5);
        });
      }
      
      setAttendanceRecords(newRecords);
      
      const present = newRecords.filter((r: AttendanceRecord) => r.status === 'present').length;
      const late = newRecords.filter((r: AttendanceRecord) => r.status === 'late').length;
      const totalStudents = students.filter(s => s.status === 'active').length;
      setStats({ present, late, total: totalStudents });
      
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            Live Attendance Monitor
          </h1>
          <div className="text-2xl text-blue-200 mb-2">
            {mounted ? formatDate(currentTime) : ''}
          </div>
          <div className="text-4xl font-mono text-yellow-300 animate-pulse">
            {mounted ? formatTime(currentTime) : '--:--:-- --'}
          </div>
          <div className="mt-4 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full">
            <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${session === 'morning' ? 'bg-yellow-400' : 'bg-orange-400'}`}></div>
            <span className="text-white font-semibold text-lg">
              {session === 'morning' ? 'Morning Session' : 'Afternoon Session'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-lg font-medium">Present</p>
                <p className="text-5xl font-bold text-green-400">{stats.present}</p>
              </div>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 text-lg font-medium">Late</p>
                <p className="text-5xl font-bold text-yellow-400">{stats.late}</p>
              </div>
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-lg font-medium">Total</p>
                <p className="text-5xl font-bold text-blue-400">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {recentAttendance.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Recent Check-ins ({recentAttendance.length})</h2>
            <div className="space-y-4">
              {recentAttendance.map((record, index) => (
                <div 
                  key={`${record.id}-${index}`}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl transform transition-all duration-500 hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {record.student.photoUrl ? (
                        <img 
                          src={record.student.photoUrl} 
                          alt={`${record.student.firstName} ${record.student.lastName}`}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white/30"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {record.student.firstName[0]}{record.student.lastName[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">
                        {record.student.firstName} {record.student.lastName}
                      </h3>
                      <p className="text-blue-200">{record.student.studentId}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                        record.status === 'present' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        record.status === 'late' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                        'bg-red-500/20 text-red-300 border border-red-400/30'
                      }`}>
                        {record.status.toUpperCase()}
                      </span>
                      <p className="text-white/70 text-sm mt-1">
                        {new Date(record.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-white/20">
            <h2 className="text-3xl font-bold text-white text-center">Today's Attendance</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">Student</th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">Student ID</th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-6 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {students.filter(s => s.status === 'active').length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <p className="text-white/70 text-lg">No active students found...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.filter(s => s.status === 'active').map((student, index) => {
                    const attendance = attendanceRecords.find(r => r.studentId === student.id);
                    return (
                      <tr 
                        key={student.id} 
                        className="hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {student.photoUrl ? (
                                <img 
                                  src={student.photoUrl} 
                                  alt={`${student.firstName} ${student.lastName}`}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {student.firstName[0]}{student.lastName[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-lg font-medium text-white">
                                {student.firstName} {student.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-blue-300 font-mono text-lg">{student.studentId}</span>
                        </td>
                        <td className="px-8 py-6">
                          {attendance ? (
                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                              attendance.status === 'present' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                              attendance.status === 'late' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                              'bg-red-500/20 text-red-300 border border-red-400/30'
                            }`}>
                              {attendance.status.toUpperCase()}
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-gray-500/20 text-gray-300 border border-gray-400/30">
                              NOT MARKED
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-white/80 font-mono">
                            {attendance ? new Date(attendance.createdAt).toLocaleTimeString() : '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}