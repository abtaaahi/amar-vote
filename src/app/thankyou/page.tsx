"use client";

import { useRouter } from "next/navigation";

export default function ThankYou() {
  const router = useRouter();

  return (
    <div className="bg-green-950 flex items-center justify-center min-h-screen px-4">
      <div className="bg-gray-200 rounded-2xl shadow-xl p-8 w-full max-w-md text-center relative">
        {/* Close button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
        >
          &times;
        </button>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-green-900 mb-6">
          ধন্যবাদ
        </h1>

        {/* Icon (headset / message style) */}
        <div className="flex justify-center mb-6 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-20 h-20"
          >
            <path d="M12 1a10 10 0 00-10 10v2a2 2 0 002 2h1v-4H4v-1a8 8 0 1116 0v1h-1v4h1a2 2 0 002-2v-2A10 10 0 0012 1zm-2 13v2a2 2 0 004 0v-2h-4z" />
          </svg>
        </div>

        {/* Message */}
        <p className="text-gray-700 mb-8">
          আমরা শীঘ্রই আপনার বার্তা পৌঁছে দেব।.
        </p>

        {/* হোম বোতাম */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white shadow-md text-green-900 font-semibold hover:bg-gray-100 transition"
        >
          {/* Home icon (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-purple-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h4a1 1 0 001-1v-4h4v4a1 1 0 001 1h4a1 1 0 001-1V10"
            />
          </svg>
          হোম 
        </button>
      </div>
    </div>
  );
}
