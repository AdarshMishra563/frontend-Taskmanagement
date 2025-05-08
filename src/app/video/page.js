"use client"
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:4000");

function App() {
  const [currentUser, setCurrentUser] = useState("6815dbef9b97723118f8d97b");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerRef = useRef();

  useEffect(() => {
    socket.emit("joinRoom", currentUser);

    socket.on("yourID", (id) => console.log("My socket id:", id));

    // 👇 receive the list of online users
    socket.on("updateUserList", (users) => {
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
          to: targetUser,
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
            key={user}
            onClick={() => startCall(user)}
            className="bg-green-600 p-1 px-3 rounded"
          >
            Call {user}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
