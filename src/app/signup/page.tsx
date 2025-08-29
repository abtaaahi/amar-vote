"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

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
            Create a New Account
          </h1>

          {message && (
            <p className="mb-4 text-center text-green-700 font-medium">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">Email</label>
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
              <label className="block text-purple-700 font-medium mb-1">Password</label>
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
              <label className="block text-purple-700 font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="New York, USA"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-purple-700 font-medium mb-1">Marital Status</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-pink-600 transition"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
