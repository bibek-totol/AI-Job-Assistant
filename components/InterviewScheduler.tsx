"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Briefcase,
  ClipboardList,
  ChevronDown,
  Calendar,
  Loader2,
  Link2,
  Copy,
  Check,
  RotateCcw,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import gsap from "gsap";

const INTERVIEW_TYPES = [
  { value: "technical", label: "Technical Interview" },
  { value: "behavioral", label: "Behavioral Interview" },
  { value: "mock", label: "Mock Interview" },
];

const NEXT_STEPS = [
  "AI generates 15 tailored interview questions",
  "You receive a unique shareable interview link",
  "Share the link with your candidates",
  "AI conducts the interview automatically",
];

interface GeneratedData {
  link: string;
  questions: string[];
}

/* ─── Styled field wrapper ─── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-mono uppercase tracking-wider mb-2.5"
      style={{ color: "rgba(255,255,255,0.28)" }}
    >
      {children}
    </p>
  );
}

function StyledInput({
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "rgba(255,255,255,0.22)" }}
        />
      )}
      <input
        {...props}
        className="w-full rounded-xl py-3 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.18)]"
        style={{
          paddingLeft: Icon ? "2.75rem" : "1rem",
          paddingRight: "1rem",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.78)",
          fontFamily: "'DM Sans', sans-serif",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(108,99,255,0.45)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

/* ─── Main ─── */
export default function InterviewScheduler() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewType, setInterviewType] = useState("technical");
  const [interviewTime, setInterviewTime] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        headerRef.current?.querySelectorAll(".h-el") ?? [],
        { y: 28, opacity: 0, filter: "blur(5px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, stagger: 0.1 },
        0.1,
      );
      tl.fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.35,
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (generatedData && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );
    }
  }, [generatedData]);

  const canSubmit =
    !!jobTitle.trim() &&
    !!jobDescription.trim() &&
    !!interviewTime &&
    !isGenerating;

  const handleSchedule = async () => {
    if (!canSubmit) return;
    const toastId = toast.loading("Generating interview questions...");
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, interviewType }),
      });
      if (!res.ok) throw new Error("Failed to generate questions");
      const data = await res.json();
      const randomId = Math.random().toString(36).substring(2, 10);

      const saveRes = await fetch(`/api/interview/${randomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: data.questions,
          jobTitle,
          jobDescription,
          interviewType,
        }),
      });
      if (!saveRes.ok) throw new Error("Failed to save interview session");

      sessionStorage.setItem(
        `interview_questions_${randomId}`,
        JSON.stringify(data.questions),
      );
      toast.success("Interview link ready!", { id: toastId });
      setGeneratedData({
        link: `${window.location.origin}/interview/${randomId}`,
        questions: data.questions,
      });
    } catch {
      toast.error("Failed to generate questions", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedData) return;
    await navigator.clipboard.writeText(generatedData.link);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReset = () => {
    setGeneratedData(null);
    setJobTitle("");
    setJobDescription("");
    setInterviewTime("");
    setCopied(false);
    setShowQuestions(false);
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#080808] pt-24 pb-20">
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 400,
          background:
            "radial-gradient(ellipse at top, rgba(108,99,255,0.09) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <div
            className="h-el inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-6"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              opacity: 0,
            }}
          >
            <span
              className="w-1.5 h-1.5 flex items-center justify-center rounded-full"
              style={{
                background: "#6C63FF",
                boxShadow: "0 0 8px rgba(108,99,255,0.8)",
              }}
            />
          </div>
          <h1
            className="h-el text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              opacity: 0,
            }}
          >
            Set up your{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a39bff 0%, #6C63FF 50%, #00E5BE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI interview.
            </span>
          </h1>
          <p
            className="h-el text-sm max-w-md mx-auto leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.32)",
              fontFamily: "'DM Sans', sans-serif",
              opacity: 0,
            }}
          >
            Describe the role, pick a type, and let AI generate a tailored
            interview session with a shareable link.
          </p>
        </div>

        {/* Form */}
        {!generatedData && (
          <div
            ref={formRef}
            className="rounded-2xl p-6 sm:p-8"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(12px)",
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-2 mb-8">
              <ClipboardList
                className="w-4 h-4"
                style={{ color: "rgba(255,255,255,0.20)" }}
              />
              <span
                className="text-xs font-mono uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.20)" }}
              >
                Interview Setup
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <FieldLabel>Job Title</FieldLabel>
                <StyledInput
                  icon={Briefcase}
                  placeholder="e.g. Senior Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div>
                <FieldLabel>Job Description</FieldLabel>
                <div className="relative">
                  <ClipboardList
                    className="absolute left-4 top-4 w-4 h-4 pointer-events-none"
                    style={{ color: "rgba(255,255,255,0.18)" }}
                  />
                  <textarea
                    rows={5}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description or key responsibilities..."
                    className="w-full resize-none rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.15)]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.75)",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.7,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(108,99,255,0.45)";
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
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Interview Type</FieldLabel>
                  <div className="relative">
                    <select
                      value={interviewType}
                      onChange={(e) => setInterviewType(e.target.value)}
                      className="w-full appearance-none px-4 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.70)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(108,99,255,0.45)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(108,99,255,0.08)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.08)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {INTERVIEW_TYPES.map((t) => (
                        <option
                          key={t.value}
                          value={t.value}
                          style={{ background: "#141414", color: "#fff" }}
                        >
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.22)" }}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Date & Time</FieldLabel>
                  <StyledInput
                    icon={Calendar}
                    type="datetime-local"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                  />
                </div>
              </div>

              {/* What happens next */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "rgba(108,99,255,0.05)",
                  border: "1px solid rgba(108,99,255,0.12)",
                }}
              >
                <p
                  className="text-[10px] font-mono uppercase tracking-wider mb-3.5"
                  style={{ color: "rgba(108,99,255,0.65)" }}
                >
                  What happens next
                </p>
                <ul className="space-y-2">
                  {NEXT_STEPS.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold mt-0.5"
                        style={{
                          background: "rgba(108,99,255,0.20)",
                          color: "#8B82FF",
                          border: "1px solid rgba(108,99,255,0.30)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="text-xs leading-relaxed"
                        style={{
                          color: "rgba(255,255,255,0.42)",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit */}
              <button
                onClick={handleSchedule}
                disabled={!canSubmit}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background: !canSubmit
                    ? "rgba(255,255,255,0.04)"
                    : isGenerating
                      ? "rgba(108,99,255,0.40)"
                      : "linear-gradient(135deg, #6C63FF, #5a52d5)",
                  color: !canSubmit ? "rgba(255,255,255,0.20)" : "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow:
                    canSubmit && !isGenerating
                      ? "0 0 30px rgba(108,99,255,0.28), inset 0 1px 0 rgba(255,255,255,0.15)"
                      : "none",
                  cursor: !canSubmit ? "not-allowed" : "pointer",
                  border: !canSubmit
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (canSubmit && !isGenerating)
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
                      canSubmit && !isGenerating
                        ? "0 0 30px rgba(108,99,255,0.28)"
                        : "none",
                    duration: 0.25,
                  })
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating interview...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    Generate Interview
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {generatedData && (
          <div ref={resultRef} style={{ opacity: 0 }} className="space-y-4">
            {/* Link card */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                border: "1px solid rgba(0,229,190,0.18)",
                background: "rgba(0,229,190,0.03)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(0,229,190,0.12)",
                    border: "1px solid rgba(0,229,190,0.20)",
                  }}
                >
                  <Link2 className="w-4 h-4" style={{ color: "#00E5BE" }} />
                </div>
                <div>
                  <p
                    className="text-sm font-bold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Interview Link Ready
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: "rgba(255,255,255,0.30)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {generatedData.questions.length} tailored questions
                    generated
                  </p>
                </div>
              </div>

              {/* Link row */}
              <div
                className="flex items-center gap-2 p-3.5 rounded-xl mb-5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="flex-1 text-sm truncate font-mono"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {generatedData.link}
                </p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: copied
                      ? "rgba(0,229,190,0.12)"
                      : "rgba(255,255,255,0.06)",
                    border: `1px solid ${copied ? "rgba(0,229,190,0.30)" : "rgba(255,255,255,0.10)"}`,
                    color: copied ? "#00E5BE" : "rgba(255,255,255,0.55)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Open link */}
              <a
                href={generatedData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: "rgba(0,229,190,0.08)",
                  border: "1px solid rgba(0,229,190,0.18)",
                  color: "#00E5BE",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget, {
                    background: "rgba(0,229,190,0.15)",
                    borderColor: "rgba(0,229,190,0.35)",
                    duration: 0.25,
                  })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, {
                    background: "rgba(0,229,190,0.08)",
                    borderColor: "rgba(0,229,190,0.18)",
                    duration: 0.25,
                  })
                }
              >
                <span>Open Interview Session</span>
                <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </a>
            </div>

            {/* Generated questions */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <button
                onClick={() => {
                  setShowQuestions((v) => !v);
                  const el = document.getElementById("q-list");
                  if (el)
                    gsap.to(el, {
                      height: showQuestions ? 0 : "auto",
                      opacity: showQuestions ? 0 : 1,
                      duration: 0.4,
                      ease: "power3.out",
                    });
                }}
                className="w-full flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-2.5">
                  <ClipboardList
                    className="w-4 h-4"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  />
                  <span
                    className="text-sm font-semibold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Generated Questions
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                    style={{
                      background: "rgba(108,99,255,0.15)",
                      color: "#8B82FF",
                    }}
                  >
                    {generatedData.questions.length}
                  </span>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-300"
                  style={{
                    color: "rgba(255,255,255,0.30)",
                    transform: showQuestions
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>

              <div
                id="q-list"
                style={{ overflow: "hidden", height: 0, opacity: 0 }}
              >
                <div
                  className="px-6 pb-6"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="pt-4 space-y-2">
                    {generatedData.questions.map((q, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 py-2.5 px-3.5 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span
                          className="shrink-0 text-[10px] font-mono mt-0.5 w-5 text-right"
                          style={{ color: "rgba(108,99,255,0.55)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color: "rgba(255,255,255,0.55)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {q}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.42)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget, {
                    borderColor: "rgba(255,255,255,0.22)",
                    color: "#fff",
                    duration: 0.22,
                  })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, {
                    borderColor: "rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.42)",
                    duration: 0.22,
                  })
                }
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Schedule Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
