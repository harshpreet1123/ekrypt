import { ReactNode } from 'react';
import Logo from './Logo';

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
        <Logo/>
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