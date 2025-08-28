"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";

interface Feedback {
  id: string;
  name: string;
  email: string;
  company: string;
  category: string;
  message: string;
  createdAt: string; // converted from Timestamp
}

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  age: string;
  maritalStatus: string;
  createdAt: string; // converted from Timestamp
}

interface Vote {
  id: string;
  party: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  amountSent: string;
  mobileNumber: string;
  createdAt: string; // converted from Timestamp
}

export default function AdminPage() {
  const [pinInput, setPinInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [voteList, setVoteList] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);

  const PIN_CODE = "9999";

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PIN_CODE) {
      setIsAuthorized(true);
      fetchData();
    } else {
      alert("পিন ভুল!");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Feedback
      const feedbackSnap = await getDocs(collection(db, "feedback"));
      const feedbackData: Feedback[] = feedbackSnap.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "-",
            email: data.email || "-",
            company: data.company || "-",
            category: data.category || "-",
            message: data.message || "-",
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toLocaleString()
                : data.createdAt || "-",
          };
        }
      );
      setFeedbackList(feedbackData);

      // Users
      const usersSnap = await getDocs(collection(db, "users"));
      const usersData: User[] = usersSnap.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "-",
            email: data.email || "-",
            phone: data.phone || "-",
            address: data.address || "-",
            age: data.age || "-",
            maritalStatus: data.maritalStatus || "-",
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toLocaleString()
                : data.createdAt || "-",
          };
        }
      );
      setUserList(usersData);

      // Votes
      const votesSnap = await getDocs(collection(db, "votes"));
      const votesData: Vote[] = votesSnap.docs.map(
        (doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          return {
            id: doc.id,
            party: data.party || "-",
            user: data.user || { name: "-", email: "-", phone: "-" },
            amountSent: data.amountSent || "-",
            mobileNumber: data.mobileNumber || "-",
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toLocaleString()
                : data.createdAt || "-",
          };
        }
      );
      setVoteList(votesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("ডেটা লোড করতে সমস্যা হয়েছে।");
    }
    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handlePinSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">অ্যাডমিন লগইন</h1>
          <input
            type="password"
            placeholder="পিন লিখুন"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            লগইন
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">অ্যাডমিন ড্যাশবোর্ড</h1>
      {loading ? (
        <p className="text-center">লোড হচ্ছে...</p>
      ) : (
        <div className="space-y-8">
          {/* Feedback Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Feedback</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-3 py-1">ID</th>
                    <th className="border border-gray-300 px-3 py-1">Name</th>
                    <th className="border border-gray-300 px-3 py-1">Email</th>
                    <th className="border border-gray-300 px-3 py-1">Company</th>
                    <th className="border border-gray-300 px-3 py-1">Category</th>
                    <th className="border border-gray-300 px-3 py-1">Message</th>
                    <th className="border border-gray-300 px-3 py-1">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((f) => (
                    <tr key={f.id}>
                      <td className="border border-gray-300 px-2 py-1">{f.id}</td>
                      <td className="border border-gray-300 px-2 py-1">{f.name}</td>
                      <td className="border border-gray-300 px-2 py-1">{f.email}</td>
                      <td className="border border-gray-300 px-2 py-1">{f.company}</td>
                      <td className="border border-gray-300 px-2 py-1">{f.category}</td>
                      <td className="border border-gray-300 px-2 py-1">{f.message}</td>
                      <td className="border border-gray-300 px-2 py-1">{f.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-3 py-1">ID</th>
                    <th className="border border-gray-300 px-3 py-1">Name</th>
                    <th className="border border-gray-300 px-3 py-1">Email</th>
                    <th className="border border-gray-300 px-3 py-1">Phone</th>
                    <th className="border border-gray-300 px-3 py-1">Address</th>
                    <th className="border border-gray-300 px-3 py-1">Age</th>
                    <th className="border border-gray-300 px-3 py-1">Marital Status</th>
                    <th className="border border-gray-300 px-3 py-1">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((u) => (
                    <tr key={u.id}>
                      <td className="border border-gray-300 px-2 py-1">{u.id}</td>
                      <td className="border border-gray-300 px-2 py-1">{u.name}</td>
                      <td className="border border-gray-300 px-2 py-1">{u.email}</td>
                      <td className="border border-gray-300 px-2 py-1">{u.phone}</td>
                      <td className="border border-gray-300 px-2 py-1">{u.address}</td>
                      <td className="border border-gray-300 px-2 py-1">{u.age}</td>
                      <td className="border border-gray-300 px-2 py-1">{u.maritalStatus}</td>
                      <td className="border border-gray-300 px-2 py-1">{u.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Votes Table */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Votes</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-3 py-1">ID</th>
                    <th className="border border-gray-300 px-3 py-1">Party</th>
                    <th className="border border-gray-300 px-3 py-1">User Name</th>
                    <th className="border border-gray-300 px-3 py-1">User Email</th>
                    <th className="border border-gray-300 px-3 py-1">User Phone</th>
                    <th className="border border-gray-300 px-3 py-1">Amount Sent</th>
                    <th className="border border-gray-300 px-3 py-1">Mobile Number</th>
                    <th className="border border-gray-300 px-3 py-1">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {voteList.map((v) => (
                    <tr key={v.id}>
                      <td className="border border-gray-300 px-2 py-1">{v.id}</td>
                      <td className="border border-gray-300 px-2 py-1">{v.party}</td>
                      <td className="border border-gray-300 px-2 py-1">{v.user.name}</td>
                      <td className="border border-gray-300 px-2 py-1">{v.user.email}</td>
                      <td className="border border-gray-300 px-2 py-1">{v.user.phone}</td>
                      <td className="border border-gray-300 px-2 py-1">{v.amountSent}</td>
                      <td className="border border-gray-300 px-2 py-1">{v.mobileNumber}</td>
                      <td className="border border-gray-300 px-2 py-1">{v.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
