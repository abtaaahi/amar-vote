"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { parties } from "@/lib/pollData";

// ✅ Define type for votes collection
interface VoteRecord {
  party: string;
  amountSent?: number | null;
  mobileNumber?: string | null;
  createdAt?: Timestamp;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

export default function PollPage() {
  const router = useRouter();
  const [selectedParty, setSelectedParty] = useState("");
  const [userData, setUserData] = useState<UserData>({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [voteHistory, setVoteHistory] = useState<VoteRecord | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // 1. Fetch user profile
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData({
            name: (data.name as string) || "",
            email: (data.email as string) || "",
            phone: (data.phone as string) || "",
          });
        }

        // 2. Check if vote already exists
        const q = query(
          collection(db, "votes"),
          where("user.email", "==", user.email)
        );
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const voteData = querySnap.docs[0].data() as VoteRecord;
          setVoteHistory(voteData);
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching your data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // ✅ If already voted → show history
  if (voteHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">
              ✅ Vote Already Submitted
            </h1>
            <p className="text-gray-500 mt-2">
              Below is your voting record for reference.
            </p>
          </div>

          {/* Voting Info Card */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-inner space-y-4">
            <div>
              <p className="text-sm text-gray-500">Party</p>
              <p className="text-lg font-semibold text-gray-800">{voteHistory.party}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{voteHistory.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{voteHistory.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{voteHistory.user.phone}</p>
              </div>
            </div>

            {voteHistory.amountSent && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Amount Sent</p>
                <p className="font-semibold text-green-600">{voteHistory.amountSent} Tk</p>
                <p className="text-sm text-gray-500 mt-1">Transaction: {voteHistory.mobileNumber}</p>
              </div>
            )}

            {voteHistory.createdAt && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Voted At</p>
                <p className="font-medium text-gray-800">
                  {new Date(voteHistory.createdAt.toDate()).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/home")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Otherwise → show voting form
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
