"use client";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Amar Vote</h1>
      <p className="text-gray-600 text-center mb-6">
        This is the landing page. From here, users can navigate to login, signup, or view blogs.
      </p>

      <div className="flex gap-4">
        <a
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </a>
        <a
          href="/signup"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Signup
        </a>
        <a
          href="/home"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Blogs
        </a>

          <a
          href="/feedback"
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          Feedback
        </a>
      </div>
    </div>
  );
}
