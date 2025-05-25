/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface LinkData {
  id: string;
  original_url: string;
  title: string | null;
  password_hash: string | null;
  expires_at: string | null;
  is_active: boolean;
  click_count: number;
  max_clicks: number | null;
  one_time_only: boolean;
}

// Helper function to detect device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|phone|tablet/.test(userAgent)) {
    if (/tablet|ipad/.test(userAgent)) return "tablet";
    return "mobile";
  }
  return "desktop";
};

// Helper function to extract browser info
const getBrowserInfo = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    return "Safari";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("Opera")) return "Opera";
  return "Unknown";
};

// Helper function to extract OS info
const getOSInfo = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Mac OS X") || userAgent.includes("macOS"))
    return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (
    userAgent.includes("iOS") ||
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  )
    return "iOS";
  return "Unknown";
};

// Helper function to detect if it's a bot
const isBot = (): boolean => {
  const botPatterns = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "telegram",
    "googlebot",
    "bingbot",
    "slackbot",
    "discordbot",
  ];
  const userAgent = navigator.userAgent.toLowerCase();
  return botPatterns.some((pattern) => userAgent.includes(pattern));
};

// Helper function to get user's IP and country (using a free service)
const getLocationData = async (): Promise<{ ip: string; country: string }> => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      ip: data.ip || "Unknown",
      country: data.country_name || "Unknown",
    };
  } catch (error) {
    console.warn("Failed to get location data:", error);
    return { ip: "Unknown", country: "Unknown" };
  }
};

export default function RedirectPage({ shortCode }: { shortCode: string }) {
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [analyticsStored, setAnalyticsStored] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("links")
          .select("*")
          .ilike("short_code", shortCode.trim())
          .is("deleted_at", null)
          .limit(1);

        if (error) throw error;
        if (!data || data.length === 0) {
          router.replace("/not-found");
          throw new Error("Link not found");
        }

        const link = data[0];

        // Check if link is active
        if (!link.is_active) {
          throw new Error("This link has been deactivated");
        }

        // Check if link is expired
        if (link.expires_at && new Date(link.expires_at) < new Date()) {
          throw new Error("This link has expired");
        }

        // Check if max clicks reached
        if (link.max_clicks && link.click_count >= link.max_clicks) {
          throw new Error("Maximum clicks reached for this link");
        }

        setLinkData(link);

        // If no password required, mark as verified
        if (!link.password_hash) {
          setIsPasswordVerified(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLinkData();
  }, [shortCode]);

  useEffect(() => {
    if (!isPasswordVerified || !linkData) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPasswordVerified, linkData]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (!linkData?.password_hash) {
      setIsPasswordVerified(true);
      return;
    }

    try {
      // Verify password with bcrypt
      const isMatch = await bcrypt.compare(password, linkData.password_hash);
      if (isMatch) {
        setIsPasswordVerified(true);
        setPasswordError("");
      } else {
        setPasswordError("Incorrect password");
      }
    } catch (err) {
      setPasswordError("Error verifying password");
    }
  };

  // Function to store analytics data
  const storeAnalytics = async (linkId: string) => {
    // Prevent duplicate analytics entries
    if (analyticsStored) return;

    try {
      setAnalyticsStored(true);

      // Get location data
      const locationData = await getLocationData();

      // Prepare analytics data
      const analyticsData = {
        link_id: linkId,
        timestamp: new Date().toISOString(),
        ip: locationData.ip,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        country: locationData.country,
        browser: getBrowserInfo(),
        os: getOSInfo(),
        device_type: getDeviceType(),
        is_bot: isBot(),
      };

      console.log("Storing analytics data:", analyticsData);

      // Insert analytics data into Supabase
      const { error: analyticsError } = await supabase
        .from("analytics")
        .insert([analyticsData]);

      if (analyticsError) {
        console.error("Failed to store analytics:", analyticsError);
        setAnalyticsStored(false); // Reset on error to allow retry
        // Don't throw error here - analytics failure shouldn't block redirect
      } else {
        console.log("Analytics data stored successfully");
      }
    } catch (error) {
      console.error("Error storing analytics:", error);
      setAnalyticsStored(false); // Reset on error to allow retry
      // Don't throw error here - analytics failure shouldn't block redirect
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRedirect = async () => {
    if (!linkData) return;

    try {
      setIsRedirecting(true);

      // Store analytics data before redirect
      await storeAnalytics(linkData.id);

      // Update click count in Supabase
      if (!linkData.one_time_only) {
        await supabase
          .from("links")
          .update({ click_count: linkData.click_count + 1 })
          .eq("short_code", shortCode);
      } else {
        // For one-time links, deactivate after use
        await supabase
          .from("links")
          .update({ is_active: false, click_count: linkData.click_count + 1 })
          .eq("short_code", shortCode);
      }

      // Perform redirect
      window.location.href = linkData.original_url;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to redirect. Please try again.");
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-xl text-gray-300 mb-8">{error}</p>

          <a
            // href="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity inline-block"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (linkData?.password_hash && !isPasswordVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-md mx-auto px-6 py-20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Password Required</h1>
            <p className="text-gray-300">
              This link is protected with a password
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700">
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    passwordError ? "border-red-500" : "border-gray-600"
                  }`}
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-400">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="animate-spin h-12 w-12"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
          <p className="text-gray-300">Taking you to your destination</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 text-center">
        <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <div className="text-4xl font-bold">{countdown}</div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Redirecting in {countdown}
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          You will be automatically redirected to your destination
        </p>

        {linkData?.title && (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-lg font-semibold mb-2 text-green-400">
              {linkData.title}
            </h3>
            <p className="text-gray-400 text-sm break-all">
              Destination: {linkData.original_url}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleRedirect}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Go Now
          </button>
          <a
            // href="/"
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-center"
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
