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
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Submission Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Your vote has been successfully recorded.  
          Any additional information, including payment (if provided), has also been received.  
          Thank you for your participation.
        </p>
        <button
          onClick={handleHomeRedirect}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
}
