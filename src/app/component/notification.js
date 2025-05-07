'use client';

import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';


const getTimeAgo = (dateString, now) => {
  const messageTime = new Date(dateString);
  const diffMs = now - messageTime;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [popup,setpopup]=useState(false);
  const [notifications,setnotifications]=useState([])
  const token=useSelector(state=>state.user?.user?.user);
 const dropdownRef=useRef(null)
  const [timeNow, setTimeNow] = useState(new Date());
 

useEffect(() => {
  const interval = setInterval(() => {
    setTimeNow(new Date());
  }, 60000); 

  return () => clearInterval(interval);
}, []);
  useEffect(()=>{
const fetch=async()=>{
  const res=await axios.get("https://backend-taskmanagement-k0md.onrender.com/api/auth/notification",
    {
    
      headers:{Authorization:`${token}`}
    }
  );
  
  const unreadCount = res.data.filter(notif => !notif.isRead).length;
      setUnreadCount(unreadCount);
   const unread=res.data.filter(notf=>!notf.isRead);
   setnotifications(unread);
   
  
 
};
fetch();

  },[token]);

  const readnotification=async ()=>{
const res=await axios.put("https://backend-taskmanagement-k0md.onrender.com/api/auth/notifications/markread",{},
  {
    
    headers:{Authorization:`${token}`}
  }
)
console.log(res)
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
       setpopup(false);
       
       
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div ref={dropdownRef} onClick={()=>{setpopup(!popup)}} className="relative inline-block mt-3 cursor-pointer">
      <button
         
        className="text-gray-700 hover:text-gray-600"
      >
        <FontAwesomeIcon icon={faBell} color='#9CA3AF' className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full ">
            {unreadCount}
          </span>
        )}
      </button>
      {popup && (
  <div className="absolute top-10 bg-gray-800 overflow-y-auto flex flex-col border border-gray-500 w-64 max-h-80 rounded shadow-lg z-50">
    <span className="text-xl text-gray-200 p-3 border-b border-gray-600">Notifications <span onClick={readnotification} className='text-xs text-gray-400 ml-12 border-b border-gray-600'>Read All</span></span>
    {notifications.length === 0 ? (
      <div className="text-gray-500 p-3">No new notifications</div>
    ) : (
      notifications.map((data, index) => (
        <div key={data.createdAt} className="p-2 border-b border-gray-600 text-gray-400 hover:bg-gray-700 cursor-pointer">
          {data.message}<div className="flex justify-end">
  <span className=" text-gray-500 text-xs">{getTimeAgo(data.createdAt,timeNow)}</span>
</div>
        </div>
      ))
    )}
  </div>
)}

    </div>
  );
}
