"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {jwtDecode} from "jwt-decode";
import { useSelector } from "react-redux";
import axios from "axios";

const socket = io("https://backend-taskmanagement-k0md.onrender.com");

export default function VideoPage() {
  const token = useSelector((state) => state.user.user.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.user.id);
      socket.emit("joinRoom", decoded.user.id);
    }
  }, [token]);

  useEffect(() => {
    socket.on("onlineUsers", (userList) => {
      setOnlineUsers(userList);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const callUser = (toUserId) => {
    // Simulated WebRTC signal here (replace with real one)
    const dummySignal = { type: "offer", sdp: "..." };
    socket.emit("callUser", {
      from: currentUserId,
      to: toUserId,
      signal: dummySignal,
    });
  };

  useEffect(() => {
    socket.on("incomingCall", ({ from, signal }) => {
      console.log(`Incoming call from ${from}`, signal);
      // You'd show call modal here
    });

    socket.on("callAnswered", ({ signal }) => {
      console.log("Call answered", signal);
      // Proceed with WebRTC connection here
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAnswered");
    };
  }, []);

  return (
    <div>
      <h1>Video Call App</h1>
      <h2>Online Users:</h2>
      <ul>
  {Array.isArray(onlineUsers) && onlineUsers
    .filter((id) => id !== currentUserId)
    .map((id) => (
      <li key={id}>
        {id}
        <button onClick={() => callUser(id)}>Call</button>
      </li>
    ))}
</ul>
    </div>
  );
}
