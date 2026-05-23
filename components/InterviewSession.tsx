"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  buildAssistantOverrides,
  buildInterviewSystemPrompt,
  formatVapiError,
  getActiveVapiClient,
  startVapiSession,
  stopVapiSession,
} from "@/lib/vapi-interview";

interface InterviewSessionProps {
  onEnd: () => void;
  hasStarted: boolean;
  questions?: string[];
  candidateName?: string;
  jobTitle?: string;
}

export default function InterviewSession({
  onEnd,
  hasStarted,
  questions = [],
  candidateName,
  jobTitle,
}: InterviewSessionProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [isVapiReady, setIsVapiReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [endReason, setEndReason] = useState<string | null>(null);
  const [micReady, setMicReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const interviewContextRef = useRef({
    questions,
    candidateName,
    jobTitle,
  });

  interviewContextRef.current = { questions, candidateName, jobTitle };

  const attachVideoStream = useCallback((stream: MediaStream | null) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, []);

  // Local camera preview only — separate from Vapi/Daily lifecycle
  useEffect(() => {
    if (!hasStarted) return;

    let cancelled = false;

    const setupMedia = async () => {
      if (!isVideoOn) {
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        attachVideoStream(null);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = stream;
        attachVideoStream(stream);
      } catch (error) {
        console.error("Camera error:", error);
        toast.error("Could not access camera. Video preview disabled.");
      }
    };

    setupMedia();

    return () => {
      cancelled = true;
    };
  }, [hasStarted, isVideoOn, attachVideoStream]);

  // Vapi voice interview — runs once when session starts
  useEffect(() => {
    if (!hasStarted) return;

    let cancelled = false;

    const startInterview = async () => {
      const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
      const { questions: qs, candidateName: name, jobTitle: title } =
        interviewContextRef.current;

      if (!apiKey) {
        setConnectionStatus("error");
        toast.error("Missing NEXT_PUBLIC_VAPI_PUBLIC_KEY in environment");
        return;
      }

      if (!assistantId) {
        setConnectionStatus("error");
        toast.error("Missing NEXT_PUBLIC_VAPI_ASSISTANT_ID in environment");
        return;
      }

      setConnectionStatus("connecting");

      try {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          micStream.getTracks().forEach((track) => track.stop());
          setMicReady(true);
        } catch {
          setMicReady(false);
          toast.error(
            "Microphone access denied. Allow mic permission to continue the interview.",
          );
          setConnectionStatus("error");
          return;
        }

        const overrides = buildAssistantOverrides(qs, name, title);
        const systemPrompt = buildInterviewSystemPrompt(qs, name, title);

        await startVapiSession(apiKey, assistantId, overrides, {
          systemPrompt,
          onCallStart: () => {
            if (cancelled) return;
            setIsVapiReady(true);
            setConnectionStatus("connected");
            toast.success("Connected! Say \"I'm ready\" to begin.");
          },
          onCallEnd: () => {
            if (cancelled) return;
            setIsVapiReady(false);
            setConnectionStatus("ended");
          },
          onSpeechStart: () => {
            if (!cancelled) setAiSpeaking(true);
          },
          onSpeechEnd: () => {
            if (!cancelled) setAiSpeaking(false);
          },
          onMessage: (message) => {
            const msg = message as {
              type?: string;
              status?: string;
              endedReason?: string;
            };
            if (
              msg.type === "status-update" &&
              msg.status === "ended" &&
              msg.endedReason
            ) {
              setEndReason(msg.endedReason);
              if (msg.endedReason === "silence-timed-out") {
                toast.error(
                  "Interview ended: no speech detected. Check your microphone and try again.",
                  { duration: 6000 },
                );
              }
            }
          },
          onError: (error) => {
            if (cancelled) return;
            const typed = error as { type?: string } | null;
            if (typed?.type === "daily-error") return;
            console.error("Vapi error:", error);
            setConnectionStatus("error");
            toast.error(`Interview error: ${formatVapiError(error)}`);
          },
        });

        if (cancelled) {
          await stopVapiSession();
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Error starting Vapi:", error);
        setConnectionStatus("error");
        toast.error(formatVapiError(error));
      }
    };

    startInterview();

    return () => {
      cancelled = true;
      void stopVapiSession();
    };
  }, [hasStarted]);

  // Cleanup media on unmount
  useEffect(() => {
    return () => {
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    };
  }, []);

  const toggleMic = () => {
    const next = !isMicOn;
    setIsMicOn(next);
    const vapi = getActiveVapiClient();
    vapi?.setMuted(!next);
  };

  const toggleVideo = () => setIsVideoOn(!isVideoOn);

  const handleEndInterview = async () => {
    await stopVapiSession();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    onEnd();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      <div className="bg-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full animate-pulse ${isVapiReady ? "bg-green-500" : connectionStatus === "error" ? "bg-red-500" : "bg-yellow-500"}`}
          />
          <span className="text-white font-medium">
            Live Interview Session ({connectionStatus})
          </span>
        </div>
        <div className="text-gray-400 text-sm">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
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

        <div className="flex-1 bg-linear-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border border-indigo-500/30 shadow-2xl">
          <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
            AI Interviewer
          </div>

          <div className="relative">
            <div
              className={`absolute inset-0 bg-cyan-500 blur-3xl opacity-20 transition-all duration-500 ${aiSpeaking ? "scale-150 opacity-40" : "scale-100"}`}
            />
            <div className="relative w-48 h-48 rounded-full bg-black/30 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center">
              <div
                className={`w-32 h-32 rounded-full bg-linear-to-tr from-cyan-500 to-blue-600 transition-all duration-300 shadow-[0_0_50px_rgba(6,182,212,0.5)] ${aiSpeaking ? "scale-110" : "scale-100"}`}
              >
                <div className="w-full h-full rounded-full bg-[url('https://img.freepik.com/free-vector/artificial-intelligence-robot-face-technology-background_1017-23146.jpg')] bg-cover bg-center opacity-80 mix-blend-overlay" />
              </div>
            </div>
            {aiSpeaking && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/20 rounded-full animate-ping" />
            )}
          </div>

          <div className="mt-8 text-cyan-200 font-medium tracking-wide">
            {aiSpeaking ? "Speaking..." : "Listening..."}
          </div>

          {isVapiReady && !aiSpeaking && (
            <p className="mt-3 px-6 text-center text-amber-200 text-sm animate-pulse">
              Speak clearly into your microphone — say &quot;I&apos;m ready&quot; to
              start
            </p>
          )}

          {endReason === "silence-timed-out" && (
            <p className="mt-3 px-6 text-center text-red-300 text-sm">
              Call ended due to silence. Unmute your mic and restart the interview.
            </p>
          )}

          {questions.length > 0 && (
            <p className="mt-4 px-6 text-center text-cyan-100/70 text-sm">
              {questions.length} tailored questions loaded for this session
            </p>
          )}
        </div>
      </div>

      <div className="bg-slate-700 p-6 flex justify-center items-center space-x-6">
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full transition-all ${
            isMicOn
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {isMicOn ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all ${
            isVideoOn
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {isVideoOn ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={handleEndInterview}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold flex items-center space-x-2 transition-all hover:scale-105"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Interview</span>
        </button>
      </div>
    </div>
  );
}
