"use client";

import Link from "next/link";
import {
  IconHome,
  IconArrowLeft,
  IconSearch,
} from "@tabler/icons-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="relative mb-12">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gray-100 rounded-full opacity-50" />
          <div className="absolute top-20 -right-10 w-24 h-24 bg-gray-200 rounded-full opacity-30" />
          <div className="absolute bottom-0 left-40 w-16 h-16 bg-gray-300 rounded-full opacity-20" />
          
          {/* 404 text */}
          <div className="text-center">
            <h1 className="text-9xl font-bold text-gray-900 tracking-tighter">
              4<span className="text-zinc-400">0</span>4
            </h1>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto mb-8 text-lg">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for something else..."
                className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500/30 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black text-white font-medium text-sm transition-colors hover:bg-gray-800 shadow-sm w-full sm:w-auto"
          >
            <IconHome className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm transition-colors hover:bg-gray-50 shadow-sm w-full sm:w-auto"
          >
            <IconArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      {/* Decorative pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-20"></div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-[url('/wave.svg')] bg-repeat-x bg-bottom opacity-10"></div>
    </div>
  );
}