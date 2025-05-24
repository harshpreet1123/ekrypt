'use client';

import Head from 'next/head';

export default function Layout({
  children,
  title = 'Ekrypt',
  description = 'Advanced URL Shortener',
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-70 animate-float"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-50 animate-float-delay"></div>
        </div>

        {children}

        {/* Global Styles */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-20px) translateX(10px); }
          }
          @keyframes float-delay {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(15px) translateX(-15px); }
          }
          .animate-float { animation: float 8s ease-in-out infinite; }
          .animate-float-delay { animation: float-delay 10s ease-in-out infinite; }
          .animate-fade-in { animation: fadeIn 0.5s ease-out; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}