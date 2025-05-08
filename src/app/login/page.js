'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../store/userSlice';
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
export default function Login() {
  const [error,seterror]=useState("");
  const [hide,sethide]=useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch();
  const router=useRouter();
  const handleLogin =async  () => {

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
    
    try{
      setLoading(true);
      seterror("");
      const res=await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/login",{email,password})
if(res?.data?.token){

  dispatch(setUser({user:res?.data?.token,email:email}))
router.push("/dashboard")

}
    }catch(err){
      dispatch(logout())
      seterror(err?.response?.data?.message)}finally{setLoading(false)}
   
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-700">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Task Management</h1>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
        <div className='relative'>
        <input
          type={hide?"text":"password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full  p-3 mb-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        /><div onClick={()=>{sethide(!hide)}} className='absolute top-4 right-3 cursor-pointer'>{hide?<FaEyeSlash color='#D1D5DB
' size={18}/>:<FaEye size={18} color='#D1D5DB
'/>}</div></div>
<div className="relative mb-8 flex flex-wrap">
 
  {error && (
    <div><span className="text-red-400 text-sm ">
      {error}
    </span></div>
  )}

<div className='absolute right-0 top-0'>
  <Link
    href="/forgot-password"
    className=" text-gray-400 text-sm hover:text-white"
  >
    Forgot Password?
  </Link></div>
</div>

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

         
         
        </div>
      </div>
    </div>
  );
}
