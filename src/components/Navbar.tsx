// components/Navbar.jsx
"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-teal-600">
              Ekrypt
            </Link>
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
  );
};

export default Navbar;