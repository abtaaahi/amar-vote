"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/home");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 gap-8">
      
      {/* Left: Text & buttons */}
      <div className="flex flex-col items-center md:items-start max-w-md text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Amar Vote এ আপনাকে স্বাগতম
        </h1>
        <p className="text-gray-700 mb-6">
          এখানে আপনি আপনার পছন্দের রাজনৈতিক দলের জন্য ভোট দিতে পারবেন এবং সাম্প্রতিক রাজনৈতিক প্রবন্ধ ও খবর দেখতে পারবেন।
        </p>

        {/* Hint text */}
        <p className="text-gray-600 mb-2">ভোট দিতে বা আপনার অ্যাকাউন্ট ব্যবহারের জন্য লগইন করুন:</p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <a
            href="/login"
            className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition"
          >
            Login
          </a>
          <a
            href="/signup"
            className="flex-1 text-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow hover:from-green-600 hover:to-green-800 transition"
          >
            Signup করুন
          </a>
        </div>

        <p className="text-gray-600 mt-4">
          নতুন ব্যবহারকারী? <a href="/signup" className="text-green-700 font-semibold hover:underline">এখান থেকে সাইন আপ করুন</a>
        </p>
      </div>

      {/* Right: Image placeholder */}
      <div className="w-full max-w-sm">
        <img
          src="https://eastasiaforum.org/wp-content/uploads/2023/02/2022-12-10T000000Z_671759535_MT1NURPHO0000J7OSZ_RTRMADP_3_SOCIAL-ISSUE-BANGLADESH-min-scaled-1024x682-c-default.webp" // replace with your image link
          alt="Amar Vote"
          className="w-full rounded-xl shadow-lg object-cover"
        />
      </div>
    </div>
  );
}
