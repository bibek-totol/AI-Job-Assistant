"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Mail,
  ClipboardList,
} from "lucide-react";
import gsap from "gsap";

/* ─── File Drop Zone (shared pattern) ─── */
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
      className="relative rounded-xl"
      style={{
        border: "1px dashed rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        minHeight: "116px",
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
              {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
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

/* ─── Step label ─── */
function StepLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
        style={{
          background: "rgba(108,99,255,0.18)",
          color: "#8B82FF",
          border: "1px solid rgba(108,99,255,0.30)",
        }}
      >
        {number}
      </span>
      <p
        className="text-xs font-mono uppercase tracking-wider"
        style={{ color: "rgba(255,255,255,0.28)" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ─── Main page ─── */
export default function CoverLetterGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

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

  // Animate form in whenever resetting letter
  useEffect(() => {
    if (!generatedLetter && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      );
    }
  }, [generatedLetter]);

  // Animate result panel in
  useEffect(() => {
    if (generatedLetter && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );
      // Typewriter-feel: stagger letter lines
      if (letterRef.current) {
        gsap.fromTo(
          letterRef.current,
          { opacity: 0, filter: "blur(4px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }
    }
  }, [generatedLetter]);

  const canGenerate = !!file && !!jobDescription.trim() && !isGenerating;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    const loadingToast = toast.loading("Generating your cover letter...");
    try {
      const formData = new FormData();
      formData.append("file", file!);
      formData.append("jobDescription", jobDescription);
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setGeneratedLetter(data.coverLetter);
      toast.success("Cover letter generated!", { id: loadingToast });
    } catch {
      toast.error("Failed to generate. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReset = () => {
    setGeneratedLetter("");
    setFile(null);
    setJobDescription("");
    setCopied(false);
    toast.success("Ready for a new letter!");
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#080808] pt-24 pb-20">
      {/* Ambient glow */}
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
            Write once.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #a39bff 0%, #6C63FF 50%, #00E5BE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Land the interview.
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
            Upload your CV and paste the job description — we'll craft a
            tailored, ATS-friendly cover letter in seconds.
          </p>
        </div>

        {/* ── Form ── */}
        {!generatedLetter && (
          <div
            ref={formRef}
            className="rounded-2xl p-6 sm:p-8"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-2 mb-8">
              <Mail
                className="w-4 h-4"
                style={{ color: "rgba(255,255,255,0.20)" }}
              />
              <span
                className="text-xs font-mono uppercase tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.20)" }}
              >
                Generate Letter
              </span>
            </div>

            <div className="space-y-6">
              {/* Step 1 — Upload */}
              <div>
                <StepLabel number="1" label="Upload Your Resume" />
                <FileDropZone
                  file={file}
                  onFile={setFile}
                  onClear={() => setFile(null)}
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <span
                  className="text-xs font-mono"
                  style={{ color: "rgba(255,255,255,0.18)" }}
                >
                  then
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>

              {/* Step 2 — Job description */}
              <div>
                <StepLabel number="2" label="Paste Job Description" />
                <div className="relative">
                  <ClipboardList
                    className="absolute left-4 top-4 w-4 h-4 pointer-events-none"
                    style={{ color: "rgba(255,255,255,0.18)" }}
                  />
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here — role requirements, responsibilities, company details..."
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
                  {jobDescription && (
                    <span
                      className="absolute bottom-3 right-3.5 text-[10px] font-mono"
                      style={{ color: "rgba(255,255,255,0.15)" }}
                    >
                      {jobDescription.length} chars
                    </span>
                  )}
                </div>
              </div>

              {/* Checklist hint */}
              {(!file || !jobDescription) && (
                <div className="flex items-center gap-6">
                  {[
                    { done: !!file, label: "Resume uploaded" },
                    {
                      done: !!jobDescription.trim(),
                      label: "Job description added",
                    },
                  ].map(({ done, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          background: done
                            ? "rgba(0,229,190,0.15)"
                            : "rgba(255,255,255,0.06)",
                          border: `1px solid ${done ? "rgba(0,229,190,0.35)" : "rgba(255,255,255,0.10)"}`,
                        }}
                      >
                        {done && (
                          <Check
                            className="w-2.5 h-2.5"
                            style={{ color: "#00E5BE" }}
                          />
                        )}
                      </div>
                      <span
                        className="text-xs"
                        style={{
                          color: done
                            ? "rgba(255,255,255,0.45)"
                            : "rgba(255,255,255,0.22)",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background: !canGenerate
                    ? "rgba(255,255,255,0.04)"
                    : isGenerating
                      ? "rgba(108,99,255,0.40)"
                      : "linear-gradient(135deg, #6C63FF, #5a52d5)",
                  color: !canGenerate ? "rgba(255,255,255,0.20)" : "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow:
                    canGenerate && !isGenerating
                      ? "0 0 30px rgba(108,99,255,0.28), inset 0 1px 0 rgba(255,255,255,0.15)"
                      : "none",
                  cursor: !canGenerate ? "not-allowed" : "pointer",
                  border: !canGenerate
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (canGenerate)
                    gsap.to(e.currentTarget, {
                      scale: 1.02,
                      boxShadow: "0 0 50px rgba(108,99,255,0.45)",
                      duration: 0.25,
                    });
                }}
                onMouseLeave={(e) =>
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    boxShadow: canGenerate
                      ? "0 0 30px rgba(108,99,255,0.28)"
                      : "none",
                    duration: 0.25,
                  })
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating your letter...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {generatedLetter && (
          <div ref={resultRef} style={{ opacity: 0 }}>
            {/* Result header */}
            <div
              className="flex items-center justify-between mb-5 pb-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-px w-6" style={{ background: "#6C63FF" }} />
                  <span
                    className="text-xs font-mono uppercase tracking-[0.18em]"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    Result
                  </span>
                </div>
                <h3
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Your Cover Letter
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: copied ? "#00E5BE" : "rgba(255,255,255,0.50)",
                    fontFamily: "'DM Sans', sans-serif",
                    background: copied ? "rgba(0,229,190,0.07)" : "transparent",
                    borderColor: copied
                      ? "rgba(0,229,190,0.25)"
                      : "rgba(255,255,255,0.10)",
                  }}
                  onMouseEnter={(e) => {
                    if (!copied)
                      gsap.to(e.currentTarget, {
                        borderColor: "rgba(255,255,255,0.22)",
                        color: "#fff",
                        duration: 0.2,
                      });
                  }}
                  onMouseLeave={(e) => {
                    if (!copied)
                      gsap.to(e.currentTarget, {
                        borderColor: "rgba(255,255,255,0.10)",
                        color: "rgba(255,255,255,0.50)",
                        duration: 0.2,
                      });
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>

                {/* Reset */}
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
                  style={{
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) =>
                    gsap.to(e.currentTarget, {
                      borderColor: "rgba(255,255,255,0.22)",
                      color: "#fff",
                      duration: 0.2,
                    })
                  }
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, {
                      borderColor: "rgba(255,255,255,0.10)",
                      color: "rgba(255,255,255,0.45)",
                      duration: 0.2,
                    })
                  }
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Letter
                </button>
              </div>
            </div>

            {/* Letter body */}
            <div
              className="rounded-2xl p-7 sm:p-10 relative overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {/* Subtle paper texture lines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 27px, rgba(255,255,255,0.5) 27px, rgba(255,255,255,0.5) 28px)",
                  backgroundSize: "100% 28px",
                  backgroundPosition: "0 48px",
                }}
              />

              <div ref={letterRef} className="relative" style={{ opacity: 0 }}>
                <pre
                  className="whitespace-pre-wrap leading-[1.85] text-sm"
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 400,
                  }}
                >
                  {generatedLetter}
                </pre>
              </div>

              {/* Bottom action row */}
              <div
                className="mt-8 pt-6 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="text-xs font-mono"
                  style={{ color: "rgba(255,255,255,0.18)" }}
                >
                  {generatedLetter.split(" ").length} words ·{" "}
                  {generatedLetter.length} chars
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-200"
                  style={{
                    color: copied ? "#00E5BE" : "rgba(255,255,255,0.28)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    if (!copied)
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.60)";
                  }}
                  onMouseLeave={(e) => {
                    if (!copied)
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.28)";
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy to clipboard
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
