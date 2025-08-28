"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, collection } from "firebase/firestore";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    amount: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [queryData, setQueryData] = useState({
    party: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!searchParams) return;
    setQueryData({
      party: searchParams.get("party") || "",
      name: searchParams.get("name") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    // Redirect if not logged in
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.mobile) {
      setMessage("দয়া করে সব ফিল্ড পূরণ করুন।");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const voteRef = collection(db, "votes");

      await setDoc(doc(voteRef), {
        party: queryData.party,
        user: {
          name: queryData.name,
          email: queryData.email,
          phone: queryData.phone,
        },
        amountSent: formData.amount,
        mobileNumber: formData.mobile,
        createdAt: new Date(),
      });

      setMessage("আপনার ডোনেশন এবং ভোটের তথ্য সফলভাবে সংরক্ষিত হয়েছে!");
      router.push("/confirmation");
    } catch (error) {
      console.error(error);
      setMessage("সংরক্ষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        {queryData.party} দলের জন্য ডোনেশন করুন
      </h1>
      <p className="text-gray-700 mb-6 max-w-xl text-center">
        আপনার সহযোগিতা দলের জন্য গুরুত্বপূর্ণ। দয়া করে নিচের ফর্মটি পূরণ করুন।
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src="https://d2u0ktu8omkpf6.cloudfront.net/e5735c0126392fdf1a3b208bdbf5027266ecb4482f7af19c.jpg"
            alt="Donate illustration"
            className="rounded-lg shadow-md w-full h-64 md:h-80 lg:h-96 object-cover"
          />
        </div>

        {/* Payment form */}
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 w-full bg-white p-6 rounded-xl shadow space-y-4 flex flex-col"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">পঠানো টাকা (Amount)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="উদাহরণ: 500"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">bKash/Nagad মোবাইল নম্বর</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+8801XXXXXXXXX"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 text-white p-3 rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-700 transition"
          >
            {loading ? "সংরক্ষণ হচ্ছে..." : "ডোনেশন জমা দিন"}
          </button>

          {message && (
            <p className="mt-2 text-center text-green-600 font-medium">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
