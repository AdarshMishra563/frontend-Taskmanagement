'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { motion, useAnimate, stagger } from 'framer-motion';

export default function Signup() {
  const [scope, animate] = useAnimate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState('');
  const [showPopup, setPopup] = useState(false);
  const [otp, setOtp] = useState([]);
  const otpInputs = useRef([]);
  const router = useRouter();
  const dispatch = useDispatch();


  useEffect(() => {
    animate(".letter", 
      { 
        opacity: [0, 1],
        scale: [0.8, 1.1, 1],
        filter: ['blur(4px)', 'blur(0px)'],
      },
      { 
        duration: 0.5,
        delay: stagger(0.07, { from: "center" }),
        ease: [0.16, 1, 0.3, 1]
      }
    );
  }, [animate]);

  const handleSignup = async () => {
    if (!username.trim()) {
      seterror('Name is required');
      return;
    }
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
      const res = await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/register",
        { name: username, email, password });
      seterror("");
      if (res.data.isVerified) { setPopup(true) }
    } catch (err) {
      console.log(err);
      seterror(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      seterror('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/verifyOtp", {
        email,
        otp: otpCode
      });
      
      if (response?.data?.isVerified) {
        seterror(response?.data?.message);
        dispatch(setUser({ user: response?.data?.token, email: email }));
        router.push("./dashboard");
      }
    } catch (err) {
      setLoading(false);
      seterror(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
     
      <div ref={scope} className="pt-16 pb-12 px-4 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-gray-400">
          {"CREATE ACCOUNT".split("").map((letter, i) => (
            <motion.span
              key={i}
              className="letter inline-block opacity-0"
              style={{ 
                minWidth: letter === ' ' ? '0.4em' : 'auto',
                transformOrigin: 'center bottom'
              }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </div>

      
      <motion.div 
        className="mx-auto w-full max-w-md px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 50,
          delay: 0.8
        }}
      >
        <div className="space-y-6 bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700">
          <input
            type="text"
            placeholder="Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 rounded-lg border border-gray-700"
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 rounded-lg border border-gray-700"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 rounded-lg border border-gray-700"
            required
          />

          {error && (
            <motion.div 
              className="text-red-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            onClick={handleSignup}
            className="w-full py-4 bg-gradient-to-r from-black to-gray-300 text-gray-100 font-bold tracking-wide rounded-lg shadow-md hover:shadow-gray-500/20 transition-all"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              'SIGN UP'
            )}
          </motion.button>

          <div className="text-center pt-4">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-gray-400 hover:text-gray-300 font-medium">
                LOGIN
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div 
            className="bg-gray-900/90 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h2 className="text-2xl font-bold text-center text-white mb-4">Verify Your Email</h2>
            <p className="text-gray-300 text-center mb-6">
              We&apos;ve sent a 6-digit code to {email}
            </p>
            
            <div className="flex justify-center space-x-3 mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (otpInputs.current[index] = el)}
                  className="w-12 h-12 text-center text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border border-gray-700"
                />
              ))}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setPopup(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                className="flex-1 bg-gradient-to-r from-black to-gray-300 text-white p-3 rounded-lg font-bold transition"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
            
            {error && (
              <motion.p 
                className="text-red-400 text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}