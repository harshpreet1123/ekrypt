import { ReactNode } from 'react';

interface AuthFormProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthForm({ 
  title, 
  subtitle, 
  children, 
  footerText, 
  footerLinkText, 
  footerLinkHref 
}: AuthFormProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo/Branding */}
      <div className="flex flex-col items-center mb-10">
        <div className="p-3 bg-blue-600 rounded-xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Ekrypt
        </h1>
        {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
      </div>

      {/* Auth Card */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        
        {children}

        <div className="mt-6 text-center text-sm text-gray-400">
          {footerText}{' '}
          <a href={footerLinkHref} className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
            {footerLinkText}
          </a>
        </div>

      </div>

      {/* Footer Links */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
        <span className="mx-2">•</span>
        <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
        <span className="mx-2">•</span>
        <a href="#" className="hover:text-gray-300 transition-colors">Contact Us</a>
      </div>
    </div>
  );
}