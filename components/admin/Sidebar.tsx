"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface MenuItem {
  name: string;
  href: string;
  icon: string;
  color: string;
  badge?: string;
  subItems?: MenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
  id: string;
}

const Sidebar = () => {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['core', 'student-management']);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(g => g !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuGroups: MenuGroup[] = [
    {
      id: "core",
      title: "Core",
      items: [
        { 
          name: "Dashboard", 
          href: "/admin", 
          icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", 
          color: "from-blue-500 to-blue-600" 
        },
        { 
          name: "Reports", 
          href: "/admin/reports", 
          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", 
          color: "from-cyan-500 to-cyan-600" 
        }
      ]
    },
    {
      id: "student-management",
      title: "Student Management",
      items: [
        { 
          name: "Students", 
          href: "/admin/students", 
          icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", 
          color: "from-emerald-500 to-emerald-600"
        },
        { 
          name: "Enrollments", 
          href: "/admin/enrollments", 
          icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", 
          color: "from-indigo-500 to-indigo-600" 
        },
        { 
          name: "Attendance", 
          href: "/admin/attendance", 
          icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", 
          color: "from-purple-500 to-purple-600" 
        },
        { 
          name: "Good Moral", 
          href: "/admin/good-moral", 
          icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", 
          color: "from-amber-500 to-amber-600" 
        }
      ]
    },
    {
      id: "operations",
      title: "Operations",
      items: [
        { 
          name: "Payments", 
          href: "/admin/payments", 
          icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", 
          color: "from-green-500 to-green-600",
          badge: "NEW"
        },
        { 
          name: "Programs", 
          href: "/admin/programs", 
          icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", 
          color: "from-teal-500 to-teal-600" 
        },
        { 
          name: "Lecturers", 
          href: "/admin/lecturers", 
          icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", 
          color: "from-rose-500 to-rose-600" 
        }
      ]
    },
    {
      id: "content",
      title: "Content",
      items: [
        { 
          name: "News & Events", 
          href: "/admin/news-events", 
          icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", 
          color: "from-orange-500 to-orange-600" 
        },
        { 
          name: "About Content", 
          href: "/admin/about", 
          icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", 
          color: "from-violet-500 to-violet-600" 
        }
      ]
    },
    {
      id: "tools",
      title: "Tools",
      items: [
        { 
          name: "QR Generator", 
          href: "/admin/qr-generator", 
          icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h14a2 2 0 012 2", 
          color: "from-pink-500 to-pink-600" 
        },
        { 
          name: "Settings", 
          href: "/admin/settings", 
          icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", 
          color: "from-gray-500 to-gray-600" 
        }
      ]
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-72'} bg-white/90 backdrop-blur-xl text-gray-800 h-full flex flex-col shadow-2xl border-r border-gray-200/50 transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Coeus Admin
                </h1>
                <p className="text-xs text-gray-500">Management Portal</p>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuGroups.map((group) => {
            const isGroupExpanded = expandedGroups.includes(group.id);
            
            return (
              <div key={group.id} className="mb-4">
                {/* Group Header */}
                {!isCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors duration-200"
                  >
                    <span>{group.title}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isGroupExpanded ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
                
                {/* Group Items */}
                <div className={`space-y-1 ${!isCollapsed && !isGroupExpanded ? 'hidden' : ''}`}>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/50 shadow-md"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                        )}
                        
                        {/* Icon */}
                        <div className={`${isCollapsed ? 'mr-0' : 'mr-3'} w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                          isActive 
                            ? `bg-gradient-to-br ${item.color} shadow-lg` 
                            : "bg-gray-100/80 group-hover:bg-gray-200/80"
                        }`}>
                          <svg
                            className={`h-5 w-5 ${
                              isActive ? "text-white" : "text-gray-600 group-hover:text-gray-700"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d={item.icon}
                            />
                          </svg>
                        </div>
                        
                        {/* Label */}
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 font-medium">{item.name}</span>
                            
                            {/* Badge */}
                            {item.badge && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                                {item.badge}
                              </span>
                            )}
                            
                            {/* Active dot */}
                            {isActive && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
                            )}
                          </>
                        )}
                        
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            {item.name}
                            {item.badge && (
                              <span className="ml-1 px-1 py-0.5 text-xs bg-green-500 rounded">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50 space-y-2">
        <Link
          href="/"
          className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-xl transition-all duration-200"
        >
          <div className={`${isCollapsed ? 'mr-0' : 'mr-3'} w-8 h-8 rounded-lg bg-gray-100/80 group-hover:bg-gray-200/80 flex items-center justify-center transition-all duration-200`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          {!isCollapsed && <span>Back to Website</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Back to Website
            </div>
          )}
        </Link>
        
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 w-full"
        >
          <div className={`${isCollapsed ? 'mr-0' : 'mr-3'} w-8 h-8 rounded-lg bg-gray-100/80 group-hover:bg-red-100/80 flex items-center justify-center transition-all duration-200`}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;