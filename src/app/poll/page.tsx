"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { parties } from "@/lib/pollData";

export default function PollPage() {
  const router = useRouter();
  const [selectedParty, setSelectedParty] = useState("");
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        } else {
          alert("User information not found. Please refresh the page.");
        }
      } catch (error) {
        console.error(error);
        alert("There was a problem fetching your user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParty) {
      alert("Please select a political party before continuing!");
      return;
    }

    router.push(
      `/payment?party=${encodeURIComponent(selectedParty)}&name=${encodeURIComponent(
        userData.name
      )}&email=${encodeURIComponent(userData.email)}&phone=${encodeURIComponent(userData.phone)}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Cast Your Vote for Your Preferred Political Party
      </h1>
      <p className="text-gray-700 mb-6 max-w-xl text-center">
        Your vote matters. It is an important part of the democratic process and
        plays a role in shaping the future of the country. Please select a party
        below and confirm your vote.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src="https://d2u0ktu8omkpf6.cloudfront.net/e5735c0126392fdf1a3b208bdbf5027266ecb4482f7af19c.jpg"
            alt="Voting illustration"
            className="rounded-lg shadow-md w-full h-64 md:h-80 lg:h-96 object-cover md:object-contain"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 w-full bg-white p-6 rounded-xl shadow space-y-4 flex flex-col"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Select a Political Party:
          </h2>
          {parties.map((party) => (
            <label
              key={party.id}
              className="flex items-center gap-3 p-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="radio"
                name="party"
                value={party.name}
                checked={selectedParty === party.name}
                onChange={(e) => setSelectedParty(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="text-gray-800 font-medium">{party.name}</span>
            </label>
          ))}

          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 text-white p-3 rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-700 transition"
          >
            Submit Vote
          </button>
        </form>
      </div>
    </div>
  );
}
