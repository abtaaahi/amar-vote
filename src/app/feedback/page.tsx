"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function Feedback() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    category: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "feedback"), {
        ...formData,
        createdAt: Timestamp.now(),
      });

      router.push("/thankyou");
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("কিছু ভুল হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-100 via-green-200 to-green-100 flex items-center justify-center min-h-screen px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg border border-green-300">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-green-800">💬 আপনার মতামত দিন</h1>
          <p className="text-gray-600 text-sm mt-1">
            আপনার মতামত আমাদের জন্য গুরুত্বপূর্ণ। দয়া করে নিচের ফর্ম পূরণ করুন।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">নাম</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
              placeholder="রহিম উদ্দিন"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">ইমেইল</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">কোম্পানি (ঐচ্ছিক)</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
              placeholder="কোম্পানি নাম"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">শ্রেণী</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
              required
            >
              <option value="">একটি বেছে নিন</option>
              <option value="feedback">প্রতিক্রিয়া</option>
              <option value="support">সমর্থন</option>
              <option value="other">অন্যান্য</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">বার্তা</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
              rows={4}
              placeholder="আপনার বার্তা লিখুন..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold text-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? "পাঠানো হচ্ছে..." : "জমা দিন 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
