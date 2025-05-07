'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout, setUser } from '../store/userSlice';
export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
const [error,seterror]=useState('')
const [showPopup, setPopup] = useState(false);
const [otp,setOtp]=useState([]);
const otpInputs = useRef([]);
const router=useRouter();
const dispatch=useDispatch();

  const handleSignup = async() => {
    



    if (!username.trim()) {
      seterror('Name is required');
      return ;
    }
    if (!email.trim()) {
      seterror('Email is required');
      return ;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      seterror('Please enter a valid email address');
      return ;
    }
    if (!password) {
      seterror('Password is required');
      return ;
    }
    if (password.length < 6) {
      seterror('Password must be at least 6 characters');
      return ;
    }
    
  


    try{setLoading(true);
const res=await axios.post("http://localhost:4000/api/auth/register",
  {name:username,email,password});
 
seterror("");
dispatch(setUser({user:res.data.token,email:email}));

if(res.data.isVerified){setPopup(true)}
    }catch(err){console.log(err); seterror(err?.response?.data?.message)}finally{setLoading(false)}

    
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
      setLoading(true)
      const response = await axios.post("http://localhost:4000/api/auth/verifyOtp", {
        email,
        otp: otpCode
      });
      
      console.log(response)
     if(response.data.isVerified){
      seterror(response.data.message);
      

      router.push("./dashboard")

     }
     
      
    } catch (err) {
      dispatch(logout);
      setLoading(false)
      seterror(err.response?.data?.message || 'OTP verification failed');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-700">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Create Account</h1>

        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
       required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
         required
         />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        required
        />
<div>{error &&<span className='text-red-400'>{error}</span>}</div>
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

      {showPopup && (
        <div className="fixed inset-0 bg-black/50    bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center text-white mb-4">Verify Your Email</h2>
            <p className="text-gray-300 text-center mb-6">
              We've sent a 6-digit code to {email}
            </p>
            
            <div className="flex justify-center space-x-3 mb-6">
              {[0, 1, 2, 3,4,5].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (otpInputs.current[index] = el)}
                  className="w-12 h-12 text-center text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              ))}
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setPopup(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg font-semibold transition w-full"
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                className="bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-lg font-semibold transition w-full"
              >
               {loading ? (
            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            'Verify'
          )}
              </button>
             
            </div>
            {error&&<span className='text-red-400'>{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
