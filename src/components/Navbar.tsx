import Link from 'next/link';
import Logo from './Logo';

export function Navbar() {
  return (
    <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <Logo/>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Ekrypt
          </span>
        </div>
        
        {/* <div className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Features</Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Analytics</Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors font-medium">Pricing</Link>
        </div> */}
        
        <div className="flex items-center space-x-4">
          <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:text-white transition-colors hover:opacity-90">
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