"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    age: "",
    maritalStatus: "Single",
  });

  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await setPersistence(auth, browserLocalPersistence);

      // 1️⃣ Create Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const uid = userCredential.user.uid;

      // 2️⃣ Save additional info to Firestore
      await setDoc(doc(db, "users", uid), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        age: formData.age,
        maritalStatus: formData.maritalStatus,
        createdAt: new Date()
      });

      router.push("/home");
    }
    catch (error: unknown) {
      let message = "Signup failed.";
      
      if (error instanceof Error) {
        message = error.message;
      }

      console.error(error);
      setMessage(message);
    }
    setLoading(false);
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 p-4">
      <div className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        
        {/* Top Image */}
        <div className="w-full h-48">
          <img
            src="https://dwtyzx6upklss.cloudfront.net/Pictures/1024x536/3/5/7/21357_pri_boardelections_hero_777797.png"
            alt="Signup Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-6">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h1>

          {message && (
            <p className="mb-4 text-center text-green-700 font-medium">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">পুরো নাম</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="রহিম উদ্দিন"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">মোবাইল নম্বর</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+8801XXXXXXXXX"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

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
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">ঠিকানা</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="ঢাকা, বাংলাদেশ"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">বয়স</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="২৫"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">বৈবাহিক অবস্থা</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="Single">একক</option>
                <option value="Married">বিবাহিত</option>
                <option value="Divorced">তালাকপ্রাপ্ত</option>
                <option value="Widowed">বিধবা/বিধুর</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-pink-600 transition"
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইনআপ করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}