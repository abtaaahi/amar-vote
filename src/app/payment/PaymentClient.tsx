"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, collection } from "firebase/firestore";

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({ amount: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [queryData, setQueryData] = useState({
    party: "",
    name: "",
    email: "",
    phone: "",
  });

  // Get query params safely on client
  useEffect(() => {
    if (!searchParams) return;
    setQueryData({
      party: searchParams.get("party") || "",
      name: searchParams.get("name") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
    });
  }, [searchParams]);

  // Redirect if not logged in
  useEffect(() => {
    if (!auth.currentUser) router.push("/login");
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        // Optional donation (only save if provided)
        amountSent: formData.amount || null,
        mobileNumber: formData.mobile || null,
        createdAt: new Date(),
      });

      setMessage(
        formData.amount
          ? "Your vote and donation have been successfully recorded!"
          : "Your vote has been successfully recorded!"
      );
      router.push("/confirmation");
    } catch (error) {
      console.error(error);
      setMessage("Failed to save your vote. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Vote for {queryData.party}
      </h1>

      {/* Govt Tone Message */}
      <p className="text-gray-700 mb-6 max-w-xl text-center leading-relaxed">
        Dear voter,  
        By casting your vote, you are contributing to the progress of the country.  
        The Election Commission of Bangladesh has announced that a minimum amount 
        (approximately BDT 15) may be deducted from every voter’s account 
        (bKash/Nagad/Rocket/Bank Account) for the overall economic development of the country.  
        If you wish to donate an additional amount to support your candidate, you are welcome to do so.  
        However, this is completely optional. If you would like to donate, please fill in the form below.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        {/* Illustration */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src="https://d2u0ktu8omkpf6.cloudfront.net/e5735c0126392fdf1a3b208bdbf5027266ecb4482f7af19c.jpg"
            alt="Vote illustration"
            className="rounded-lg shadow-md w-full h-64 md:h-80 lg:h-96 object-cover"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 w-full bg-white p-6 rounded-xl shadow space-y-4 flex flex-col"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Voluntary Donation (Optional)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Example: 500 (leave blank if not donating)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              bKash/Nagad Mobile Number or Bank Account (Optional)
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+8801XXXXXXXXX (leave blank if not donating)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 text-white p-3 rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-700 transition"
          >
            {loading ? "Saving..." : "Confirm Vote"}
          </button>

          {message && (
            <p className="mt-2 text-center text-green-600 font-medium">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
