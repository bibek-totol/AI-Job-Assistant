"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
  ArrowUpRight,
  BookOpen,
  Clock,
  BarChart2,
  MapPin,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface Course {
  title: string;
  platform: string;
  duration: string;
  reason: string;
  platformUrl: string;
  difficultyLevel: string;
}

const COUNTRIES = [
  "Bangladesh",
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "Australia",
  "Singapore",
];

function difficultyMeta(level: string) {
  switch (level?.toLowerCase()) {
    case "beginner":
      return {
        color: "#00E5BE",
        bg: "rgba(0,229,190,0.10)",
        border: "rgba(0,229,190,0.20)",
      };
    case "intermediate":
      return {
        color: "#FFB547",
        bg: "rgba(255,181,71,0.10)",
        border: "rgba(255,181,71,0.20)",
      };
    case "advanced":
      return {
        color: "#FF7C5C",
        bg: "rgba(255,124,92,0.10)",
        border: "rgba(255,124,92,0.20)",
      };
    default:
      return {
        color: "#8B82FF",
        bg: "rgba(108,99,255,0.10)",
        border: "rgba(108,99,255,0.20)",
      };
  }
}

/* ── File drop zone ── */
function FileDropZone({
  file,
  onFile,
  onClear,
}: {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const zoneRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f?.type === "application/pdf") onFile(f);
      else toast.error("Please upload a PDF file");
      gsap.to(zoneRef.current, {
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        duration: 0.25,
      });
    },
    [onFile],
  );

  useEffect(() => {
    gsap.to(zoneRef.current, {
      borderColor: file ? "rgba(0,229,190,0.35)" : "rgba(255,255,255,0.08)",
      background: file ? "rgba(0,229,190,0.04)" : "rgba(255,255,255,0.02)",
      duration: 0.35,
    });
  }, [file]);

  return (
    <div
      ref={zoneRef}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        gsap.to(zoneRef.current, {
          borderColor: "rgba(108,99,255,0.55)",
          background: "rgba(108,99,255,0.06)",
          duration: 0.2,
        });
      }}
      onDragLeave={() =>
        gsap.to(zoneRef.current, {
          borderColor: "rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          duration: 0.25,
        })
      }
      className="relative rounded-xl transition-all"
      style={{
        border: "1px dashed rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        minHeight: "120px",
      }}
    >
      {!file ? (
        <label className="flex flex-col items-center justify-center gap-3 cursor-pointer py-8 px-6">
          <input
            type="file"
            accept=".pdf"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <UploadCloud
              className="w-5 h-5"
              style={{ color: "rgba(255,255,255,0.28)" }}
            />
          </div>
          <div className="text-center">
            <p
              className="text-sm text-white"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Drop resume PDF or{" "}
              <span style={{ color: "#8B82FF" }}>browse</span>
            </p>
            <p
              className="text-xs mt-0.5"
              style={{
                color: "rgba(255,255,255,0.20)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              PDF only · Max 10 MB
            </p>
          </div>
        </label>
      ) : (
        <div className="flex items-center gap-4 px-5 py-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(0,229,190,0.10)",
              border: "1px solid rgba(0,229,190,0.20)",
            }}
          >
            <FileText className="w-4 h-4" style={{ color: "#00E5BE" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium text-white truncate"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {file.name}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{
                color: "rgba(255,255,255,0.28)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={onClear}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, {
                background: "rgba(255,124,92,0.12)",
                borderColor: "rgba(255,124,92,0.25)",
                duration: 0.2,
              })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, {
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.08)",
                duration: 0.2,
              })
            }
          >
            <X
              className="w-3.5 h-3.5"
              style={{ color: "rgba(255,255,255,0.38)" }}
            />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Course card ── */
function CourseCard({ course, index }: { course: Course; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const meta = difficultyMeta(course.difficultyLevel);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    gsap.to(glowRef.current, {
      x: e.clientX - rect.left - 120,
      y: e.clientY - rect.top - 120,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() =>
        gsap.to(cardRef.current, { y: -5, duration: 0.35, ease: "power2.out" })
      }
      onMouseLeave={() => {
        gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
        gsap.to(glowRef.current, { opacity: 0, duration: 0.35 });
      }}
      className="course-card relative rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
        willChange: "transform",
        opacity: 0,
      }}
    >
      {/* Magnetic glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 240,
          height: 240,
          background:
            "radial-gradient(circle, rgba(108,99,255,0.14) 0%, transparent 70%)",
          opacity: 0,
          zIndex: 0,
        }}
      />

      {/* Top accent */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(108,99,255,0.4), transparent)",
        }}
      />

      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(108,99,255,0.10)",
              border: "1px solid rgba(108,99,255,0.18)",
            }}
          >
            <BookOpen className="w-4 h-4" style={{ color: "#8B82FF" }} />
          </div>
          <span
            className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{
              background: meta.bg,
              color: meta.color,
              border: `1px solid ${meta.border}`,
            }}
          >
            {course.difficultyLevel}
          </span>
        </div>

        <h3
          className="text-sm font-bold text-white mb-4 leading-snug"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {course.title}
        </h3>

        {/* Meta */}
        <div className="space-y-2 mb-4">
          {[
            { icon: BookOpen, label: "Platform", value: course.platform },
            { icon: Clock, label: "Duration", value: course.duration },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: "rgba(255,255,255,0.22)" }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: "rgba(255,255,255,0.28)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {label}
                </span>
              </div>
              <span
                className="text-xs font-medium"
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Reason */}
        <div
          className="flex-1 rounded-xl p-3.5 mb-4"
          style={{
            background: "rgba(108,99,255,0.07)",
            border: "1px solid rgba(108,99,255,0.13)",
          }}
        >
          <p
            className="text-[10px] font-mono uppercase tracking-wider mb-1.5"
            style={{ color: "rgba(108,99,255,0.65)" }}
          >
            Why this course
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.42)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {course.reason}
          </p>
        </div>

        {/* CTA */}
        <a
          href={course.platformUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: "rgba(108,99,255,0.10)",
            border: "1px solid rgba(108,99,255,0.20)",
            color: "#8B82FF",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, {
              background: "rgba(108,99,255,0.22)",
              borderColor: "rgba(108,99,255,0.45)",
              color: "#fff",
              duration: 0.25,
            })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, {
              background: "rgba(108,99,255,0.10)",
              borderColor: "rgba(108,99,255,0.20)",
              color: "#8B82FF",
              duration: 0.25,
            })
          }
        >
          <span>View Course</span>
          <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </a>
      </div>
    </div>
  );
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-6 animate-pulse"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="h-2.5 rounded-full w-16"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
      </div>
      <div className="space-y-2 mb-4">
        <div
          className="h-3 rounded-full w-5/6"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="h-3 rounded-full w-3/4"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>
      <div className="space-y-2 mb-4">
        <div
          className="h-2.5 rounded-full w-2/3"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          className="h-2.5 rounded-full w-1/2"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>
      <div
        className="h-16 rounded-xl mb-4"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
      <div
        className="h-10 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  );
}

/* ── Main page ── */
export default function Courses() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobGoal, setJobGoal] = useState("");
  const [country, setCountry] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Entrance animation
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

  // Animate result cards
  useEffect(() => {
    if (!isAnalyzing && courses.length > 0 && resultsRef.current) {
      const cards = resultsRef.current.querySelectorAll(".course-card");
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.1,
        },
      );
    }
  }, [isAnalyzing, courses]);

  const canSubmit = (!!resumeFile || !!jobGoal.trim()) && !!country;

  const handleAnalyze = async () => {
    if (!country) {
      toast.error("Please select a country");
      return;
    }
    if (!resumeFile && !jobGoal.trim()) {
      toast.error("Upload a resume or describe your career goals");
      return;
    }

    setIsAnalyzing(true);
    const loadingToast = toast.loading("Generating course recommendations...");
    try {
      const formData = new FormData();
      if (resumeFile) formData.append("file", resumeFile);
      formData.append("jobGoal", jobGoal);
      formData.append("country", country);

      const res = await fetch("/api/recommend-courses", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCourses(data.courses || []);
      toast.success(`${data.courses?.length ?? 0} courses found!`, {
        id: loadingToast,
      });
    } catch {
      toast.error("Failed to get recommendations. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCourses([]);
    setResumeFile(null);
    setJobGoal("");
    setCountry("");
    toast.success("Ready to start over!");
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#080808] pt-24 pb-20">
      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse at top, rgba(108,99,255,0.09) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {/* Page header */}
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
                background: "#00E5BE",
                boxShadow: "0 0 8px rgba(0,229,190,0.8)",
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
            Learn what gets{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a39bff 0%, #6C63FF 50%, #00E5BE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              you hired.
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
            Upload your resume or describe your goals — we'll surface the exact
            courses that close your skill gaps.
          </p>
        </div>

        {/* ── Form ── */}
        {courses.length === 0 && (
          <div className="max-w-2xl mx-auto">
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
              <div className="flex items-center gap-2 mb-7">
                <BookOpen
                  className="w-4 h-4"
                  style={{ color: "rgba(255,255,255,0.20)" }}
                />
                <span
                  className="text-xs font-mono uppercase tracking-[0.18em]"
                  style={{ color: "rgba(255,255,255,0.20)" }}
                >
                  Your Preferences
                </span>
              </div>

              <div className="space-y-5">
                {/* File upload */}
                <div>
                  <p
                    className="text-xs font-mono uppercase tracking-wider mb-2.5"
                    style={{ color: "rgba(255,255,255,0.28)" }}
                  >
                    Upload Resume{" "}
                    <span
                      className="normal-case tracking-normal font-sans"
                      style={{ color: "rgba(255,255,255,0.18)" }}
                    >
                      (optional)
                    </span>
                  </p>
                  <FileDropZone
                    file={resumeFile}
                    onFile={setResumeFile}
                    onClear={() => setResumeFile(null)}
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  />
                  <span
                    className="text-xs font-mono"
                    style={{ color: "rgba(255,255,255,0.20)" }}
                  >
                    OR
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  />
                </div>

                {/* Goals textarea */}
                <div>
                  <p
                    className="text-xs font-mono uppercase tracking-wider mb-2.5"
                    style={{ color: "rgba(255,255,255,0.28)" }}
                  >
                    Describe Career Goals
                  </p>
                  <textarea
                    rows={4}
                    value={jobGoal}
                    onChange={(e) => setJobGoal(e.target.value)}
                    placeholder="e.g. I want to become a senior full-stack developer specialising in cloud infrastructure..."
                    className="w-full resize-none rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.16)]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.75)",
                      fontFamily: "'DM Sans', sans-serif",
                      lineHeight: 1.6,
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

                {/* Country select */}
                <div>
                  <p
                    className="text-xs font-mono uppercase tracking-wider mb-2.5"
                    style={{ color: "rgba(255,255,255,0.28)" }}
                  >
                    Country <span style={{ color: "#FF7C5C" }}>*</span>
                  </p>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.22)" }}
                    />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: country
                          ? "rgba(255,255,255,0.70)"
                          : "rgba(255,255,255,0.28)",
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
                      <option
                        value=""
                        style={{
                          background: "#141414",
                          color: "rgba(255,255,255,0.30)",
                        }}
                      >
                        Select a country
                      </option>
                      {COUNTRIES.map((c) => (
                        <option
                          key={c}
                          value={c}
                          style={{ background: "#141414", color: "#fff" }}
                        >
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                      style={{ color: "rgba(255,255,255,0.22)" }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleAnalyze}
                  disabled={!canSubmit || isAnalyzing}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300"
                  style={{
                    background: !canSubmit
                      ? "rgba(255,255,255,0.04)"
                      : isAnalyzing
                        ? "rgba(108,99,255,0.40)"
                        : "linear-gradient(135deg, #6C63FF, #5a52d5)",
                    color: !canSubmit ? "rgba(255,255,255,0.20)" : "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow:
                      canSubmit && !isAnalyzing
                        ? "0 0 30px rgba(108,99,255,0.28), inset 0 1px 0 rgba(255,255,255,0.15)"
                        : "none",
                    cursor:
                      !canSubmit || isAnalyzing ? "not-allowed" : "pointer",
                    border: !canSubmit
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (canSubmit && !isAnalyzing)
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
                        canSubmit && !isAnalyzing
                          ? "0 0 30px rgba(108,99,255,0.28)"
                          : "none",
                      duration: 0.25,
                    })
                  }
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Getting recommendations...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      Get Course Recommendations
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Skeleton ── */}
        {isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Results ── */}
        {!isAnalyzing && courses.length > 0 && (
          <div ref={resultsRef}>
            {/* Results header */}
            <div
              className="flex items-center justify-between mb-8 pb-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-px w-6 bg-[#00E5BE]" />
                  <span
                    className="text-xs font-mono uppercase tracking-[0.18em]"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    Results
                  </span>
                </div>
                <h3
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {courses.length} Recommended Courses
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin
                    className="w-3.5 h-3.5"
                    style={{ color: "rgba(255,255,255,0.22)" }}
                  />
                  <p
                    className="text-xs"
                    style={{
                      color: "rgba(255,255,255,0.28)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Tailored for{" "}
                    <span style={{ color: "rgba(255,255,255,0.55)" }}>
                      {country}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) =>
                  gsap.to(e.currentTarget, {
                    borderColor: "rgba(255,255,255,0.22)",
                    color: "#fff",
                    duration: 0.25,
                  })
                }
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, {
                    borderColor: "rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.45)",
                    duration: 0.25,
                  })
                }
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start Over
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, i) => (
                <CourseCard key={i} course={course} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
