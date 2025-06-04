"use client";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import {
  BarChart3,
  Link2,
  MousePointer,
  Loader2,
  AlertTriangle,
  Download,
} from "lucide-react";
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
import { QRCodeCanvas } from "qrcode.react";
import { useParams } from "next/navigation";

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

// const qrCodeTemplates = [
//   {
//     name: "Default",
//     fgColor: "#000000",
//     bgColor: "#ffffff",
//     level: "H",
//   },
//   {
//     name: "Dark",
//     fgColor: "#ffffff",
//     bgColor: "#1f2937",
//     level: "H",
//   },
//   {
//     name: "Blue",
//     fgColor: "#3B82F6",
//     bgColor: "#ffffff",
//     level: "H",
//   },
//   {
//     name: "Purple",
//     fgColor: "#8B5CF6",
//     bgColor: "#ffffff",
//     level: "H",
//   },
// ];

export default function SingleLinkView() {
    const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);
  const [link, setLink] = useState<Link | null>(null);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const router = useRouter();

  // Processed analytics data
  const [clicksOverTime, setClicksOverTime] = useState<ChartData[]>([]);
  const [osData, setOsData] = useState<PieChartData[]>([]);
  const [browserData, setBrowserData] = useState<BarChartData[]>([]);
  const [countryData, setCountryData] = useState<BarChartData[]>([]);
  const [deviceData, setDeviceData] = useState<PieChartData[]>([]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const processAnalyticsData = useCallback((analyticsData: Analytics[]) => {
    // Process clicks over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const clicksByDate: ChartData[] = last7Days.map((date) => {
      const clicksOnDate = analyticsData.filter(
        (analytics) => analytics.timestamp.split("T")[0] === date
      ).length;
      return { date, clicks: clicksOnDate };
    });

    setClicksOverTime(clicksByDate);

    // Process OS data
    const osStats: Record<string, number> = {};
    analyticsData.forEach((analytics) => {
      const os = analytics.os || "Unknown";
      osStats[os] = (osStats[os] || 0) + 1;
    });

    const osDataProcessed: PieChartData[] = Object.entries(osStats)
      .map(([name, value], index) => ({
        name,
        value,
        color: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"][
          index % 5
        ],
      }))
      .slice(0, 5);

    setOsData(osDataProcessed);

    // Process browser data
    const browserStats: Record<string, number> = {};
    analyticsData.forEach((analytics) => {
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
    analyticsData.forEach((analytics) => {
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
    analyticsData.forEach((analytics) => {
      const device = analytics.device_type || "Unknown";
      deviceStats[device] = (deviceStats[device] || 0) + 1;
    });

    const deviceDataProcessed: PieChartData[] = Object.entries(deviceStats).map(
      ([name, value], index) => ({
        name,
        value,
        color: ["#3B82F6", "#8B5CF6", "#10B981"][index % 3],
      })
    );

    setDeviceData(deviceDataProcessed);
  }, []);

  const fetchLinkData = useCallback(
    async (userId: string) => {
      try {
        // Fetch the link
        const { data: linkData, error: linkError } = await supabase
          .from("links")
          .select("*")
          .eq("short_code", params.shortcode)
          .single();

        if (linkError) throw linkError;

        // If link doesn't belong to user, redirect to public URL
        if (linkData.user_id !== userId) {
          router.push(`/${params.shortcode}`);
          return;
        }

        setLink(linkData as Link);

        // Fetch analytics for this link
        const { data: analyticsData, error: analyticsError } = await supabase
          .from("analytics")
          .select("*")
          .eq("link_id", linkData.id)
          .order("timestamp", { ascending: false });

        if (analyticsError) throw analyticsError;

        const typedAnalyticsData = (analyticsData || []) as Analytics[];
        setAnalytics(typedAnalyticsData);

        // Process data
        processAnalyticsData(typedAnalyticsData);
      } catch (err) {
        console.error("Error fetching link data:", err);
        throw err;
      }
    },
    [params.shortcode, router, processAnalyticsData]
  );

  // Fetch user session and data
  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          router.push(`/${params.shortcode}`);
          return;
        }

        setUser(session.user);
        await fetchLinkData(session.user.id);
      } catch (err) {
        console.error("Error loading link page:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchData();
  }, [router, params.shortcode, fetchLinkData]);

  const downloadQRCode = () => {
    if (!link) return;

    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `ekrypt-${link.short_code}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-300">Loading link analytics...</p>
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

  if (!link) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Link Not Found</h2>
          <p className="text-gray-300 mb-6">
            The link you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ekrypt Analytics
            </span>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Link Info Header */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {link.title || "Untitled Link"}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <p className="text-gray-400 mb-1">Short URL</p>
                  <p
                    className="font-mono text-blue-400 hover:underline cursor-pointer"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `ekrypt.vercel.app/${link.short_code}`
                      )
                    }
                  >
                    ekrypt.vercel.app/{link.short_code}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Original URL</p>
                  <p className="text-gray-300 max-w-xs truncate">
                    {link.original_url}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeCanvas
                  id="qr-code"
                  value={`https://ekrypt.vercel.app/${link.short_code}`}
                  size={100}
                  level="H"
                />
              </div>
              <button
                onClick={downloadQRCode}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              {link.click_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Created on {formatDate(link.created_at)}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Status</h3>
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Link2 className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2 capitalize">
              {link.is_active ? "Active" : "Inactive"}
            </div>
            <div className="text-sm text-gray-400">
              {link.expires_at
                ? `Expires on ${formatDate(link.expires_at)}`
                : "No expiration"}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-300">
                Last Click
              </h3>
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {analytics.length > 0
                ? formatDateTime(analytics[0].timestamp)
                : "Never"}
            </div>
            <div className="text-sm text-gray-400">
              {analytics.length > 0
                ? `${analytics.length} total records`
                : "No clicks yet"}
            </div>
          </div>
        </div>

        {analytics.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-md p-12 rounded-xl border border-gray-700 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Analytics Data Yet
            </h3>
            <p className="text-gray-400">
              Share your link to start seeing analytics data
            </p>
          </div>
        ) : (
          <>
            {/* Clicks Over Time Chart */}
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold mb-6">
                Clicks Over Time (Last 7 Days)
              </h3>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
          </>
        )}
      </div>
    </div>
  );
}
