"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [change,setchange]=useState(0)
    const [activeCall,setActiveCall]=useState(null)
  const [socket, setSocket] = useState(null);
  const token = useSelector((state) => state.user.user?.user);
  const [incomingCall, setIncomingCall] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const d=useSelector(state => state.user?.user?.email)
  useEffect(() => {
    const newSocket = io("https://backend-taskmanagement-yy2w.onrender.com/", {
      transports: ["websocket", "polling"],
      reconnection: true,  
      reconnectionAttempts:10, 
      reconnectionDelay:3000 
    });
  
    newSocket.on("connect", () => {
      console.log("Connected with socket ID:", newSocket.id);
    });
  
    newSocket.on("connect_error", (err) => {
      console.log("Connection error:", err);
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, [change]);
  

  useEffect(() => {
    if (socket && token) {
      const decoded = jwtDecode(token);
     
      socket.emit("joinRoom",{userId: decoded.user.id,email:d});
    }
  }, [socket, token]);
  
  useEffect(() => {
    if (socket) {
      const handleCallEnd = () => {
        setIncomingCall(null);
        setActiveCall(null);
       console.log("ended")
        
      };
  
      socket.on("callEnded", handleCallEnd);
  
      return () => {
        socket.off("callEnded", handleCallEnd);
      };
    }
  }, [socket]);
  const endCall = (toUserId) => {
    if (socket) {
      socket.emit("endCall", { to: toUserId });
      setIncomingCall(null);
      setActiveCall(null);
    }
  };


  useEffect(() => {
    if (socket) {
      socket.on("incomingCall", ({ from, signal }) => {
        setIncomingCall({ from, signal });
      });

      socket.on("onlineUsers", (userList) => {
        setOnlineUsers(userList);
      });

      return () => {
        socket.off("incomingCall");
        socket.off("onlineUsers");
      };
    }
  }, [socket]);
  

  return (
    <SocketContext.Provider value={{socket,endCall,incomingCall,setIncomingCall,onlineUsers,setchange}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
