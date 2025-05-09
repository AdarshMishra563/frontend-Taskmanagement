"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import SimplePeer from "simple-peer";
import { toast } from "react-toastify";
import { IoMdRadioButtonOn } from "react-icons/io";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from 'next/navigation';

import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";
import { useSocket } from "../socketcontext/SocketContext";

export default function VideoPage() {
    const {socket}=useSocket();
const router=useRouter();
    const searchParams = useSearchParams();
    const toUserId = searchParams.get('toUserId');

  const token = useSelector((state) => state.user.user.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [stream, setStream] = useState(null);
  const peerRef = useRef(null);
useEffect(()=>{
if(!toUserId || !token){
    router.push("/dashboard")
}

},[token,toUserId,router])
  const myVideo = useRef();
  const userVideo = useRef();
  useEffect(() => {
    if (toUserId && currentUserId) {
      callUser(toUserId);
    }
  }, [toUserId, currentUserId]);
  

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


  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (currentUserId && toUserId) {
      socket.emit("endCall", { to: toUserId });
    }
    peerRef.current = null;
    streamRef.current = null;
    setStream(null);
    
   router.push("/dashboard")
  };
  

  useEffect(() => {
    if (!socket) return;
  
    const handleRemoteEndCall = () => {
        toast.info("Call ended by remote user.");
        handleEndCall()
    };
  
    socket.on("callEnded", handleRemoteEndCall);
  
    return () => {
      socket.off("callEnded", handleRemoteEndCall);
    };
  }, [socket]);
  

  
  

  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      socket.off("incomingCall");
      socket.off("callAnswered");
      socket.off("onlineUsers");
    };
  }, []);
  
  const callUser = (toUserId) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        streamRef.current = currentStream;
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
    socket.on("callEnded", () => {
        console.log("Call has been ended by other user.");
        handleEndCall();
      });
    return () => {
      socket.off("incomingCall");
      socket.off("callAnswered");
      socket.off("callEnded");
    };
  }, [currentUserId]);



  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);



  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsAudioEnabled(!isAudioEnabled);
    }
  };
  
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col items-center p-4 overflow-y-auto">
    <h1 className="text-3xl font-bold mb-6">📹 Video Meet</h1>
  
   
    <div className="relative w-[96vw] h-[70vh] flex justify-center items-center mt-6">

  <video
    ref={userVideo}
    autoPlay
    playsInline
    className="w-full h-full object-cover rounded-lg border-4 border-gray-700"
  />


  <video
    ref={myVideo}
    autoPlay
    playsInline
    muted
    className="absolute bottom-4 right-4 w-40 h-28 object-cover rounded-lg border-2 border-white shadow-lg"
  />
</div>
 
    {stream && (
  <div className="flex items-center gap-6 mt-6">
    <button
      onClick={toggleAudio}
      className={`p-3 rounded-full ${
        isAudioEnabled ? "bg-green-600" : "bg-gray-600"
      } hover:opacity-80 transition`}
    >
      {isAudioEnabled ? (
        <FaMicrophone className="text-white text-xl" />
      ) : (
        <FaMicrophoneSlash className="text-white text-xl" />
      )}
    </button>

    <button
      onClick={toggleVideo}
      className={`p-3 rounded-full ${
        isVideoEnabled ? "bg-green-600" : "bg-gray-600"
      } hover:opacity-80 transition`}
    >
      {isVideoEnabled ? (
        <FaVideo className="text-white text-xl" />
      ) : (
        <FaVideoSlash className="text-white text-xl" />
      )}
    </button>

    <button
      onClick={handleEndCall}
      className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition"
    >
      <FaPhoneSlash className="text-white text-xl" />
    </button>
  </div>
)}

   
   
  </div>
  );
}
