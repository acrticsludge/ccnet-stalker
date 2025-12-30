"use client";
import { useState } from "react";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <div
          className="
          rounded-3xl
          border border-black/10
          bg-white/80 backdrop-blur-xl
          px-10 py-12
          shadow-2xl
          text-center
        "
        >
          <div className="inline-block mb-4 rounded-full border border-black/10 bg-black/5 px-4 py-1 text-sm text-black/70">
            Login
          </div>
          {success && (
            <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
              Logging in...
            </div>
          )}
          <h1 className="text-2xl font-semibold mb-4">Login</h1>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Discord ID
              </label>
              <input
                id="Id"
                type=""
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter your Discord ID"
                className="w-full px-3 py-2 border rounded focus:outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-black/20 to-transparent" />

          <p className="text-sm text-black/50">
            DM acrticsludge on Discord for access
          </p>
        </div>
      </div>
    </div>
  );
}
