"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleShorten = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e: unknown) {
      console.log(e);
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const shortCode = generateShortCode();

      // Insert the new link into Supabase
      const { data, error: insertError } = await supabase
        .from("links")
        .insert([
          {
            original_url: url,
            short_code: shortCode,
            is_active: true,
            click_count: 0,
          },
        ])
        .select()
        .single();

      console.log(data);

      if (insertError) throw insertError;

      // Construct the shortened URL
      const shortened = `${window.location.origin}/${shortCode}`;
      setShortenedUrl(shortened);
    } catch (error) {
      console.error("Error shortening URL:", error);
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      title="Ekrypt | Advanced URL Shortener"
      description="Shorten, track, and optimize your links with powerful analytics"
    >
      <Navbar />

      <div className="relative z-10">
        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Shorten, Track & Optimize
              </span>
              <br />
              Your Links Like Never Before
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ekrypt provides powerful URL shortening with detailed analytics to
              help you understand your audience and maximize engagement.
            </p>
          </div>

          {/* URL Shortener Card */}
          <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-1 shadow-2xl border border-gray-700 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long URL here..."
                className="flex-grow px-6 py-4 bg-gray-900 bg-opacity-50 focus:outline-none text-white placeholder-gray-500"
              />
              <button
                onClick={handleShorten}
                disabled={isLoading}
                className={`px-8 py-4 font-bold ${
                  isLoading
                    ? "bg-blue-700"
                    : "bg-gradient-to-r from-blue-600 to-purple-600"
                } hover:opacity-90 transition-opacity flex items-center justify-center`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Processing...
                  </>
                ) : (
                  "Shorten URL"
                )}
              </button>
            </div>

            {error && (
              <div className="px-6 py-3 bg-red-900 bg-opacity-30 text-red-300">
                {error}
              </div>
            )}

            {shortenedUrl && (
              <div className="px-6 py-4 bg-gray-900 bg-opacity-30 border-t border-gray-700 animate-fade-in">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-400"
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
                    <a
                      href={shortenedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {shortenedUrl}
                    </a>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(shortenedUrl)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
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
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats Preview */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10M+", label: "Links Shortened" },
              { value: "500K+", label: "Active Users" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </main>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to optimize your links and understand your
              audience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
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
                ),
                title: "Advanced Analytics",
                description:
                  "Track clicks, locations, devices, and more with our comprehensive dashboard.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
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
                ),
                title: "Secure Links",
                description:
                  "Password protection, expiration dates, and link encryption keep your content safe.",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                title: "Custom Branding",
                description:
                  "Use your own domain and customize links to match your brand identity.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors group"
              >
                <div className="w-14 h-14 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center text-blue-400 mb-6 group-hover:bg-opacity-30 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Links?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of businesses and marketers who trust Ekrypt for
              their link management needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-opacity-90 transition-opacity">
                Get Started for Free
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition-colors">
                See Pricing
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-gray-900 bg-opacity-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Ekrypt</h3>
                <p className="text-gray-400">
                  The most powerful URL shortener with advanced analytics and
                  customization.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Product
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      API
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Resources
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Legal
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                {["Twitter", "Facebook", "Instagram", "LinkedIn"].map(
                  (social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )
                )}
              </div>
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Ekrypt. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
