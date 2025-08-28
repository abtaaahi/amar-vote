"use client";

import { useRouter } from "next/navigation";

export default function ConfirmationPage() {
  const router = useRouter();

  const handleHomeRedirect = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          আপনার লেনদেন সফল হয়েছে!
        </h1>
        <p className="text-gray-700 mb-6">
          আপনার ভোট এবং লেনদেন তথ্য সফলভাবে গ্রহণ করা হয়েছে। 
          ধন্যবাদ আপনার অংশগ্রহণের জন্য।
        </p>
        <button
          onClick={handleHomeRedirect}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    </div>
  );
}
