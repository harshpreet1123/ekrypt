"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("analytics");

  // Mock data for charts
  const clicksData = [
    { date: "2024-01-01", clicks: 120 },
    { date: "2024-01-02", clicks: 180 },
    { date: "2024-01-03", clicks: 150 },
    { date: "2024-01-04", clicks: 220 },
    { date: "2024-01-05", clicks: 190 },
    { date: "2024-01-06", clicks: 280 },
    { date: "2024-01-07", clicks: 340 },
  ];

  const osData = [
    { name: "Windows", value: 45, color: "#3B82F6" },
    { name: "macOS", value: 30, color: "#8B5CF6" },
    { name: "iOS", value: 15, color: "#10B981" },
    { name: "Android", value: 10, color: "#F59E0B" },
  ];

  const browserData = [
    { name: "Chrome", clicks: 850 },
    { name: "Safari", clicks: 420 },
    { name: "Firefox", clicks: 280 },
    { name: "Edge", clicks: 150 },
  ];

  const countryData = [
    { name: "United States", clicks: 650 },
    { name: "United Kingdom", clicks: 420 },
    { name: "Canada", clicks: 320 },
    { name: "Germany", clicks: 280 },
    { name: "France", clicks: 230 },
  ];

  const deviceData = [
    { name: "Desktop", value: 60, color: "#3B82F6" },
    { name: "Mobile", value: 35, color: "#8B5CF6" },
    { name: "Tablet", value: 5, color: "#10B981" },
  ];

  // Mock activity logs
  const activityLogs = [
    {
      id: 1,
      action: "Link clicked",
      url: "ekrypt.to/abc123",
      ip: "192.168.1.1",
      country: "United States",
      device: "Desktop",
      browser: "Chrome",
      timestamp: "2024-01-07 14:32:15",
    },
    {
      id: 2,
      action: "Link clicked",
      url: "ekrypt.to/def456",
      ip: "192.168.1.2",
      country: "United Kingdom",
      device: "Mobile",
      browser: "Safari",
      timestamp: "2024-01-07 14:28:43",
    },
    {
      id: 3,
      action: "Link clicked",
      url: "ekrypt.to/ghi789",
      ip: "192.168.1.3",
      country: "Canada",
      device: "Desktop",
      browser: "Firefox",
      timestamp: "2024-01-07 14:25:12",
    },
    {
      id: 4,
      action: "Link clicked",
      url: "ekrypt.to/jkl012",
      ip: "192.168.1.4",
      country: "Germany",
      device: "Mobile",
      browser: "Chrome",
      timestamp: "2024-01-07 14:20:58",
    },
    {
      id: 5,
      action: "Link clicked",
      url: "ekrypt.to/mno345",
      ip: "192.168.1.5",
      country: "France",
      device: "Tablet",
      browser: "Edge",
      timestamp: "2024-01-07 14:18:35",
    },
  ];

  // Mock links data
  const linksData = [
    {
      id: 1,
      title: "Marketing Campaign 2024",
      slug: "marketing-2024",
      originalUrl: "https://example.com/marketing-campaign-2024-landing-page",
      shortUrl: "ekrypt.to/mkt24",
      clicks: 1250,
      status: "Active",
      created: "2024-01-01",
      expires: "2024-12-31",
    },
    {
      id: 2,
      title: "Product Launch Event",
      slug: "product-launch",
      originalUrl: "https://example.com/product-launch-event-registration",
      shortUrl: "ekrypt.to/launch",
      clicks: 890,
      status: "Active",
      created: "2024-01-15",
      expires: "2024-06-30",
    },
    {
      id: 3,
      title: "Newsletter Signup",
      slug: "newsletter",
      originalUrl: "https://example.com/newsletter-signup-form",
      shortUrl: "ekrypt.to/news",
      clicks: 2340,
      status: "Active",
      created: "2023-12-01",
      expires: "Never",
    },
    {
      id: 4,
      title: "Holiday Sale 2023",
      slug: "holiday-sale",
      originalUrl: "https://example.com/holiday-sale-2023",
      shortUrl: "ekrypt.to/sale23",
      clicks: 567,
      status: "Expired",
      created: "2023-11-01",
      expires: "2024-01-01",
    },
    {
      id: 5,
      title: "Beta Testing Program",
      slug: "beta-test",
      originalUrl: "https://example.com/beta-testing-program-signup",
      shortUrl: "ekrypt.to/beta",
      clicks: 234,
      status: "Paused",
      created: "2024-01-20",
      expires: "2024-03-31",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400 bg-green-400/10";
      case "Expired":
        return "text-red-400 bg-red-400/10";
      case "Paused":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-50 animate-float-delay"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ekrypt
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Analytics
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Settings
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">JD</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-300">
            Monitor your links performance and analytics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg backdrop-blur-md border border-gray-700 w-fit">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "analytics"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            Link Analytics
          </button>
          <button
            onClick={() => setActiveTab("links")}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "links"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            My Links
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">
                    Total Clicks
                  </h3>
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">12,847</div>
                <div className="flex items-center text-sm">
                  <span className="text-green-400">+23%</span>
                  <span className="text-gray-400 ml-2">vs last week</span>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">
                    Active Links
                  </h3>
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">156</div>
                <div className="flex items-center text-sm">
                  <span className="text-green-400">+12</span>
                  <span className="text-gray-400 ml-2">new this week</span>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">
                    Expired Links
                  </h3>
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">23</div>
                <div className="flex items-center text-sm">
                  <span className="text-red-400">+5</span>
                  <span className="text-gray-400 ml-2">this week</span>
                </div>
              </div>
            </div>

            {/* Clicks Over Time Chart */}
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Clicks Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clicksData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Operating Systems */}
              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">
                  Operating Systems
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={osData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {osData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Device Types */}
              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">Device Types</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Browser and Country Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Browsers */}
              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">Top Browsers</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={browserData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="clicks" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Countries */}
              <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">Top Countries</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="clicks" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Activity Logs */}
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Action
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        URL
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Country
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Device
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Browser
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-300">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-gray-700/50 hover:bg-gray-700/20"
                      >
                        <td className="py-3 px-4 text-blue-400">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-300">
                          {log.url}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {log.country}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {log.device}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {log.browser}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {log.timestamp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* My Links Tab */}
        {activeTab === "links" && (
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">My Links</h2>
                <p className="text-gray-400">Manage all your shortened links</p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create New Link</span>
              </button>
            </div>

            {/* Links Table */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-300">
                        Title
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-300">
                        Short URL
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-300">
                        Original URL
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-300">
                        Clicks
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-300">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-300">
                        Created
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {linksData.map((link) => (
                      <tr
                        key={link.id}
                        className="border-b border-gray-700/50 hover:bg-gray-700/20"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-white">
                            {link.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {link.slug}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-mono text-blue-400 hover:underline cursor-pointer">
                            {link.shortUrl}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className="max-w-xs truncate text-gray-300"
                            title={link.originalUrl}
                          >
                            {link.originalUrl}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-white font-semibold">
                            {link.clicks.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              link.status
                            )}`}
                          >
                            {link.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-400">
                          {link.created}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                              title="View Analytics"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                              title="Copy Link"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                              title="Edit Link"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete Link"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing 1 to 5 of 156 results
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-gray-400 hover:text-white border border-gray-700 rounded hover:border-gray-600 transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded">
                    1
                  </button>
                  <button className="px-3 py-1 text-gray-400 hover:text-white border border-gray-700 rounded hover:border-gray-600 transition-colors">
                    2
                  </button>
                  <button className="px-3 py-1 text-gray-400 hover:text-white border border-gray-700 rounded hover:border-gray-600 transition-colors">
                    3
                  </button>
                  <button className="px-3 py-1 text-gray-400 hover:text-white border border-gray-700 rounded hover:border-gray-600 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(15px) translateX(-15px);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
