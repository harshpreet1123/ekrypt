"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  Copy, 
  Check, 
  Loader2, 
  BarChart2, 
  Shield, 
  Settings, 
  Globe, 
  Twitter, 
  Github, 
  Instagram, 
  Facebook 
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    };

    checkSession();
  }, [router]);

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
      const { error: insertError } = await supabase
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
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
                    <Check className="h-6 w-6 text-green-400" />
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
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="mt-3 text-sm text-gray-400">
                  <p>This link will expire in 7 days. <a 
                    className="text-blue-400 hover:underline"
                    onClick={() => router.push('/signup')}
                  >
                    Create an account
                  </a> to make permanent links and access advanced analytics.</p>
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
                icon: <BarChart2 className="h-8 w-8" />,
                title: "Advanced Analytics",
                description:
                  "Track clicks, locations, devices, and more with our comprehensive dashboard.",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Secure Links",
                description:
                  "Password protection, expiration dates, and link encryption keep your content safe.",
              },
              {
                icon: <Settings className="h-8 w-8" />,
                title: "Customization",
                description:
                  "Customize your links with UTM parameters and track campaign performance.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors group"
              >
                <div className="w-14 h-14 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-opacity-30 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Analytics Preview Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 bg-gray-800 bg-opacity-30 rounded-3xl my-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Detailed Link Analytics
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Understand your audience with comprehensive click data
            </p>
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Geographic Data",
                description: "See where your clicks are coming from by country and city",
                icon: <Globe className="h-6 w-6 text-white" />
              },
              {
                title: "Device Breakdown",
                description: "Know what devices your visitors are using",
                icon: <Settings className="h-6 w-6 text-white" />
              },
              {
                title: "Click Timeline",
                description: "Monitor when your links get the most engagement",
                icon: <BarChart2 className="h-6 w-6 text-white" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="mr-4 p-2 bg-blue-600 bg-opacity-20 rounded-lg">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-300 pl-14">{item.description}</p>
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
              <button 
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-opacity-90 transition-opacity"
                onClick={() => router.push('/signup')}
              >
                Get Started for Free
              </button>
              <button 
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition-colors"
                onClick={() => router.push('/pricing')}
              >
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
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  Company
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Contact
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
                {[
                  { icon: <Twitter className="h-6 w-6" />, name: "Twitter" },
                  { icon: <Github className="h-6 w-6" />, name: "GitHub" },
                  { icon: <Instagram className="h-6 w-6" />, name: "Instagram" },
                  { icon: <Facebook className="h-6 w-6" />, name: "Facebook" }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
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