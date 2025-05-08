"use client"
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import axios from 'axios'
import { useSelector } from "react-redux";

import { jwtDecode } from "jwt-decode";
const socket = io("https://backend-taskmanagement-k0md.onrender.com");

function App() {
    

 
    const token=useSelector(state=>state?.user?.user?.user);
  const [currentUser, setCurrentUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [decodedToken, setDecodedToken] = useState(token);


  useEffect(() => {
     

        
        if (decodedToken) {
          const decoded = jwtDecode(decodedToken);
         setCurrentUser(decoded.user.id)
    
        }
      
  
    }, []);

  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerRef = useRef();
  const generateRandomUserId = () => {
    return Math.random().toString(36).substr(2, 9);  // Random alphanumeric string
  };
  useEffect(() => {
    axios.get("https://backend-taskmanagement-k0md.onrender.com/api/users")
      .then((response) => {
        const users = response.data;
        console.log(users)
        setOnlineUsers(users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  useEffect(() => {
    // Set currentUser to the generated random ID

    socket.emit("joinRoom", currentUser);

    socket.on("yourID", (id) => console.log("My socket id:", id));

    // 👇 receive the list of online users
    socket.on("onlineUsers", (users) => {console.log(users)
      setOnlineUsers(users.filter(u => u !== currentUser));
    });

    // 👇 handle incoming calls
    socket.on("incomingCall", ({ from, signal }) => {
      setIncomingCall({ from, signal });
    });

    // 👇 callAnswered handler once globally
    socket.on("callAnswered", ({ signal }) => {
      peerRef.current.signal(signal);
      setCallAccepted(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  const startCall = (targetUser) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideo.current.srcObject = stream;

      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on("signal", (signal) => {
        socket.emit("callUser", {
          from: currentUser,
          to: targetUser._id,
          signal,
        });
      });

      peer.on("stream", (remoteStream) => {
        remoteVideo.current.srcObject = remoteStream;
      });

      peerRef.current = peer;
    });
  };

  const answerCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideo.current.srcObject = stream;

      const peer = new Peer({ initiator: false, trickle: false, stream });

      peer.signal(incomingCall.signal);

      peer.on("signal", (signal) => {
        socket.emit("answerCall", {
          to: incomingCall.from,
          signal,
        });
      });

      peer.on("stream", (remoteStream) => {
        remoteVideo.current.srcObject = remoteStream;
      });

      setCallAccepted(true);
      peerRef.current = peer;
    });
  };

  return (
    <div className="p-4 text-white bg-gray-800 min-h-screen">
      <h1 className="text-2xl mb-4">Welcome, {currentUser}</h1>

      {incomingCall && !callAccepted && (
        <div className="mt-4">
          <p>{incomingCall.from} is calling you</p>
          <button onClick={answerCall} className="bg-blue-600 p-1 px-3 rounded mt-2">
            Answer
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-6">
        <video ref={localVideo} autoPlay muted className="w-64 h-48 bg-black"></video>
        <video ref={remoteVideo} autoPlay className="w-64 h-48 bg-black"></video>
      </div>

      <h2 className="text-xl mt-6">Online Users:</h2>
      <div className="flex gap-2 flex-wrap mt-2">
        {onlineUsers.length === 0 && <p>No other users online</p>}
        {onlineUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => startCall(user)}
            className="bg-green-600 p-1 px-3 rounded"
          >
            Call {user.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
