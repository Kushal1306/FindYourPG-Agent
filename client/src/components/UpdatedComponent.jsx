// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Phone, Maximize2, Mic, MicOff } from "lucide-react";
// import { useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// // import dotenv from 'dotenv'

// // dotenv.config();

// export default function VideoConference() {
//   // console.log(process.env.VITE_BACKEND_URL);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const interviewId = queryParams.get('interviewId');
//   // const { interviewId } = useParams();
//   const [duration, setDuration] = useState(0);
//   const [validity, setValidity] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isAudioOn, setIsAudioOn] = useState(false);
//   const navigate = useNavigate();
//   const [dialog, setDialog] = useState('');

//   const videoRef = useRef(null);
//   const timerRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const [recordedChunks, setRecordedChunks] = useState([]);

//   // Audio processing refs
//   const ws = useRef(null);
//   const audioContextRef = useRef(null);
//   const sourceNodeRef = useRef(null);
//   const processorNodeRef = useRef(null);
//   const audioPlayerRef = useRef(null);

//   useEffect(() => {
//     const getInterviewData = async (interviewId) => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/saksham/interview/${interviewId}`);
//         console.log(response);
//         if (response.data.success)
//           setValidity(true);

//         setDialog(response.data.message);

//       } catch (error) {

//         console.log("error occured:", error.message);
//         setDialog(error.response.data.message);
//       }
//     };
//     getInterviewData(interviewId);
//   }, []);
//   const enterFullscreen = () => {
//     const element = document.documentElement;
//     if (element.requestFullscreen) {
//       element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error("Error entering fullscreen:", err));
//     }
//   };

//   const exitFullscreen = () => {
//     if (document.exitFullscreen) {
//       document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.error("Error exiting fullscreen:", err));
//     }
//   };

//   const initWebSocket = () => {
//     const backend_URL=import.meta.env.VITE_BACKEND_URL;
//     // console.log(backend_URL);
//     const modifiedurl=backend_URL.replace("http","ws");
//     ws.current = new WebSocket(`${modifiedurl}/websocket/${interviewId}`);

//     ws.current.onopen = () => {
//       console.log('WebSocket connection established');
//       ws.current.send(JSON.stringify({
//         event: 'start',
//         message: 'Connection initialized',
//       }));
//       startAudio();
//     };

//     ws.current.onmessage = (event) => {
//       const message = JSON.parse(event.data);

//       if (message.event === 'ping') {
//         ws.send(JSON.stringify({ event: 'pong' }));
//         console.log(`Sent pong to interview ${interviewId}`);
//       }
//       if (message.event === 'media') {
//         console.log("Media received");

//         const binaryString = atob(message.media.payload);
//         const byteArray = new Uint8Array(binaryString.length);

//         for (let i = 0; i < binaryString.length; i++) {
//           byteArray[i] = binaryString.charCodeAt(i);
//         }

//         const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
//         const audioUrl = URL.createObjectURL(audioBlob);

//         if (audioPlayerRef.current) {
//           audioPlayerRef.current.src = audioUrl;
//           audioPlayerRef.current.play().catch((error) => {
//             console.error("Error playing audio:", error);
//           });
//         }
//       }
//     };

//     ws.current.onclose = () => {
//       console.log('WebSocket connection closed');
//     };
//   };

//   const startAudio = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setIsAudioOn(true);

//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
//       processorNodeRef.current = audioContextRef.current.createScriptProcessor(1024, 1, 1);

//       sourceNodeRef.current.connect(processorNodeRef.current);
//       processorNodeRef.current.connect(audioContextRef.current.destination);

//       processorNodeRef.current.onaudioprocess = (e) => {
//         const inputData = e.inputBuffer.getChannelData(0);
//         const audioData = convertFloat32ToInt16(inputData);
//         sendAudioChunk(audioData);
//       };

//     } catch (error) {
//       console.error('Error accessing audio:', error);
//     }
//   };
  
//   const stopAudio = () => {
//     if (sourceNodeRef.current) {
//       sourceNodeRef.current.disconnect();
//     }
//     if (processorNodeRef.current) {
//       processorNodeRef.current.disconnect();
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//     }
//     setIsAudioOn(false);
//   };

//   const convertFloat32ToInt16 = (buffer) => {
//     let l = buffer.length;
//     const buf = new Int16Array(l);
//     while (l--) {
//       buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
//     }
//     return buf.buffer;
//   };

//   const sendAudioChunk = (audioData) => {
//     const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioData)));
//     if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({
//         event: 'media',
//         media: {
//           payload: audioBase64,
//         },
//       }));
//     }
//   };

//   // 
  

//   useEffect(() => {
//     if (isFullscreen) {
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then(stream => {
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//           }
//           // handleRecording(stream);
//           initWebSocket();

//           timerRef.current = setInterval(() => {
//             setDuration(prev => prev + 1);
//           }, 1000);
//         })
//         .catch(err => console.error("Error accessing media devices:", err));
//     }

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (!isFullscreen) {
//         stopAudio();
//         if (ws.current) {
//           ws.current.close();
//         }
//       }
//     };
//   }, [isFullscreen]);

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}m ${remainingSeconds}s`;
//   };

//   // const handleStopRecording = () => {
//   //   if (mediaRecorderRef.current) {
//   //     mediaRecorderRef.current.stop();
//   //     setIsRecording(false);
//   //   }
//   // };

//   const handleDownload = () => {
//     const blob = new Blob(recordedChunks, { type: 'video/webm' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'recording.webm';
//     a.click();
//   };
  
//   const stopVideo = () => {
//     const videoTracks = videoRef.current?.srcObject?.getTracks().filter(track => track.kind === 'video');
//     videoTracks.forEach(track => track.stop()); // Stop the video track
//   };

//   const handleEndCall = () => {
//     // handleStopRecording();
//     stopAudio();
//     stopVideo();
//     if (ws.current) {
//       ws.current.close();
//     }
//     navigate(`/feedback?interviewId=${interviewId}`);
//     exitFullscreen();
//   };

//   return (
//     <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex flex-col">
//       {!isFullscreen && validity && (
//         <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
//           <div className='pl-2 text-white'>{dialog}</div>
//           <Button
//             onClick={enterFullscreen}
//             className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             <Maximize2 className="mr-2 h-5 w-5" />
//             Enter Fullscreen
//           </Button>
//         </div>
//       )}
//       {!validity && (
//         <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
//           <div className='pl-2 text-white'>{dialog}</div>
//         </div>

//       )
//       }

//       {isFullscreen && (
//         <div className="flex-grow flex justify-center items-center space-x-8 mb-2">
//           {/* User Video */}
//           <div className="w-96 h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//             <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               Duration: {formatDuration(duration)}
//             </div>
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               You
//             </div>
//           </div>

//           {/* Placeholder for the other participant */}
//           <div className="w-96 h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//             <img
//               src="/images/saksham.jpeg"
//               alt="Saksham"
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               Saksham
//             </div>
//           </div>
//         </div>
//       )}

//       {isFullscreen && (
//         <div className="flex justify-center mb-24 space-x-4">
//           <Button
//             onClick={() => setIsAudioOn(!isAudioOn)}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             {isAudioOn ? (
//               <Mic className="mr-2 h-5 w-5" />
//             ) : (
//               <MicOff className="mr-2 h-5 w-5" />
//             )}
//             {isAudioOn ? 'Mute' : 'Unmute'}
//           </Button>

//           <Button
//             onClick={handleEndCall}
//             className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             <Phone className="mr-2 h-5 w-5 rotate-180" />
//             End Call
//           </Button>

//           {/* {isRecording && (
//             <Button
//               onClick={handleDownload}
//               className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg"
//             >
//               Download Recording
//             </Button>
//           )} */}
//         </div>
//       )}

//       <audio ref={audioPlayerRef} controls style={{ display: 'none' }} />
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {Maximize2, Mic, MicOff, X,FileText,MessageSquare,Clock,Shield,Smile,Menu,User,Info,Phone,Video} from "lucide-react";
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';

export default function VideoConference() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const interviewId = queryParams.get('interviewId');
  const [duration, setDuration] = useState(0);
  const [validity, setValidity] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const navigate = useNavigate();
  const [dialog, setDialog] = useState('');

  const videoRef = useRef(null);
  
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Audio processing refs
  const ws = useRef(null);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const processorNodeRef = useRef(null);
  const audioPlayerRef = useRef(null);
  
  // Audio queue management
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const getInterviewData = async (interviewId) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/saksham/interview/${interviewId}`);
        console.log(response);
        if (response.data.success){
          setValidity(true);
          setShowTerms(true);
        }


        setDialog(response.data.message);

      } catch (error) {
        console.log("error occured:", error.message);
        setDialog(error.response.data.message);
      }
    };
    getInterviewData(interviewId);
  }, []);

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error("Error entering fullscreen:", err));
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.error("Error exiting fullscreen:", err));
    }
  };

  // Function to play the next audio in queue
  const playNextInQueue = () => {
    if (audioQueueRef.current.length > 0 && !isPlayingRef.current) {
      isPlayingRef.current = true;
      const nextAudioUrl = audioQueueRef.current.shift();
      
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = nextAudioUrl;
        audioPlayerRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          isPlayingRef.current = false;
          playNextInQueue(); // Try the next one if this fails
        });
      }
    }
  };

  const initWebSocket = () => {
    const backend_URL = import.meta.env.VITE_BACKEND_URL;
    const modifiedurl = backend_URL.replace("http", "ws");
    ws.current = new WebSocket(`${modifiedurl}/websocket/${interviewId}`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
      ws.current.send(JSON.stringify({
        event: 'start',
        message: 'Connection initialized',
      }));
      startAudio();
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === 'ping') {
        ws.current.send(JSON.stringify({ event: 'pong' }));
        console.log(`Sent pong to interview ${interviewId}`);
      }
      
      if (message.event === 'media') {
        console.log("Media received");

        const binaryString = atob(message.media.payload);
        const byteArray = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }

        const audioBlob = new Blob([byteArray], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Add audio to queue instead of playing immediately
        audioQueueRef.current.push(audioUrl);
        
        // Try to play if nothing is currently playing
        playNextInQueue();
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  // Setup audio player ended event to play next in queue
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.onended = () => {
        console.log("Audio finished playing");
        isPlayingRef.current = false;
        playNextInQueue();
      };
    }
  }, [isFullscreen]);

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsAudioOn(true);

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorNodeRef.current = audioContextRef.current.createScriptProcessor(1024, 1, 1);

      sourceNodeRef.current.connect(processorNodeRef.current);
      processorNodeRef.current.connect(audioContextRef.current.destination);

      processorNodeRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = convertFloat32ToInt16(inputData);
        sendAudioChunk(audioData);
      };

    } catch (error) {
      console.error('Error accessing audio:', error);
    }
  };
  
  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
    }
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsAudioOn(false);
  };

  const convertFloat32ToInt16 = (buffer) => {
    let l = buffer.length;
    const buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf.buffer;
  };

  const sendAudioChunk = (audioData) => {
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioData)));
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        event: 'media',
        media: {
          payload: audioBase64,
        },
      }));
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          initWebSocket();

          timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
          }, 1000);
        })
        .catch(err => console.error("Error accessing media devices:", err));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (!isFullscreen) {
        stopAudio();
        if (ws.current) {
          ws.current.close();
        }
        // Clean up any URLs from the queue
        audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
        audioQueueRef.current = [];
      }
    };
  }, [isFullscreen]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleDownload = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
  };
  
  const stopVideo = () => {
    const videoTracks = videoRef.current?.srcObject?.getTracks().filter(track => track.kind === 'video');
    videoTracks?.forEach(track => track.stop()); // Stop the video track
  };

  const handleEndCall = () => {
    stopAudio();
    stopVideo();
    if (ws.current) {
      ws.current.close();
    }
    // Clean up any URLs from the queue
    audioQueueRef.current.forEach(url => URL.revokeObjectURL(url));
    audioQueueRef.current = [];
    navigate(`/feedback?interviewId=${interviewId}`);
    exitFullscreen();
  };

  const toggleAudio = () => {
    if (isAudioOn) {
      stopAudio();
    } else {
      startAudio();
    }
  };

//   const termsDialogContent = (
//     <div className="bg-white rounded-lg p-6 max-w-md w-full">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">Terms and Conditions</h2>
      
//       <div className="h-64 overflow-y-auto border p-4 mb-4 rounded bg-gray-50">
//         <h3 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h3>
//         <p className="mb-4 text-gray-700">By accessing and using this application, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        
//         <h3 className="text-lg font-semibold mb-2">2. Use License</h3>
//         <p className="mb-4 text-gray-700">Permission is granted to temporarily use this application for personal, non-commercial purposes only. This is the grant of a license, not a transfer of title.</p>
        
//         <h3 className="text-lg font-semibold mb-2">3. Disclaimer</h3>
//         <p className="mb-4 text-gray-700">The materials on this application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties.</p>
        
//         <h3 className="text-lg font-semibold mb-2">4. Limitations</h3>
//         <p className="mb-4 text-gray-700">In no event shall we or our suppliers be liable for any damages arising out of the use or inability to use the materials on this application.</p>
        
//         <h3 className="text-lg font-semibold mb-2">5. Privacy Policy</h3>
//         <p className="mb-4 text-gray-700">Your use of this application is also subject to our Privacy Policy, which describes how we collect, use, and protect your personal information.</p>
//       </div>
      
//       <div className="mb-6">
//         <label className="flex items-center cursor-pointer">
//           <Input
//             type="checkbox" 
//             checked={isChecked} 
//             onChange={() => setIsChecked(!isChecked)}
//             className="w-5 h-5 mr-2"
//           />
//           <span className="text-sm text-gray-700">I have read and agree to the Terms and Conditions</span>
//         </label>
//       </div>
//     </div>
//   );

//   return (
//     <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex flex-col">
//       {!isFullscreen && validity && (
//         <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
//           {/* <div className='pl-2 text-white'>{dialog}</div> */}
//           <Button
//             onClick={enterFullscreen}
//             className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             <Maximize2 className="mr-2 h-5 w-5" />
//             Enter Fullscreen
//           </Button>
//         </div>
//       )}
//       {/* {!validity && (
//         <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
//           <div className='pl-2 text-white'>{dialog}</div>
//         </div>
//       )} */}
// {!validity ? (
//   <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
//     <div className="pl-2 text-white">{dialog}</div>
//   </div>
// ) : (
//   <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
//     <div className="pl-2 text-white">{dialog}</div>
//     <div className="pl-2 text-white">{termsDialogContent}</div>
//     <Button
//       onClick={enterFullscreen}
//       disabled={!isChecked}
//       className={`flex items-center ${
//         isChecked 
//           ? 'bg-rose-500 hover:bg-rose-600 text-white' 
//           : 'bg-gray-400 text-gray-200 cursor-not-allowed'
//       } px-6 py-3 rounded-full shadow-lg`}
//     >
//       <Maximize2 className="mr-2 h-5 w-5" />
//       Enter Fullscreen
//     </Button>
//   </div>
// )}


//       {isFullscreen && (
//         <div className="flex-grow flex justify-center items-center space-x-8 mb-2">
//           {/* User Video */}
//           <div className="w-96 h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//             <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               Duration: {formatDuration(duration)}
//             </div>
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               You
//             </div>
//           </div>

//           {/* Placeholder for the other participant */}
//           <div className="w-96 h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//             <img
//               src="/images/saksham.jpeg"
//               alt="Saksham"
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               Saksham
//             </div>
//           </div>
//         </div>
//       )}

//       {isFullscreen && (
//         <div className="flex justify-center mb-24 space-x-4">
//           <Button
//             onClick={toggleAudio}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             {isAudioOn ? (
//               <Mic className="mr-2 h-5 w-5" />
//             ) : (
//               <MicOff className="mr-2 h-5 w-5" />
//             )}
//             {isAudioOn ? 'Mute' : 'Unmute'}
//           </Button>

//           <Button
//             onClick={handleEndCall}
//             className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             <Phone className="mr-2 h-5 w-5 rotate-180" />
//             End Call
//           </Button>
//         </div>
//       )}

//       <audio ref={audioPlayerRef} style={{ display: 'none' }} />
//     </div>
//   );

// const termsDialogContent = (
//   <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-indigo-100">
//     <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-800 p-5">
//       <div className="flex items-center space-x-3">
//         <div className="bg-white bg-opacity-20 p-2 rounded-lg">
//           <FileText size={18} className="text-white" />
//         </div>
//         <h2 className="text-xl font-bold text-white tracking-tight">Terms and Conditions</h2>
//       </div>
//       {/* <button 
//         onClick={() => setShowTerms(false)} 
//         className="text-white hover:bg-indigo-700 rounded-full p-1"
//       >
//         <X size={20} />
//       </button> */}
//     </div>
    
//     <div className="p-6">
//       <div className="h-64 overflow-y-auto border border-gray-200 p-5 mb-6 rounded-lg bg-gray-50 shadow-inner">
//         <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
//           <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">1</span>
//           Acceptance of Terms
//         </h3>
//         <p className="mb-4 text-gray-700 pl-8">By accessing and using this interview platform, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        
//         <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
//           <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">2</span>
//           Interview Recording
//         </h3>
//         <p className="mb-4 text-gray-700 pl-8">You acknowledge that this interview session may be recorded for internal review purposes. These recordings will be kept confidential and secure.</p>
        
//         <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
//           <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">3</span>
//           Privacy Statement
//         </h3>
//         <p className="mb-4 text-gray-700 pl-8">Your personal information and interview responses will be handled according to our Privacy Policy. We respect your privacy and will protect your data.</p>
        
//         <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
//           <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">4</span>
//           Technical Requirements
//         </h3>
//         <p className="mb-4 text-gray-700 pl-8">You are responsible for ensuring your device and internet connection meet the minimum requirements for this platform to function properly.</p>
        
//         <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
//           <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">5</span>
//           Code of Conduct
//         </h3>
//         <p className="mb-4 text-gray-700 pl-8">All participants are expected to conduct themselves professionally and respectfully during the interview process.</p>
//       </div>
      
//       <div className="mb-6">
//         <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
//           <Input
//             type="checkbox" 
//             checked={isChecked} 
//             onChange={() => setIsChecked(!isChecked)}
//             className="w-5 h-5 mr-3 accent-indigo-600"
//           />
//           <span className="text-sm text-gray-700">I have read and agree to the Terms and Conditions</span>
//         </label>
//       </div>
      
//       <Button
//         onClick={enterFullscreen}
//         disabled={!isChecked}
//         className={`flex items-center justify-center w-full ${
//           isChecked 
//             ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white' 
//             : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//         } px-6 py-4 rounded-lg shadow-lg transition-all duration-200 font-medium`}
//       >
//         <Maximize2 className="mr-2 h-5 w-5" />
//         Join Interview
//       </Button>
//     </div>
//   </div>
// );

// return (
//   <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col">
//     {/* Welcome overlay */}
//     {!isFullscreen && (
//       <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-indigo-900 flex justify-center items-center z-50 backdrop-blur-sm">
//         <div className="fixed top-0 left-0 right-0 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
//           <div className="container mx-auto">
//             <div className="flex items-center space-x-2">
//               <div className="bg-white p-1 rounded-md">
//                 <div className="h-6 w-6 bg-indigo-600 rounded-sm flex items-center justify-center">
//                   <Video size={16} className="text-white" />
//                 </div>
//               </div>
//               <h1 className="text-xl font-bold tracking-tight text-white">Saksham AI</h1>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex flex-col items-center max-w-3xl px-6 pt-12">
//           {!validity && (
//             <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl shadow-2xl mb-8 border border-white border-opacity-20">
//               <div className="text-center">
//                 <div className="inline-flex justify-center items-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
//                   <MessageSquare size={28} />
//                 </div>
//                 <p className="text-xl text-white font-light leading-relaxed">
//                   {dialog}
//                 </p>
//               </div>
//             </div>
//           )}
          
//           {validity && showTerms && termsDialogContent}
//         </div>
//       </div>
//     )}

//     {/* Interview interface */}
//     {isFullscreen && (
//       <>
//         <header className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-3 px-4 shadow-lg">
//           <div className="container mx-auto flex justify-between items-center">
//             <div className="flex items-center space-x-3">
//               <div className="bg-white p-1 rounded-md">
//                 <div className="h-6 w-6 bg-indigo-600 rounded-sm flex items-center justify-center">
//                   <Video size={16} className="text-white" />
//                 </div>
//               </div>
//               <h1 className="text-xl font-bold tracking-tight">Saksham AI</h1>
//             </div>
//             <div className="bg-black bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
//               <Clock size={14} className="mr-2 text-indigo-200" />
//               <span className="font-medium">{formatDuration(duration)}</span>
//             </div>
//           </div>
//         </header>

//         <main className="flex-grow container mx-auto p-6 flex flex-col">
//           <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden mb-6">
//             <div className="p-3 bg-gradient-to-r from-indigo-700 to-purple-700 text-white flex justify-between items-center">
//               <div className="flex items-center space-x-2">
//                 <Shield size={16} />
//                 <span className="text-sm font-medium">Secure Interview Session</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div className="flex items-center bg-green-500 bg-opacity-30 px-2 py-1 rounded-full">
//                   <div className="h-2 w-2 bg-green-400 rounded-full mr-1"></div>
//                   <span className="text-xs">Live</span>
//                 </div>
//                 <Menu size={16} />
//               </div>
//             </div>
            
//             <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-4 h-full">
//               {/* Your video */}
//               <div className="w-full md:w-1/2 max-w-xl">
//                 <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl relative aspect-video">
//                 <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//                 <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
//                     <Smile size={14} className="mr-2" />
//                     <span>You</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Interviewer video */}
//               <div className="w-full md:w-1/2 max-w-xl">
//                 <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl relative aspect-video">
//                   <img
//                      src="/images/saksham.jpeg"
//                      alt="Saksham"
//                      className="w-full h-full object-cover"
//                   />
//                   <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
//                     <User size={14} className="mr-2" />
//                     <span>Saksham (Interviewer)</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 shadow-lg mb-6">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-2">
//                 <Info size={18} className="text-indigo-400" />
//                 <h3 className="text-gray-800 font-medium">Interview Tips</h3>
//               </div>
//               <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Tips</div>
//             </div>
//             <p className="text-sm text-gray-600 mt-2">
//               Remember to speak clearly and maintain eye contact with the camera. Donot Interrupt while the AI Interviewer Speaks.
//             </p>
//           </div>
//         </main>

//         <footer className="bg-gray-50 py-6 border-t border-gray-200">
//           <div className="container mx-auto">
//             <div className="flex justify-center space-x-4">
//               <Button
//                 onClick={toggleAudio}
//                 className={`${
//                   isAudioOn ? 'bg-gray-100 text-indigo-700 border-indigo-200' : 'bg-red-100 text-red-700 border-red-200'
//                 } hover:opacity-90 p-4 rounded-full border shadow-md transition-colors duration-200 w-14 h-14 flex items-center justify-center`}
//                 aria-label={isAudioOn ? 'Mute' : 'Unmute'}
//               >
//                 {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
//               </Button>
              
//               <Button
//                 onClick={handleEndCall}
//                 className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 w-14 h-14 flex items-center justify-center"
//                 aria-label="End Call"
//               >
//                 <Phone className="rotate-135" size={24} />
//               </Button>
//             </div>
//           </div>
//         </footer>
//       </>
//     )}

//     <audio ref={audioPlayerRef} style={{ display: 'none' }} />
//   </div>);
const termsDialogContent = (
  <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-indigo-100">
    <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-indigo-800 p-5">
      <div className="flex items-center space-x-3">
        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
          <FileText size={18} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Terms and Conditions</h2>
      </div>
      {/* <button 
        onClick={() => setShowTerms(false)} 
        className="text-white hover:bg-indigo-700 rounded-full p-1"
      >
        <X size={20} />
      </button> */}
    </div>
    
    <div className="p-6">
      <div className="h-48 overflow-y-auto border border-gray-200 p-5 mb-6 rounded-lg bg-gray-50 shadow-inner">
        <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
          <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">1</span>
          Acceptance of Terms
        </h3>
        <p className="mb-4 text-gray-700 pl-8">By accessing and using this interview platform, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        
        <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
          <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">2</span>
          Interview Recording
        </h3>
        <p className="mb-4 text-gray-700 pl-8">You acknowledge that this interview session may be recorded for internal review purposes. These recordings will be kept confidential and secure.</p>
        
        <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
          <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">3</span>
          Privacy Statement
        </h3>
        <p className="mb-4 text-gray-700 pl-8">Your personal information and interview responses will be handled according to our Privacy Policy. We respect your privacy and will protect your data.</p>
        
        <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
          <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">4</span>
          Technical Requirements
        </h3>
        <p className="mb-4 text-gray-700 pl-8">You are responsible for ensuring your device and internet connection meet the minimum requirements for this platform to function properly.</p>
        
        <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center">
          <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full text-xs flex items-center justify-center mr-2">5</span>
          Code of Conduct
        </h3>
        <p className="mb-4 text-gray-700 pl-8">All participants are expected to conduct themselves professionally and respectfully during the interview process.</p>
      </div>
      
      <div className="mb-4">
        <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <Input
            type="checkbox" 
            checked={isChecked} 
            onChange={() => setIsChecked(!isChecked)}
            className="w-5 h-5 mr-3 accent-indigo-600"
          />
          <span className="text-sm text-gray-700">I have read and agree to the Terms and Conditions</span>
        </label>
      </div>
      
      <Button
        onClick={enterFullscreen}
        disabled={!isChecked}
        className={`flex items-center justify-center w-full ${
          isChecked 
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        } px-6 py-3 rounded-lg shadow-lg transition-all duration-200 font-medium`}
      >
        <Maximize2 className="mr-2 h-5 w-5" />
        Join Interview
      </Button>
    </div>
  </div>
);

return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col">
    {/* Welcome overlay */}
    {!isFullscreen && (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-indigo-900 flex justify-center items-center z-50 backdrop-blur-sm">
        <div className="fixed top-0 left-0 right-0 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
          <div className="container mx-auto">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-1 rounded-md">
                <div className="h-6 w-6 bg-indigo-600 rounded-sm flex items-center justify-center">
                  <Video size={16} className="text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">Saksham AI</h1>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center max-w-3xl px-6 pt-12">
          {!validity && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl shadow-2xl mb-8 border border-white border-opacity-20">
              <div className="text-center">
                <div className="inline-flex justify-center items-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                  <MessageSquare size={28} />
                </div>
                <p className="text-xl text-white font-light leading-relaxed">
                  {dialog}
                </p>
              </div>
            </div>
          )}
          
          {validity && showTerms && termsDialogContent}
        </div>
      </div>
    )}

    {/* Interview interface */}
    {isFullscreen && (
      <>
        <header className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white py-3 px-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-1 rounded-md">
                <div className="h-6 w-6 bg-indigo-600 rounded-sm flex items-center justify-center">
                  <Video size={16} className="text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Saksham AI</h1>
            </div>
            <div className="bg-black bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
              <Clock size={14} className="mr-2 text-indigo-200" />
              <span className="font-medium">{formatDuration(duration)}</span>
            </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-6 flex flex-col">
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden mb-6">
            <div className="p-3 bg-gradient-to-r from-indigo-700 to-purple-700 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Shield size={16} />
                <span className="text-sm font-medium">Secure Interview Session</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-green-500 bg-opacity-30 px-2 py-1 rounded-full">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-1"></div>
                  <span className="text-xs">Live</span>
                </div>
                <Menu size={16} />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-4 h-full">
              {/* Your video */}
              <div className="w-full md:w-1/2 max-w-xl">
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl relative aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Smile size={14} className="mr-2" />
                    <span>You</span>
                  </div>
                </div>
              </div>

              {/* Interviewer video */}
              <div className="w-full md:w-1/2 max-w-xl">
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl relative aspect-video">
                  <img
                     src="/images/saksham.jpeg"
                     alt="Saksham"
                     className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <User size={14} className="mr-2" />
                    <span>Saksham (Interviewer)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 shadow-lg mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Info size={18} className="text-indigo-400" />
                <h3 className="text-gray-800 font-medium">Interview Tips</h3>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Tips</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Remember to speak clearly and maintain eye contact with the camera. Donot Interrupt while the AI Interviewer Speaks.
            </p>
          </div>
        </main>

        <footer className="bg-gray-50 py-4 border-t border-gray-200">
          <div className="container mx-auto">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={toggleAudio}
                className={`${
                  isAudioOn ? 'bg-gray-100 text-indigo-700 border-indigo-200' : 'bg-red-100 text-red-700 border-red-200'
                } hover:opacity-90 p-3 rounded-full border shadow-md transition-colors duration-200 w-12 h-12 flex items-center justify-center`}
                aria-label={isAudioOn ? 'Mute' : 'Unmute'}
              >
                {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
              </Button>
              
              <Button
                onClick={handleEndCall}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 w-12 h-12 flex items-center justify-center"
                aria-label="End Call"
              >
                <Phone className="rotate-135" size={20} />
              </Button>
            </div>
          </div>
        </footer>
      </>
    )}

    <audio ref={audioPlayerRef} style={{ display: 'none' }} />
  </div>);
}

    // ws.current = new WebSocket(`wss://sakshamnew.calmmoss-72962535.southindia.azurecontainerapps.io/websocket/${interviewId}`);

    // ws.current = new WebSocket(`wss://saksham-n0ks.onrender.com/websocket/${interviewId}`);
    // ws.current = new WebSocket(`ws://${import.meta.env.VITE_BACKEND_URL}/websocket/${interviewId}`);

// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Phone, Maximize2, Mic, MicOff } from "lucide-react";
// import { useLocation, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// // import dotenv from 'dotenv'

// // dotenv.config();

// export default function VideoConference() {
//   // console.log(process.env.VITE_BACKEND_URL);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const interviewId = queryParams.get('interviewId');
//   // const { interviewId } = useParams();
//   const [duration, setDuration] = useState(0);
//   const [validity, setValidity] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isAudioOn, setIsAudioOn] = useState(false);
//   const navigate = useNavigate();
//   const [dialog, setDialog] = useState('');
  
//   // Audio queue state
//   const [audioQueue, setAudioQueue] = useState([]);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const videoRef = useRef(null);
//   const timerRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const [recordedChunks, setRecordedChunks] = useState([]);

//   // Audio processing refs
//   const ws = useRef(null);
//   const audioContextRef = useRef(null);
//   const sourceNodeRef = useRef(null);
//   const processorNodeRef = useRef(null);
//   const audioPlayerRef = useRef(null);

//   useEffect(() => {
//     const getInterviewData = async (interviewId) => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/saksham/interview/${interviewId}`);
//         console.log(response);
//         if (response.data.success)
//           setValidity(true);

//         setDialog(response.data.message);

//       } catch (error) {
//         console.log("error occured:", error.message);
//         setDialog(error.response.data.message);
//       }
//     };
//     getInterviewData(interviewId);
//   }, []);

//   // Handle audio queue playback
//   useEffect(() => {
//     const audioPlayer = audioPlayerRef.current;
    
//     if (audioPlayer && audioQueue.length > 0 && !isPlaying) {
//       setIsPlaying(true);
      
//       // Take the first audio in the queue
//       const currentAudio = audioQueue[0];
//       audioPlayer.src = currentAudio;
      
//       // Play the audio
//       audioPlayer.play().catch(error => {
//         console.error("Error playing audio:", error);
//         handleAudioEnded(); // Handle errors as if the audio ended
//       });
//     }
//   }, [audioQueue, isPlaying]);

//   // Handle when audio playback ends
//   const handleAudioEnded = () => {
//     // Remove the played audio from the queue
//     setAudioQueue(prevQueue => prevQueue.slice(1));
//     setIsPlaying(false);
//   };

//   // Add event listener to the audio element
//   useEffect(() => {
//     const audioPlayer = audioPlayerRef.current;
//     if (audioPlayer) {
//       audioPlayer.addEventListener('ended', handleAudioEnded);
//       return () => {
//         audioPlayer.removeEventListener('ended', handleAudioEnded);
//       };
//     }
//   }, []);

//   const enterFullscreen = () => {
//     const element = document.documentElement;
//     if (element.requestFullscreen) {
//       element.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error("Error entering fullscreen:", err));
//     }
//   };

//   const exitFullscreen = () => {
//     if (document.exitFullscreen) {
//       document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.error("Error exiting fullscreen:", err));
//     }
//   };

//   const initWebSocket = () => {
//     const backend_URL = import.meta.env.VITE_BACKEND_URL;
//     // console.log(backend_URL);
//     const modifiedurl = backend_URL.replace("http", "ws");
//     ws.current = new WebSocket(`${modifiedurl}/websocket/${interviewId}`);
//     // ws.current = new WebSocket(`wss://sakshamnew.calmmoss-72962535.southindia.azurecontainerapps.io/websocket/${interviewId}`);

//     // ws.current = new WebSocket(`wss://saksham-n0ks.onrender.com/websocket/${interviewId}`);
//     // ws.current = new WebSocket(`ws://${import.meta.env.VITE_BACKEND_URL}/websocket/${interviewId}`);

//     ws.current.onopen = () => {
//       console.log('WebSocket connection established');
//       ws.current.send(JSON.stringify({
//         event: 'start',
//         message: 'Connection initialized',
//       }));
//       startAudio();
//     };

//     ws.current.onmessage = (event) => {
//       const message = JSON.parse(event.data);

//       if (message.event === 'ping') {
//         ws.current.send(JSON.stringify({ event: 'pong' }));
//         console.log(`Sent pong to interview ${interviewId}`);
//       }
      
//       if (message.event === 'media') {
//         console.log("Media received");

//         const binaryString = atob(message.media.payload);
//         const byteArray = new Uint8Array(binaryString.length);

//         for (let i = 0; i < binaryString.length; i++) {
//           byteArray[i] = binaryString.charCodeAt(i);
//         }

//         const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });
//         const audioUrl = URL.createObjectURL(audioBlob);

//         // Add new audio to the queue instead of playing immediately
//         setAudioQueue(prevQueue => [...prevQueue, audioUrl]);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log('WebSocket connection closed');
//     };
//   };

//   const startAudio = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setIsAudioOn(true);

//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
//       processorNodeRef.current = audioContextRef.current.createScriptProcessor(1024, 1, 1);

//       sourceNodeRef.current.connect(processorNodeRef.current);
//       processorNodeRef.current.connect(audioContextRef.current.destination);

//       processorNodeRef.current.onaudioprocess = (e) => {
//         const inputData = e.inputBuffer.getChannelData(0);
//         const audioData = convertFloat32ToInt16(inputData);
//         sendAudioChunk(audioData);
//       };

//     } catch (error) {
//       console.error('Error accessing audio:', error);
//     }
//   };
  
//   const stopAudio = () => {
//     if (sourceNodeRef.current) {
//       sourceNodeRef.current.disconnect();
//     }
//     if (processorNodeRef.current) {
//       processorNodeRef.current.disconnect();
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//     }
//     setIsAudioOn(false);
//   };

//   const convertFloat32ToInt16 = (buffer) => {
//     let l = buffer.length;
//     const buf = new Int16Array(l);
//     while (l--) {
//       buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
//     }
//     return buf.buffer;
//   };

//   const sendAudioChunk = (audioData) => {
//     const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioData)));
//     if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//       ws.current.send(JSON.stringify({
//         event: 'media',
//         media: {
//           payload: audioBase64,
//         },
//       }));
//     }
//   };

//   useEffect(() => {
//     if (isFullscreen) {
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then(stream => {
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//           }
//           // handleRecording(stream);
//           initWebSocket();

//           timerRef.current = setInterval(() => {
//             setDuration(prev => prev + 1);
//           }, 1000);
//         })
//         .catch(err => console.error("Error accessing media devices:", err));
//     }

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (!isFullscreen) {
//         stopAudio();
//         if (ws.current) {
//           ws.current.close();
//         }
//       }
//     };
//   }, [isFullscreen]);

//   const formatDuration = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}m ${remainingSeconds}s`;
//   };

//   const handleDownload = () => {
//     const blob = new Blob(recordedChunks, { type: 'video/webm' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'recording.webm';
//     a.click();
//   };
  
//   const stopVideo = () => {
//     const videoTracks = videoRef.current?.srcObject?.getTracks().filter(track => track.kind === 'video');
//     videoTracks.forEach(track => track.stop()); // Stop the video track
//   };

//   const handleEndCall = () => {
//     // handleStopRecording();
//     stopAudio();
//     stopVideo();
//     if (ws.current) {
//       ws.current.close();
//     }
//     navigate(`/feedback?interviewId=${interviewId}`);
//     exitFullscreen();
//   };

//   return (
//     <div className="h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex flex-col">
//       {!isFullscreen && validity && (
//         <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
//           <div className='pl-2 text-white'>{dialog}</div>
//           <Button
//             onClick={enterFullscreen}
//             className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             <Maximize2 className="mr-2 h-5 w-5" />
//             Enter Fullscreen
//           </Button>
//         </div>
//       )}
//       {!validity && (
//         <div className="flex-col absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 gap-4">
//           <div className='pl-2 text-white'>{dialog}</div>
//         </div>
//       )}

//       {isFullscreen && (
//         <div className="flex-grow flex justify-center items-center space-x-8 mb-2">
//           {/* User Video */}
//           <div className="w-96 h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//             <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               Duration: {formatDuration(duration)}
//             </div>
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               You
//             </div>
//           </div>

//           {/* Placeholder for the other participant */}
//           <div className="w-96 h-80 bg-white rounded-lg overflow-hidden relative shadow-xl">
//             <img
//               src="/images/saksham.jpeg"
//               alt="Saksham"
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
//               Saksham
//             </div>
//           </div>
//         </div>
//       )}

//       {isFullscreen && (
//         <div className="flex justify-center mb-24 space-x-4">
//           <Button
//             onClick={() => setIsAudioOn(!isAudioOn)}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             {isAudioOn ? (
//               <Mic className="mr-2 h-5 w-5" />
//             ) : (
//               <MicOff className="mr-2 h-5 w-5" />
//             )}
//             {isAudioOn ? 'Mute' : 'Unmute'}
//           </Button>

//           <Button
//             onClick={handleEndCall}
//             className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg"
//           >
//             <Phone className="mr-2 h-5 w-5 rotate-180" />
//             End Call
//           </Button>

//           {/* {isRecording && (
//             <Button
//               onClick={handleDownload}
//               className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg"
//             >
//               Download Recording
//             </Button>
//           )} */}
//         </div>
//       )}

//       {/* Audio player with no controls, hidden from view */}
//       <audio ref={audioPlayerRef} style={{ display: 'none' }} />
//     </div>
//   );
// }