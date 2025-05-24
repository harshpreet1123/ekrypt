import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Ekrypt
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Features</Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Analytics</Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Pricing</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/login" className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}