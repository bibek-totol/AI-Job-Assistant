"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Wifi, WifiOff, Clock } from "lucide-react"
import toast from "react-hot-toast"
import gsap from "gsap"
import {
  buildAssistantOverrides,
  buildInterviewSystemPrompt,
  formatVapiError,
  getActiveVapiClient,
  startVapiSession,
  stopVapiSession,
} from "@/lib/vapi-interview"

interface InterviewSessionProps {
  onEnd: () => void
  hasStarted: boolean
  questions?: string[]
  candidateName?: string
  jobTitle?: string
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  connecting: { label: "Connecting",  color: "#FFB547", bg: "rgba(255,181,71,0.15)" },
  connected:  { label: "Live",        color: "#00E5BE", bg: "rgba(0,229,190,0.15)" },
  ended:      { label: "Ended",       color: "rgba(255,255,255,0.30)", bg: "rgba(255,255,255,0.06)" },
  error:      { label: "Error",       color: "#FF7C5C", bg: "rgba(255,124,92,0.15)" },
}

export default function InterviewSession({
  onEnd,
  hasStarted,
  questions = [],
  candidateName,
  jobTitle,
}: InterviewSessionProps) {
  const [isMicOn, setIsMicOn]             = useState(true)
  const [isVideoOn, setIsVideoOn]         = useState(true)
  const [aiSpeaking, setAiSpeaking]       = useState(false)
  const [isVapiReady, setIsVapiReady]     = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("connecting")
  const [elapsed, setElapsed]             = useState(0)

  const videoRef         = useRef<HTMLVideoElement>(null)
  const mediaStreamRef   = useRef<MediaStream | null>(null)
  const orbRef           = useRef<HTMLDivElement>(null)
  const pulseRef         = useRef<HTMLDivElement>(null)
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null)
  const ctxRef           = useRef<gsap.Context | null>(null)

  const interviewCtx = useRef({ questions, candidateName, jobTitle })
  interviewCtx.current = { questions, candidateName, jobTitle }

  // ─── AI orb animation ───
  useEffect(() => {
    if (!orbRef.current || !pulseRef.current) return
    ctxRef.current = gsap.context(() => {
      // Idle breathe
      gsap.to(orbRef.current, { scale: aiSpeaking ? 1.15 : 1, duration: aiSpeaking ? 0.3 : 0.8, ease: aiSpeaking ? "power2.out" : "sine.inOut" })
      gsap.to(orbRef.current, { boxShadow: aiSpeaking ? "0 0 80px rgba(108,99,255,0.65), 0 0 30px rgba(0,229,190,0.3)" : "0 0 40px rgba(108,99,255,0.30)", duration: 0.4 })

      // Pulse ring
      if (aiSpeaking) {
        gsap.fromTo(pulseRef.current, { scale: 1, opacity: 0.6 }, { scale: 2.2, opacity: 0, duration: 1.2, ease: "power2.out", repeat: -1 })
      } else {
        gsap.killTweensOf(pulseRef.current)
        gsap.set(pulseRef.current, { scale: 1, opacity: 0 })
      }
    })
    return () => ctxRef.current?.revert()
  }, [aiSpeaking])

  // ─── Timer ───
  useEffect(() => {
    if (connectionStatus === "connected") {
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [connectionStatus])

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  // ─── Camera ───
  const attachVideo = useCallback((stream: MediaStream | null) => {
    if (videoRef.current) videoRef.current.srcObject = stream
  }, [])

  useEffect(() => {
    if (!hasStarted) return
    let cancelled = false
    const setup = async () => {
      if (!isVideoOn) {
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
        attachVideo(null)
        return
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }
        mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = stream
        attachVideo(stream)
      } catch { toast.error("Camera unavailable. Video preview disabled.") }
    }
    setup()
    return () => { cancelled = true }
  }, [hasStarted, isVideoOn, attachVideo])

  // ─── Vapi session ───
  useEffect(() => {
    if (!hasStarted) return
    let cancelled = false

    const start = async () => {
      const apiKey     = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
      const { questions: qs, candidateName: name, jobTitle: title } = interviewCtx.current

      if (!apiKey || !assistantId) {
        setConnectionStatus("error")
        toast.error("Missing Vapi environment variables")
        return
      }

      try {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true })
          s.getTracks().forEach((t) => t.stop())
        } catch {
          setConnectionStatus("error")
          toast.error("Microphone access denied. Please allow mic permissions.")
          return
        }

        await startVapiSession(apiKey, assistantId, buildAssistantOverrides(qs, name, title), {
          systemPrompt: buildInterviewSystemPrompt(qs, name, title),
          onCallStart:  () => { if (!cancelled) { setIsVapiReady(true); setConnectionStatus("connected"); toast.success("Connected! Say \"I'm ready\" to begin.") } },
          onCallEnd:    () => { if (!cancelled) { setIsVapiReady(false); setConnectionStatus("ended") } },
          onSpeechStart: () => { if (!cancelled) setAiSpeaking(true) },
          onSpeechEnd:   () => { if (!cancelled) setAiSpeaking(false) },
          onMessage: (message) => {
            const msg = message as { type?: string; status?: string; endedReason?: string }
            if (msg?.type === "status-update" && msg.status === "ended") {
              const reason = msg.endedReason || ""
              if (reason === "silence-timed-out") {
                toast.error("Interview ended due to inactivity. Check your microphone.", { duration: 6000 })
              } else if (reason === "customer-ended-call" || reason === "assistant-ended-call") {
                toast.success("Interview completed.")
              } else if (
                reason.includes("quota") ||
                reason.includes("credit") ||
                reason.includes("billing") ||
                reason.includes("limit")
              ) {
                toast.error("Vapi account credit/quota limit reached. Check your Vapi dashboard balance.", { duration: 8000 })
              } else if (reason.includes("transcriber") || reason.includes("vapifault")) {
                toast.error(`Vapi Transcriber error: ${reason}. Using fallback transcriber.`, { duration: 8000 })
              } else if (reason && reason !== "meeting-has-ended") {
                toast.error(`Interview ended: ${reason}`, { duration: 5000 })
              }
            }
          },
          onError: (error) => {
            if (cancelled) return
            const typed = error as { type?: string; error?: { message?: string } } | null
            const errorMsg = typeof typed?.error === "string" ? typed.error : typed?.error?.message || ""
            if (
              errorMsg.includes("KrispSDK") ||
              errorMsg.includes("worklet") ||
              typed?.type === "daily-error" ||
              typed?.type === "audio-processor-error"
            ) {
              return
            }
            setConnectionStatus("error")
            toast.error(`Interview error: ${formatVapiError(error)}`)
          },
        })
        if (cancelled) await stopVapiSession()
      } catch (error) {
        if (cancelled) return
        setConnectionStatus("error")
        toast.error(formatVapiError(error))
      }
    }

    start()
    return () => { cancelled = true; void stopVapiSession() }
  }, [hasStarted])

  useEffect(() => () => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
  }, [])

  const toggleMic = () => {
    const next = !isMicOn
    setIsMicOn(next)
    try {
      const client = getActiveVapiClient()
      if (client && client.getDailyCallObject()) {
        client.setMuted(!next)
      }
    } catch (err) {
      console.warn("[vapi] Mic toggle ignored (call not active):", err)
    }
  }

  const router = useRouter()

  const handleEnd = async () => {
    await stopVapiSession()
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
    onEnd()
    router.push("/interview-scheduler")
  }

  const statusMeta = STATUS_META[connectionStatus] ?? STATUS_META.connecting

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#080808" }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.60)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-3">
          {/* Brand */}
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6C63FF, #5a52d5)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M7 4L10 5.5V8.5L7 10L4 8.5V5.5L7 4Z" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {jobTitle ? `AI Interview · ${jobTitle}` : "AI Interview Session"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          {connectionStatus === "connected" && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Clock className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.35)" }} />
              <span className="text-xs font-mono text-white">{fmtTime(elapsed)}</span>
            </div>
          )}
          {/* Status badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: statusMeta.bg, border: `1px solid ${statusMeta.color}40` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusMeta.color }} />
            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: statusMeta.color }}>{statusMeta.label}</span>
          </div>
        </div>
      </div>

      {/* ── Main panels ── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 overflow-hidden">

        {/* Candidate camera */}
        <div className="relative rounded-2xl overflow-hidden" style={{ background: "#0c0c0c", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.60)", backdropFilter: "blur(8px)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.50)" }} />
            <span className="text-xs text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>{candidateName || "You"}</span>
          </div>

          {isVideoOn ? (
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <VideoOff className="w-7 h-7" style={{ color: "rgba(255,255,255,0.25)" }} />
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>Camera off</p>
            </div>
          )}

          {!isMicOn && (
            <div className="absolute bottom-3 left-3 p-2 rounded-full" style={{ background: "rgba(255,124,92,0.85)" }}>
              <MicOff className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* AI orb panel */}
        <div
          className="relative rounded-2xl flex flex-col items-center justify-center overflow-hidden min-h-[220px]"
          style={{ background: "#0c0c0c", border: "1px solid rgba(108,99,255,0.18)" }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          {/* Ambient */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(108,99,255,0.12) 0%, transparent 65%)" }} />

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.60)", backdropFilter: "blur(8px)" }}>
            <span className="text-xs text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>AI Interviewer</span>
          </div>

          {/* Orb */}
          <div className="relative flex items-center justify-center">
            {/* Pulse ring */}
            <div
              ref={pulseRef}
              className="absolute w-36 h-36 rounded-full pointer-events-none"
              style={{ border: "1px solid rgba(108,99,255,0.4)", opacity: 0 }}
            />
            {/* Main orb */}
            <div
              ref={orbRef}
              className="w-28 h-28 rounded-full relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4a43c0 50%, #00E5BE 100%)",
                boxShadow: "0 0 40px rgba(108,99,255,0.30)",
                willChange: "transform, box-shadow",
              }}
            >
              {/* Gloss overlay */}
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18) 0%, transparent 60%)" }} />
              {/* Speaking wave bars */}
              {aiSpeaking && (
                <div className="absolute inset-0 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 3].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full"
                      style={{
                        height: `${h * 10}px`,
                        background: "rgba(255,255,255,0.7)",
                        animation: `bounce ${0.4 + i * 0.08}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status text */}
          <div className="mt-6 text-center px-4">
            <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {aiSpeaking ? "Speaking..." : connectionStatus === "connected" ? "Listening..." : connectionStatus === "connecting" ? "Connecting..." : "Session ended"}
            </p>
            {isVapiReady && !aiSpeaking && (
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}>
                Say "I'm ready" to begin
              </p>
            )}
            {questions.length > 0 && (
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.20)", fontFamily: "'DM Sans', sans-serif" }}>
                {questions.length} questions loaded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Control bar ── */}
      <div className="shrink-0 px-6 py-5 flex items-center justify-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.60)", backdropFilter: "blur(12px)" }}>
        {/* Mic */}
        <button
          onClick={toggleMic}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: isMicOn ? "rgba(255,255,255,0.07)" : "rgba(255,124,92,0.18)",
            border: `1px solid ${isMicOn ? "rgba(255,255,255,0.12)" : "rgba(255,124,92,0.35)"}`,
          }}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.08, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
          title={isMicOn ? "Mute microphone" : "Unmute microphone"}
        >
          {isMicOn
            ? <Mic className="w-5 h-5 text-white" />
            : <MicOff className="w-5 h-5" style={{ color: "#FF7C5C" }} />}
        </button>

        {/* Video */}
        <button
          onClick={() => setIsVideoOn((v) => !v)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: isVideoOn ? "rgba(255,255,255,0.07)" : "rgba(255,124,92,0.18)",
            border: `1px solid ${isVideoOn ? "rgba(255,255,255,0.12)" : "rgba(255,124,92,0.35)"}`,
          }}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.08, duration: 0.2 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
          title={isVideoOn ? "Turn off camera" : "Turn on camera"}
        >
          {isVideoOn
            ? <Video className="w-5 h-5 text-white" />
            : <VideoOff className="w-5 h-5" style={{ color: "#FF7C5C" }} />}
        </button>

        {/* End call */}
        <button
          onClick={handleEnd}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all duration-200"
          style={{ background: "#c0392b", boxShadow: "0 0 20px rgba(192,57,43,0.35)" }}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, boxShadow: "0 0 35px rgba(192,57,43,0.60)", duration: 0.25 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, boxShadow: "0 0 20px rgba(192,57,43,0.35)", duration: 0.25 })}
        >
          <PhoneOff className="w-4 h-4" />
          End Interview
        </button>
      </div>

      {/* Wave animation */}
      <style>{`
        @keyframes bounce {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.5); }
        }
      `}</style>
    </div>
  )
}