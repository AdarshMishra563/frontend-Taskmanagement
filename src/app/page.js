'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


function Loading() {
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTranslateY((prev) => (prev === 0 ? -5 : 0));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <svg
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: 'transform 0.3s ease',
        }}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l2 2 4-4" />
      </svg>
      <h2 style={styles.text}>Task Management</h2>
    </div>
  );
}


export default function Page() {
  const data = useSelector((state) => state.user);
  const router = useRouter();

  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (data.isAuthenticated) {
        router.push('/about');
        setLoading(false);
    
    } else {
      setLoading(false);
      router.push('/login');
    }
  }, [data, router]);

  if (loading) {
    return <Loading />; 
  }

  return null; 
}


const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#222',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: '1.5rem',
    fontWeight: '600',
    letterSpacing: '1px',
  },
};
