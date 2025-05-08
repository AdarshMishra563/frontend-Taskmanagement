"use client";

import { useEffect, useRef, useState } from "react";
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

  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [peerConnection, setPeerConnection] = useState(null);

 ;

  // Listen for online users list
  useEffect(() => {
    socket.on("onlineUsers", (userList) => {
      setOnlineUsers(userList);
    });

    return () => {
      socket.off("onlineUsers"); // Cleanup on unmount
    };
  }, []);

  // Handle incoming calls
  useEffect(() => {
    socket.on("incomingCall", ({ from, signal }) => {
      console.log(`Incoming call from ${from}`, signal);
      // Automatically answer the call
      answerCall(signal);
    });

    socket.on("callAnswered", ({ signal }) => {
      console.log("Call answered", signal);
      // Proceed with WebRTC connection when the call is answered
      handleAnswer(signal);
    });

    socket.on("receiveIceCandidate", ({ candidate }) => {
        console.log("Received ICE candidate", candidate);
        if (peerConnection) {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    
      return () => {
        socket.off("incomingCall");
        socket.off("callAnswered");
        socket.off("receiveIceCandidate");
      };
    }, [peerConnection]);

  // Function to start the call
  const startCall = async (toUserId) => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Display local video stream
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    // Add the local stream to the peer connection
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sendIceCandidate", {
          to: toUserId,
          candidate: event.candidate
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Create an offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("callUser", {
      from: currentUserId,
      to: toUserId,
      signal: offer
    });

    setPeerConnection(pc);
  };

  // Answer the call
  const answerCall = async (signal) => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Display local video stream
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    // Add the local stream to the peer connection
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("sendIceCandidate", {
          to: currentUserId,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Set remote description and create an answer
    await pc.setRemoteDescription(new RTCSessionDescription(signal));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answerCall", {
      to: currentUserId,
      signal: answer
    });

    setPeerConnection(pc);
  };

  // Call the user (from the list of online users)
  const callUser = (toUserId) => {
    startCall(toUserId);
  };

  return (
    <div>
      <h1>Video Call App</h1>
      <h2>Online Users:</h2>
      <ul>
        {Array.isArray(onlineUsers) &&
          onlineUsers
            .filter((id) => id !== currentUserId) // Exclude the current user from the list
            .map((id) => (
              <li key={id}>
                {id}
                <button onClick={() => callUser(id)}>Call</button>
              </li>
            ))}
      </ul>

      <div>
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
      </div>
    </div>
  );
}