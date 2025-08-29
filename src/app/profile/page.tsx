"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    age: "",
    maritalStatus: "Single",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const user = auth.currentUser;

  const fetchUserData = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setFetching(true);
    setError("");
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          age: data.age || "",
          maritalStatus: data.maritalStatus || "Single",
        });
      } else {
        setError("User data not found. Please refresh the page.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please refresh and try again.");
      console.error(err);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, formData, { merge: true });
      setMessage("Your information has been updated successfully!");
    } catch (err) {
      setError("Update failed. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100">
        <p className="text-gray-600 text-lg mb-4">Loading...</p>
        <div className="loader border-t-4 border-purple-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-800">Your Profile</h1>

      {/* Profile Image */}
      <div className="mb-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/9815/9815472.png"
          alt="Profile Image"
          className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white"
        />
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className="w-full max-w-md mb-4 p-3 rounded-lg bg-green-100 text-green-800 font-medium text-center shadow">
          {message}
        </div>
      )}
      {error && (
        <div className="w-full max-w-md mb-4 p-3 rounded-lg bg-red-100 text-red-700 font-medium text-center shadow">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6">
        <form onSubmit={handleUpdate} className="space-y-4">

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

          <div>
            <label className="block text-purple-700 font-medium mb-1">Phone Number</label>
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

          <div>
            <label className="block text-purple-700 font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dhaka, Bangladesh"
              className="w-full p-3 rounded-xl bg-purple-50 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-xl font-bold shadow-lg hover:from-purple-700 hover:to-pink-600 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white p-3 rounded-xl font-bold shadow hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
