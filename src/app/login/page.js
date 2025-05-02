'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
const dispatch=useDispatch();

  const handleLogin = () => {
    dispatch(setUser({name:"adarsh",email:"am@gmail.com"}))
    setLoading(true);
    setTimeout(() => {
      alert(`Welcome, ${username}!`);
      setLoading(false);
    }, 2000);
  };
const data=useSelector((state)=>state.user);
console.log(data)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-700">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Task Management</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          onClick={handleLogin}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg font-semibold transition"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            'Login'
          )}
        </button>

        <div className="mt-4">
          <p className="text-center text-gray-400 text-sm mb-4">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-gray-300 underline hover:text-white">Sign Up</Link>
          </p>

         
          <div className="text-center">
            <Link href="/forgot-password" className="text-gray-400 text-sm hover:text-white">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
