'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2 } from 'lucide-react';
import Vapi from '@vapi-ai/web';

interface InterviewSessionProps {
  onEnd: () => void;
    hasStarted: boolean;
}

export default function InterviewSession({ onEnd, hasStarted }: InterviewSessionProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    if (isVideoOn) {
      startMedia();
    } else {
      if (videoRef.current) {
        const tracks = (videoRef.current.srcObject as MediaStream)?.getTracks();
        tracks?.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string);



    
    const startVapi = async () => {
      try {
       await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID as string);
      } catch (err) {
        console.error('Error starting Vapi:', err);
      }
    };

    vapi.on('speech-start', () => {
      setAiSpeaking(true);
    });

    vapi.on('speech-end', () => {
      setAiSpeaking(false);
    });

    vapi.on('volume-level', (volume) => {
      // Optional: Use volume to drive visualizer intensity
      // console.log('Volume:', volume);

      
    });

    
    startVapi();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      vapi.stop();
      vapi.removeAllListeners();
    };
  }, [isVideoOn]);

  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white font-medium">Live Interview Session</span>
        </div>
        <div className="text-gray-400 text-sm">{new Date().toLocaleTimeString()}</div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        
        {/* Left Side: User */}
        <div className="flex-1 bg-slate-700 rounded-2xl overflow-hidden relative border border-gray-700 shadow-2xl">
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm z-10">
            You
          </div>
          {isVideoOn ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            {!isMicOn && (
              <div className="bg-red-500/80 p-2 rounded-full">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: AI Agent */}
        <div className="flex-1 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border border-indigo-500/30 shadow-2xl">
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            AI Interviewer
          </div>
          
          {/* AI Visualizer */}
          <div className="relative">
            {/* Outer Glow */}
            <div className={`absolute inset-0 bg-cyan-500 blur-3xl opacity-20 transition-all duration-500 ${aiSpeaking ? 'scale-150 opacity-40' : 'scale-100'}`} />
            
            {/* Core Circle */}
            <div className="relative w-48 h-48 rounded-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 transition-all duration-300 shadow-[0_0_50px_rgba(6,182,212,0.5)] ${aiSpeaking ? 'scale-110' : 'scale-100'}`}>
                 <div className="w-full h-full rounded-full bg-[url('https://img.freepik.com/free-vector/artificial-intelligence-robot-face-technology-background_1017-23146.jpg')] bg-cover bg-center opacity-80 mix-blend-overlay" />
              </div>
            </div>

            {/* Sound Waves Animation */}
            {aiSpeaking && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/20 rounded-full animate-ping" />
            )}
             {aiSpeaking && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-cyan-500/30 rounded-full animate-ping animation-delay-500" />
            )}
          </div>

          <div className="mt-8 text-cyan-200 font-medium tracking-wide">
            {aiSpeaking ? 'Speaking...' : 'Listening...'}
          </div>
          
          {/* Audio Visualizer Bars (Fake) */}
          <div className="flex items-end justify-center space-x-1 h-12 mt-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`w-2 bg-cyan-400 rounded-t-full transition-all duration-150 ${aiSpeaking ? 'animate-bounce' : 'h-2'}`}
                style={{ 
                  height: aiSpeaking ? `${Math.random() * 100}%` : '20%',
                  animationDelay: `${i * 0.1}s` 
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Controls Footer */}
      <div className="bg-slate-700 p-6 flex justify-center items-center space-x-6">
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full transition-all ${
            isMicOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all ${
            isVideoOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        <button
          onClick={onEnd}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center space-x-2 transition-all hover:scale-105"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Interview</span>
        </button>
      </div>
    </div>
  );
}
