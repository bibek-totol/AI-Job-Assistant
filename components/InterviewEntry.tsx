"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, Video, CheckCircle2, Loader2, Hash } from "lucide-react";
import toast from "react-hot-toast";
import gsap from "gsap";
import InterviewSession from "@/components/InterviewSession";

interface InterviewEntryProps {
  id: string;
}

const PRE_CHECKS = [
  { icon: Mic, label: "Microphone permissions required", note: "required" },
  {
    icon: Video,
    label: "Camera is optional for video preview",
    note: "optional",
  },
  {
    icon: CheckCircle2,
    label: "Ensure you're in a quiet environment",
    note: "recommended",
  },
];

export default function InterviewEntry({ id }: InterviewEntryProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState<string | undefined>();
  const [loadingQ, setLoadingQ] = useState(true);

  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        headerRef.current?.querySelectorAll(".h-el") ?? [],
        { y: 24, opacity: 0, filter: "blur(4px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.09 },
        0.1,
      );
      tl.fromTo(
        cardRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        0.3,
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingQ(true);
      try {
        const res = await fetch(`/api/interview/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setQuestions(data.questions ?? []);
            setJobTitle(data.jobTitle);
          }
          return;
        }
      } catch (err) {
        console.error("API fetch failed:", err);
      }

      const stored = sessionStorage.getItem(`interview_questions_${id}`);
      if (stored && !cancelled) {
        try {
          setQuestions(JSON.parse(stored));
        } catch {}
      }
      if (!cancelled) setLoadingQ(false);
    };
    load().finally(() => {
      if (!cancelled) setLoadingQ(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      setHasStarted(true);
    }, 800);
  };

  const canStart = !!name.trim() && !!email.trim() && !isStarting && !loadingQ;

  if (hasStarted) {
    return (
      <InterviewSession
        hasStarted={hasStarted}
        onEnd={() => {
          setHasStarted(false);
          setName("");
          setEmail("");
          router.push("/interview-scheduler");
        }}
        questions={questions}
        candidateName={name}
        jobTitle={jobTitle}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-20">
      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse at top, rgba(108,99,255,0.10) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <div
            className="h-el inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-5"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <span
              className="w-1.5 h-1.5 flex items-center justify-center rounded-full animate-pulse"
              style={{
                background: "#00E5BE",
                boxShadow: "0 0 8px rgba(0,229,190,0.8)",
              }}
            />
          </div>
          <h1
            className="h-el text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.025em",
            }}
          >
            Ready to{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a39bff 0%, #6C63FF 50%, #00E5BE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              begin?
            </span>
          </h1>
          <p
            className="h-el text-sm leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.30)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Enter your details below to start your AI-powered interview session.
          </p>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="rounded-2xl p-6 sm:p-8"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Interview ID + status */}
          <div
            className="flex items-center justify-between mb-7 pb-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <Hash
                className="w-3.5 h-3.5"
                style={{ color: "rgba(255,255,255,0.20)" }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                Interview ID:{" "}
                <span style={{ color: "rgba(255,255,255,0.50)" }}>{id}</span>
              </span>
            </div>
            {!loadingQ && (
              <span
                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={
                  questions.length > 0
                    ? {
                        background: "rgba(0,229,190,0.10)",
                        color: "#00E5BE",
                        border: "1px solid rgba(0,229,190,0.22)",
                      }
                    : {
                        background: "rgba(255,181,71,0.10)",
                        color: "#FFB547",
                        border: "1px solid rgba(255,181,71,0.22)",
                      }
                }
              >
                {questions.length > 0
                  ? `${questions.length} questions`
                  : "General questions"}
              </span>
            )}
            {loadingQ && (
              <Loader2
                className="w-4 h-4 animate-spin"
                style={{ color: "rgba(255,255,255,0.25)" }}
              />
            )}
          </div>

          {jobTitle && (
            <div
              className="mb-5 px-3.5 py-2.5 rounded-xl"
              style={{
                background: "rgba(108,99,255,0.06)",
                border: "1px solid rgba(108,99,255,0.14)",
              }}
            >
              <p
                className="text-xs"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Role:{" "}
                <span style={{ color: "#8B82FF", fontWeight: 600 }}>
                  {jobTitle}
                </span>
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {/* Name */}
            {[
              {
                label: "Full Name",
                type: "text",
                placeholder: "John Doe",
                value: name,
                setter: setName,
              },
              {
                label: "Email Address",
                type: "email",
                placeholder: "john@example.com",
                value: email,
                setter: setEmail,
              },
            ].map(({ label, type, placeholder, value, setter }) => (
              <div key={label}>
                <p
                  className="text-xs font-mono uppercase tracking-wider mb-2"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  {label}
                </p>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.18)]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.78)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(108,99,255,0.45)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(108,99,255,0.08)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Pre-checks */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{
              background: "rgba(108,99,255,0.05)",
              border: "1px solid rgba(108,99,255,0.12)",
            }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-wider mb-3"
              style={{ color: "rgba(108,99,255,0.60)" }}
            >
              Before you start
            </p>
            <ul className="space-y-2.5">
              {PRE_CHECKS.map(({ icon: Icon, label, note }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(108,99,255,0.14)",
                      border: "1px solid rgba(108,99,255,0.22)",
                    }}
                  >
                    <Icon className="w-3 h-3" style={{ color: "#8B82FF" }} />
                  </div>
                  <span
                    className="text-xs flex-1"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={
                      note === "required"
                        ? {
                            background: "rgba(255,124,92,0.12)",
                            color: "#FF7C5C",
                          }
                        : note === "optional"
                          ? {
                              background: "rgba(255,255,255,0.06)",
                              color: "rgba(255,255,255,0.30)",
                            }
                          : {
                              background: "rgba(0,229,190,0.08)",
                              color: "#00E5BE",
                            }
                    }
                  >
                    {note}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Start button */}
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              background: !canStart
                ? "rgba(255,255,255,0.04)"
                : isStarting
                  ? "rgba(108,99,255,0.40)"
                  : "linear-gradient(135deg, #6C63FF, #5a52d5)",
              color: !canStart ? "rgba(255,255,255,0.20)" : "#fff",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow:
                canStart && !isStarting
                  ? "0 0 30px rgba(108,99,255,0.28), inset 0 1px 0 rgba(255,255,255,0.15)"
                  : "none",
              cursor: !canStart ? "not-allowed" : "pointer",
              border: !canStart ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}
            onMouseEnter={(e) => {
              if (canStart && !isStarting)
                gsap.to(e.currentTarget, {
                  scale: 1.02,
                  boxShadow: "0 0 50px rgba(108,99,255,0.45)",
                  duration: 0.25,
                });
            }}
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                scale: 1,
                boxShadow:
                  canStart && !isStarting
                    ? "0 0 30px rgba(108,99,255,0.28)"
                    : "none",
                duration: 0.25,
              })
            }
          >
            {isStarting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : loadingQ ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading interview...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Start AI Interview
              </>
            )}
          </button>

          <p
            className="text-center text-[11px] mt-4"
            style={{
              color: "rgba(255,255,255,0.18)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            By starting, you agree to be recorded for evaluation purposes.
          </p>
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{
            color: "rgba(255,255,255,0.20)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Need help?{" "}
          <a
            href="mailto:support@aijobassistant.com"
            className="transition-colors duration-200"
            style={{ color: "rgba(108,99,255,0.65)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#8B82FF")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(108,99,255,0.65)")
            }
          >
            support@aijobassistant.com
          </a>
        </p>
      </div>
    </div>
  );
}
