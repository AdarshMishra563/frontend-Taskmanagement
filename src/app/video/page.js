"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import SimplePeer from "simple-peer";
import { toast } from "react-toastify";
import { IoMdRadioButtonOn } from "react-icons/io";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from 'next/navigation';

import { FaDesktop, FaStop, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from "react-icons/fa";

import { useSocket } from "../socketcontext/SocketContext";

export default function VideoPage() {
    const streamRef = useRef(null);
    const {socket,setchange,setIncomingCall}=useSocket();
const router=useRouter();
    const searchParams = useSearchParams();
    const toUserId = searchParams.get('toUserId');
    const initiator = searchParams.get('initiator') === 'true';

  const token = useSelector(state => state.user.user.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [stream, setStream] = useState(null);
  const peerRef = useRef(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);



  useEffect(() => {
    if (socket && token) {
      const decoded = jwtDecode(token);
      console.log(decoded,socket);
      setCurrentUserId(decoded.user.id)
      socket.emit("joinRoom", decoded.user.id);
    }
  }, [socket, token]);
useEffect(()=>{
if(!toUserId || !token){
    router.push("/dashboard")
}

},[token,toUserId,router])
  const myVideo = useRef();
  const userVideo = useRef();
  useEffect(() => {
    if (toUserId && currentUserId) {
        console.log("calling")
      callUser(toUserId);
    }
  }, [toUserId, currentUserId,socket]);

  const startScreenShare = () => {
  if (peerRef.current) {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      .then((screenStream) => {
        
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = peerRef.current._pc.getSenders().find(s => s.track.kind === 'video');

        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        
        if (myVideo.current) {
          myVideo.current.srcObject = screenStream;
        }

        
        screenTrack.onended = () => {
          stopScreenShare();
        };
        setIsScreenSharing(true);
      })
      .catch((err) => {
        console.error("Screen share failed: ", err);
      });
  }
};


  
const stopScreenShare = () => {
    if (peerRef.current && streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const sender = peerRef.current._pc.getSenders().find(s => s.track.kind === 'video');
  
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
  
      if (myVideo.current) {
        myVideo.current.srcObject = streamRef.current;
      }
      setIsScreenSharing(false);
    }
  };
  
  
    


  const handleEndCall = () => {
  localStorage.setItem("keyName", "value");
setIncomingCall(null);
    console.log("call end")
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
    setchange(prev=>prev+1);
   router.push("/dashboard")
  };
  

  useEffect(() => {
    console.log("remote")
  
    const handleRemoteEndCall = () => {
        toast.info("Call ended by remote user.");
        setIncomingCall(null)
        handleEndCall()
    };
  
    socket.on("callEnded", handleRemoteEndCall);
   
  
    return () => {
      socket.off("callEnded", handleRemoteEndCall);
    };
  }, [socket]);
  

  
  

  

  useEffect(() => {
    console.log("currewnt")
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
      .then((currentStream) => {console.log("media",currentStream)
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
  console.log("streamremote")
        peerRef.current = peer;
      });
  };
  
  const handleAnswer = (signal) => {
    console.log(signal,"anser")
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
  }, [currentUserId,socket]);


  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  
  handleResize();

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

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
    <h1 className="text-3xl font-bold mb-6">Connect</h1>
  
   
    <div
  className={`relative ${
    isMobile ? "w-screen h-screen" : "w-[55vw] h-[90vh]"
  } flex justify-center items-center bg-black overflow-hidden`}
>
  
  <video
    ref={userVideo}
    autoPlay
    playsInline
    className={`absolute top-0 left-0 w-full h-full object-cover`}
  />

  
  <video
    ref={myVideo}
    autoPlay
    playsInline
    muted
    className={`absolute ${
      isMobile
        ? "bottom-4 right-4 w-28 h-20"
        : "bottom-6 right-6 w-32 h-24 md:w-40 md:h-28"
    } object-cover rounded-lg border-2 border-white shadow-lg`}
  />
</div>

{stream && (
  <div
    className={`flex items-center gap-6 ${
      isMobile
        ? "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        : "mt-6"
    }`}
  >
    <button
      onClick={isScreenSharing ? stopScreenShare : startScreenShare}
      className={`p-3 rounded-full ${
        isScreenSharing ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700"
      } transition`}
    >
      {isScreenSharing ? (
        <FaStop className="text-white text-xl" />
      ) : (
        <FaDesktop className="text-white text-xl" />
      )}
    </button>

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
