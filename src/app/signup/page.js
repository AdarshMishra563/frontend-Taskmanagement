'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setLoading(true);
    setTimeout(() => {
      alert(`Account created for ${username} (${email})`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-700">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Create Account</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg font-semibold transition"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            'Sign Up'
          )}
        </button>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-gray-300 underline hover:text-white">Login</Link>
        </p>
      </div>
    </div>
  );
}
