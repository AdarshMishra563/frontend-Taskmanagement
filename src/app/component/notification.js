'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const token=useSelector(state=>state.user.user)
  useEffect(()=>{
const fetch=async()=>{
  const res=await axios.get("http://localhost:4000/api/auth/notification",
    {
    
      headers:{Authorization:`${token}`}
    }
  );
  console.log(res);
  const unreadCount = res.data.filter(notif => !notif.isRead).length;
      setUnreadCount(unreadCount);
  
 
};
fetch();

  },[])

  return (
    <div className="relative inline-block mt-3 cursor-pointer">
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
    </div>
  );
}
