"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const RedirectPageClient = ({ shortCode }: { shortCode: string }) => {
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(`/api/links/${shortCode}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setDestination(data.destination);
          setLoading(false);
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Error redirecting");
          setLoading(false);
        }
      } catch (err) {
        setError("An error occurred while processing your request");
        setLoading(false);
      }
    };

    fetchLink();
  }, [shortCode]);

  useEffect(() => {
    if (!loading && destination && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && destination) {
      window.location.href = destination;
    }
  }, [countdown, destination, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Preparing your redirect...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
        {/* Navbar - Same as create link page */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-teal-600">Ekrypt</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/features"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Error Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Redirect Error
            </h2>
            <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
              {error}
            </div>
            <Link
              href="/"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      {/* Navbar - Same as create link page */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-teal-600">Ekrypt</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/features"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/faq"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Redirect Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Redirecting...
          </h2>
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={(283 * (5 - countdown)) / 5}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-teal-600">
                {countdown}
              </span>
            </div>
            <p className="text-gray-600 mb-6">
              You're being redirected to:{" "}
              <span className="text-teal-600 break-all">{destination}</span>
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => (window.location.href = destination)}
              className="w-full bg-gradient-to-r from-teal-600 to-amber-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
            >
              Skip Wait ({countdown}s)
            </button>
            <Link
              href="/"
              className="inline-block text-gray-600 hover:text-teal-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectPageClient;
