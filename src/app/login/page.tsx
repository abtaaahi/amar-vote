"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in → redirect to home
        router.push("/home");
      }
    });

    return () => unsubscribe(); // cleanup
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    await setPersistence(auth, browserLocalPersistence);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/home"); // redirect on successful login
    } catch (error: unknown) {
    let msg = "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";

    if (error instanceof Error) {
      // Check if error has a 'code' property
      const firebaseError = error as { code?: string };
      const code = firebaseError.code;

      switch (code) {
        case "auth/user-not-found":
          msg = "এই ইমেইল দিয়ে কোনো ব্যবহারকারী পাওয়া যায়নি।";
          break;
        case "auth/wrong-password":
          msg = "পাসওয়ার্ড ভুল হয়েছে। আবার চেষ্টা করুন।";
          break;
        case "auth/invalid-email":
          msg = "ইমেইল সঠিক নয়।";
          break;
        case "auth/too-many-requests":
          msg = "অনেকবার ভুল হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
          break;
        default:
          msg = "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      }
    }

    setMessage(msg);
  }

    setLoading(false);
  };

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100">
      <div className="w-full max-w-md bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Top Image */}
        <div className="w-full h-48">
          <img
            src="https://today.uconn.edu/wp-content/uploads/2024/10/Voting_UCT-998x665.jpg"
            alt="Login Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-6">
            লগইন করুন
          </h1>

          {message && (
            <p className="mb-4 text-center text-red-600 font-medium">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">ইমেইল</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">পাসওয়ার্ড</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 font-medium"
                >
                  {showPassword ? "লুকান" : "দেখান"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-pink-600 transition"
            >
              {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>

          {/* Signup */}
          <p className="mt-5 text-center text-purple-700">
            নতুন ব্যবহারকারী?{" "}
            <Link
              href="/signup"
              className="font-semibold underline hover:text-pink-600"
            >
              সাইনআপ করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
