'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout, setUser } from '../store/userSlice';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { animate, motion, stagger, useAnimate } from 'framer-motion';

export default function Login() {
  const [error, seterror] = useState("");
  const [hide, sethide] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
const [scope, animate] = useAnimate();
  const handleLogin = async () => {
    if (!email.trim()) {
      seterror('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      seterror('Please enter a valid email address');
      return;
    }
    if (!password) {
      seterror('Password is required');
      return;
    }
    if (password.length < 6) {
      seterror('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      seterror("");
      const res = await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/login", {email, password});
      if (res?.data?.token) {
        dispatch(setUser({user: res?.data?.token, email: email}));
        router.push("/dashboard");
      }
    } catch (err) {
      dispatch(logout());
      seterror(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    animate(".letter", 
      { 
        opacity: [0, 1],
        filter: ['blur(5px)', 'blur(0px)'],
      },
      { 
        duration: 0.4,
        delay: stagger(0.08),
        ease: "easeOut"
      }
    );
  }, [animate]);
   return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-black">
      
       <div ref={scope} className="text-center py-16">
      <h1 className="text-6xl font-bold text-gray-400 tracking-tight">
        {"TASK MANAGEMENT".split("").map((letter, i) => (
          <motion.span
            key={i}
            className="letter inline-block opacity-0"
            style={{ 
              minWidth: letter === ' ' ? '0.5em' : 'auto' 
            }}
          >
            {letter}
          </motion.span>
        ))}
      </h1>
    </div>

    
      <motion.div 
        className="mx-auto w-full max-w-md px-8"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 50,
          delay: 0.8
        }}
      >
        <div className="space-y-6">
          
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 rounded-none border-b border-gray-600"
            />
          </div>

          <div className="relative">
            <input
              type={hide ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 rounded-none border-b border-gray-600"
            />
            <button 
              onClick={() => sethide(!hide)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-300"
            >
              {hide ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

        
          <div className="flex items-center h-6">
            {error && (
              <motion.span 
                className="text-red-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.span>
            )}
            <Link
              href="/forgot-password"
              className="ml-auto text-sm text-gray-500 hover:text-gray-400"
            >
              Forgot Password?
            </Link>
          </div>

          
          <motion.button
            onClick={handleLogin}
            className="w-full py-4 bg-gradient-to-r from-black to-gray-300 text-gray-100 font-bold tracking-wide rounded-lg shadow-md hover:shadow-gray-500/20 transition-all"
            disabled={loading}
            whileHover={{ 
              background: 'linear-gradient(to right, #111, #d1d5db)',
              scale: 1.02
            }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              'ACCESS SYSTEM'
            )}
          </motion.button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            No credentials?{' '}
            <Link href="/signup" className="text-gray-400 hover:text-gray-300 font-medium">
              REQUEST ACCESS
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}