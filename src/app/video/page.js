"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import SimplePeer from "simple-peer";
import { useSelector } from "react-redux";

const socket = io("https://backend-taskmanagement-k0md.onrender.com");

export default function VideoPage() {
  const token = useSelector((state) => state.user.user.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [stream, setStream] = useState(null);
  const peerRef = useRef(null);

  const myVideo = useRef();
  const userVideo = useRef();

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
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;

        const peer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream: currentStream,
        });

        peer.on("signal", (signal) => {
          socket.emit("callUser", {
            from: currentUserId,
            to: toUserId,
            signal,
          });
        });

        peer.on("stream", (remoteStream) => {
          if (userVideo.current) userVideo.current.srcObject = remoteStream;
        });

        peerRef.current = peer;
      });
  };

  const handleAnswer = (signal) => {
    if (peerRef.current) {
      peerRef.current.signal(signal);
    }
  };

  useEffect(() => {
    socket.on("incomingCall", ({ from, signal }) => {
      console.log(`Incoming call from ${from}`);

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          if (myVideo.current) myVideo.current.srcObject = currentStream;

          const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream: currentStream,
          });

          peer.on("signal", (answerSignal) => {
            socket.emit("answerCall", {
              to: from,
              signal: answerSignal,
            });
          });

          peer.on("stream", (remoteStream) => {
            if (userVideo.current) userVideo.current.srcObject = remoteStream;
          });

          peer.signal(signal);
          peerRef.current = peer;
        });
    });

    socket.on("callAnswered", ({ signal }) => {
      handleAnswer(signal);
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAnswered");
    };
  }, [currentUserId]);

  return (
    <div>
      <h1>Video Call App</h1>
      <video ref={myVideo} autoPlay playsInline muted style={{ width: "300px" }} />
      <video ref={userVideo} autoPlay playsInline style={{ width: "300px" }} />
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
