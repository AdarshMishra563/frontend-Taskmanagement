'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

export default function NotificationBell({count}) {
  const [unreadCount, setUnreadCount] = useState(count);

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
