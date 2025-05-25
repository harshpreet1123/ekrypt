"use client";
import Logo from "@/components/Logo";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600 rounded-full filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-50 animate-float-delay"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-600 rounded-full filter blur-3xl opacity-40 animate-float-slow"></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-bounce-slow"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-40 animate-bounce-delay"></div>
        <div className="absolute bottom-40 left-1/3 w-10 h-10 bg-pink-500 rounded-full opacity-25 animate-bounce-slow"></div>
        <div className="absolute bottom-60 right-1/3 w-4 h-4 bg-indigo-500 rounded-full opacity-35 animate-bounce"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ekrypt
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <p
              onClick={() => {
                router.replace("/");
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create Link
            </p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Image */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/link_not_found.png"
              alt="Link Not Found"
              width={400}
              height={300}
              className="w-full max-w-md"
            />
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Either link is deleted or not exist, please check the link or try
              contact with link provider.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href="#"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity transform hover:scale-105"
            >
              Create New Link
            </a>
            <a
              href="#"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-lg transition-colors transform hover:scale-105"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes float-delay {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(15px) translateX(-15px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes bounce-delay {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-bounce-delay {
          animation: bounce-delay 4s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
}
