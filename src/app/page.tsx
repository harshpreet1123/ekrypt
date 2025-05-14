"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Home = () => {
  const [url, setUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [oneTimeOnly, setOneTimeOnly] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCreateLink = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setSuccess("");
    try {
      const body = {
        originalUrl: url,
        expiresAt: expiresAt || null,
        oneTimeOnly,
      };

      const res = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // You need to stringify the body
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(
          `Your short URL: ${process.env.NEXT_PUBLIC_SITE_URL}/${data.shortUrl}`
        );
        setUrl("");
        setExpiresAt("");
        setOneTimeOnly(false);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("An error occurred while creating the link");
      console.error(err); // Log the error for debugging
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">
              Shorten, Share and <span className="text-teal-600">Track</span>{" "}
              Your Links
            </h1>
            <p className="text-lg text-gray-600">
              Ekrypt helps you create short, memorable links that you can share
              anywhere. Perfect for social media, marketing campaigns, and more.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">
                  Create short links instantly
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">
                  Set expiration dates for links
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">Create one-time use links</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-gray-700">
                  Basic analytics for all links
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Create Your Short Link
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter your long URL
                </label>
                <input
                  type="url"
                  id="url"
                  placeholder="https://example.com/very-long-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-black"
                />
              </div>

              <div>
                <label
                  htmlFor="expiresAt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expiration date (optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="oneTimeOnly"
                  checked={oneTimeOnly}
                  onChange={(e) => setOneTimeOnly(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="oneTimeOnly"
                  className="ml-2 block text-sm text-gray-700"
                >
                  One-time use only
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-teal-50 text-teal-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                onClick={handleCreateLink}
                className="w-full bg-gradient-to-r from-teal-600 to-amber-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
              >
                Create Short Link
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By creating a link, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
