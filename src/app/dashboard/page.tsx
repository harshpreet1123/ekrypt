
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { LogOut, Plus, AlertTriangle, Loader2, BarChart3, Link2, MousePointer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
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

// Types
interface Link {
  id: string;
  title?: string;
  short_code: string;
  original_url: string;
  click_count: number;
  is_active: boolean;
  deleted_at?: string;
  expires_at?: string;
  max_clicks?: number;
  created_at: string;
  user_id: string;
}

interface Analytics {
  id: string;
  link_id: string;
  timestamp: string;
  ip?: string;
  country?: string;
  device_type?: string;
  browser?: string;
  os?: string;
}

interface Stats {
  totalClicks: number;
  activeLinks: number;
  expiredLinks: number;
}

interface ChartData {
  date: string;
  clicks: number;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface BarChartData {
  name: string;
  clicks: number;
}

interface ActivityLog {
  id: string;
  action: string;
  url: string;
  ip: string;
  country: string;
  device: string;
  browser: string;
  timestamp: string;
}

type LinkStatus = "Active" | "Expired" | "Paused";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "links">("analytics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Data states
  const [links, setLinks] = useState<Link[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalClicks: 0,
    activeLinks: 0,
    expiredLinks: 0,
  });

  // Processed analytics data
  const [clicksOverTime, setClicksOverTime] = useState<ChartData[]>([]);
  const [osData, setOsData] = useState<PieChartData[]>([]);
  const [browserData, setBrowserData] = useState<BarChartData[]>([]);
  const [countryData, setCountryData] = useState<BarChartData[]>([]);
  const [deviceData, setDeviceData] = useState<PieChartData[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);

  const getStatusColor = (status: LinkStatus): string => {
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

  const getStatusFromLink = (link: Link): LinkStatus => {
    if (!link.is_active || link.deleted_at) return "Paused";
    if (link.expires_at && new Date(link.expires_at) < new Date()) return "Expired";
    if (link.max_clicks && link.click_count >= link.max_clicks) return "Expired";
    return "Active";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const fetchDashboardData = useCallback(async (userId: string) => {
    try {
      // Fetch links
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (linksError) throw linksError;

      const typedLinksData = (linksData || []) as Link[];
      setLinks(typedLinksData);

      // If no links, skip analytics fetch
      if (!typedLinksData || typedLinksData.length === 0) {
        setStats({ totalClicks: 0, activeLinks: 0, expiredLinks: 0 });
        return;
      }

      const linkIds = typedLinksData.map(link => link.id);

      // Fetch analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from("analytics")
        .select("*")
        .in("link_id", linkIds)
        .order("timestamp", { ascending: false });

      if (analyticsError) throw analyticsError;

      const typedAnalyticsData = (analyticsData || []) as Analytics[];
      setAnalytics(typedAnalyticsData);

      // Process data
      processAnalyticsData(typedLinksData, typedAnalyticsData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      throw err;
    }
  }, []);

  const processAnalyticsData = useCallback((linksData: Link[], analyticsData: Analytics[]) => {
    // Calculate stats
    const totalClicks = linksData.reduce((sum, link) => sum + (link.click_count || 0), 0);
    const activeLinks = linksData.filter(link => getStatusFromLink(link) === "Active").length;
    const expiredLinks = linksData.filter(link => getStatusFromLink(link) === "Expired").length;

    setStats({ totalClicks, activeLinks, expiredLinks });

    // Process clicks over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const clicksByDate: ChartData[] = last7Days.map(date => {
      const clicksOnDate = analyticsData.filter(
        analytics => analytics.timestamp.split('T')[0] === date
      ).length;
      return { date, clicks: clicksOnDate };
    });

    setClicksOverTime(clicksByDate);

    // Process OS data
    const osStats: Record<string, number> = {};
    analyticsData.forEach(analytics => {
      const os = analytics.os || "Unknown";
      osStats[os] = (osStats[os] || 0) + 1;
    });

    const osDataProcessed: PieChartData[] = Object.entries(osStats)
      .map(([name, value], index) => ({
        name,
        value,
        color: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"][index % 5]
      }))
      .slice(0, 5);

    setOsData(osDataProcessed);

    // Process browser data
    const browserStats: Record<string, number> = {};
    analyticsData.forEach(analytics => {
      const browser = analytics.browser || "Unknown";
      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    const browserDataProcessed: BarChartData[] = Object.entries(browserStats)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    setBrowserData(browserDataProcessed);

    // Process country data
    const countryStats: Record<string, number> = {};
    analyticsData.forEach(analytics => {
      const country = analytics.country || "Unknown";
      countryStats[country] = (countryStats[country] || 0) + 1;
    });

    const countryDataProcessed: BarChartData[] = Object.entries(countryStats)
      .map(([name, clicks]) => ({ name, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    setCountryData(countryDataProcessed);

    // Process device data
    const deviceStats: Record<string, number> = {};
    analyticsData.forEach(analytics => {
      const device = analytics.device_type || "Unknown";
      deviceStats[device] = (deviceStats[device] || 0) + 1;
    });

    const deviceDataProcessed: PieChartData[] = Object.entries(deviceStats)
      .map(([name, value], index) => ({
        name,
        value,
        color: ["#3B82F6", "#8B5CF6", "#10B981"][index % 3]
      }));

    setDeviceData(deviceDataProcessed);

    // Process recent activity
    const recentActivityProcessed: ActivityLog[] = analyticsData
      .slice(0, 10)
      .map(analytics => {
        const link = linksData.find(l => l.id === analytics.link_id);
        return {
          id: analytics.id,
          action: "Link clicked",
          url: link ? `ekrypt.vercel.app/${link.short_code}` : "Unknown",
          ip: analytics.ip?.replace(/\.\d+$/, '.xxx') || "Unknown", // Mask last octet for privacy
          country: analytics.country || "Unknown",
          device: analytics.device_type || "Unknown",
          browser: analytics.browser || "Unknown",
          timestamp: formatDateTime(analytics.timestamp),
        };
      });

    setRecentActivity(recentActivityProcessed);
  }, []);

  // Fetch user session and data
  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          router.push("/");
          return;
        }

        setUser(session.user);
        await fetchDashboardData(session.user.id);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [router, fetchDashboardData]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('links')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', linkId);
      
      if (error) throw error;
      await fetchDashboardData(user.id);
    } catch (err) {
      console.error('Error deleting link:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <Logo />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ekrypt
            </span>
          </div>
          <div className="flex gap-8">
            <button
              onClick={() => router.replace("/create")}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex gap-2"
            >
              <Plus color="white" />
              Create Link
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 cursor-pointer p-2 bg-red-500/20 rounded-lg">
              <LogOut color="red" onClick={handleLogout} />
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
            {links.length === 0 ? (
              // Empty state for analytics
              <div className="text-center py-16">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Analytics Data</h3>
                <p className="text-gray-400 mb-6">
                  Create your first link to start tracking analytics
                </p>
                <button
                  onClick={() => router.push("/create")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Create Your First Link
                </button>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-300">
                        Total Clicks
                      </h3>
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <MousePointer className="h-5 w-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.totalClicks.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400">Total interactions</span>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-300">
                        Active Links
                      </h3>
                      <div className="p-2 bg-green-600/20 rounded-lg">
                        <Link2 className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.activeLinks}
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400">Currently working</span>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-300">
                        Expired Links
                      </h3>
                      <div className="p-2 bg-red-600/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {stats.expiredLinks}
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400">Need attention</span>
                    </div>
                  </div>
                </div>

                {analytics.length === 0 ? (
                  <div className="bg-gray-800/50 backdrop-blur-md p-12 rounded-xl border border-gray-700 text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Click Data Yet</h3>
                    <p className="text-gray-400">
                      Share your links to start seeing analytics data
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Clicks Over Time Chart */}
                    <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
                      <h3 className="text-xl font-semibold mb-6">Clicks Over Time (Last 7 Days)</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={clicksOverTime}>
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
                      {osData.length > 0 && (
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
                      )}

                      {/* Device Types */}
                      {deviceData.length > 0 && (
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
                      )}
                    </div>

                    {/* Browser and Country Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Browsers */}
                      {browserData.length > 0 && (
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
                      )}

                      {/* Countries */}
                      {countryData.length > 0 && (
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
                      )}
                    </div>

                    {/* Activity Logs */}
                    {recentActivity.length > 0 && (
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
                              {recentActivity.map((log) => (
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
                    )}
                  </>
                )}
              </>
            )}
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
              <button 
                onClick={() => router.push("/create")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Link</span>
              </button>
            </div>

            {links.length === 0 ? (
              // Empty state for links
              <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-16 text-center">
                <Link2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Links Created Yet</h3>
                <p className="text-gray-400 mb-6">
                  Create your first shortened link to get started
                </p>
                <button
                  onClick={() => router.push("/create")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Create Your First Link
                </button>
              </div>
            ) : (
              /* Links Table */
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
                      {links.map((link) => {
                        const status = getStatusFromLink(link);
                        return (
                          <tr
                            key={link.id}
                            className="border-b border-gray-700/50 hover:bg-gray-700/20"
                          >
                            <td className="py-4 px-6">
                              <div className="font-medium text-white">
                                {link.title || "Untitled Link"}
                              </div>
                              <div className="text-sm text-gray-400">
                                {link.short_code}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div 
                                className="font-mono text-blue-400 hover:underline cursor-pointer"
                                onClick={() => copyToClipboard(`ekrypt.vercel.app/${link.short_code}`)}
                              >
                                ekrypt.vercel.app/{link.short_code}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div
                                className="max-w-xs truncate text-gray-300"
                                title={link.original_url}
                              >
                                {link.original_url}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-white font-semibold">
                                {link.click_count?.toLocaleString() || 0}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-gray-400">
                              {formatDate(link.created_at)}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                  title="View Analytics"
                                  onClick={() => {
                                    setActiveTab("analytics");
                                    // You might want to filter analytics for this link
                                  }}
                                >
                                  <BarChart3 className="h-4 w-4" />
                                </button>
                                <button
                                  className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                                  title="Copy Link"
                                  onClick={() => copyToClipboard(`ekrypt.vercel.app/${link.short_code}`)}
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
                                  onClick={() => router.push(`/edit/${link.id}`)}
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
                                  onClick={()=>{handleDeleteLink(link.id);}}
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - You might want to implement this later */}
                <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Showing 1 to {links.length} of {links.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      disabled
                      className="px-3 py-1 text-gray-400 border border-gray-700 rounded transition-colors cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded">
                      1
                    </button>
                    <button 
                      disabled
                      className="px-3 py-1 text-gray-400 border border-gray-700 rounded transition-colors cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
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