"use client";

import { articles } from "@/lib/politicsData";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100">
      
      {/* Navbar */}
      <nav className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-600 shadow-md text-white">
        <h1 className="text-2xl font-bold mb-3 md:mb-0">আমার ভোট</h1>
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
              alt="প্রোফাইল"
              className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer"
            />
          </Link>
          <Link
            href="/poll"
            className="px-5 py-2 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition font-semibold"
          >
            ভোট দিন
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-purple-800 mb-4">
          গণতান্ত্রিক বাংলাদেশ
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto text-lg md:text-xl">
          দেশের সকল নাগরিককে অংশগ্রহণের সুযোগ প্রদান করুন এবং সঠিক তথ্যের মাধ্যমে সচেতন থাকুন।
        </p>
      </section>

      {/* Articles Section */}
      <main className="px-6 pb-12 max-w-6xl mx-auto flex-1">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">রাজনৈতিক প্রবন্ধসমূহ</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={article.link}
                  alt={article.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-3 flex-1">{article.summary}</p>
                <p className="text-gray-400 text-sm">{article.date}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left">
            আমাদের লক্ষ্য: বাংলাদেশের জনগণকে গণতান্ত্রিকভাবে অংশগ্রহণের সুযোগ প্রদান এবং সঠিক তথ্য সরবরাহ।
          </p>
          <Link
            href="/feedback"
            className="px-5 py-2 bg-yellow-400 text-purple-800 rounded-full shadow hover:bg-yellow-500 transition font-semibold"
          >
            মতামত দিন
          </Link>
        </div>
      </footer>
    </div>
  );
}
