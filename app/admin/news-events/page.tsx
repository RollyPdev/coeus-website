"use client";

import { useState } from "react";
import Link from "next/link";
import { newsEvents as initialNewsEvents } from "../../../data/newsEvents";

export default function NewsEventsPage() {
  const [newsEvents, setNewsEvents] = useState(initialNewsEvents);
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredItems = activeTab === "all" 
    ? newsEvents 
    : newsEvents.filter(item => item.category === activeTab);
  
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setNewsEvents(newsEvents.filter(item => item.id !== id));
    }
  };
  
  const handleFeature = (id: string) => {
    setNewsEvents(newsEvents.map(item => 
      item.id === id 
        ? { ...item, featured: true } 
        : { ...item, featured: item.id === id ? true : false }
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">News & Events</h1>
        <Link
          href="/admin/news-events/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          Add New Item
        </Link>
      </div>
      
      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeTab === "all" 
                ? "bg-blue-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-200`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "news" 
                ? "bg-blue-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border-t border-b border-gray-200`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab("event")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeTab === "event" 
                ? "bg-blue-700 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-200`}
          >
            Events
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded object-cover"
                          src={item.image}
                          alt={item.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {item.summary}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.category === "news"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.featured ? (
                      <span className="text-green-600">Featured</span>
                    ) : (
                      <button
                        onClick={() => handleFeature(item.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Set as featured
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/news-events/${item.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}