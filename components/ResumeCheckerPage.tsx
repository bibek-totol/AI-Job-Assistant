"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import ATSScoreCard from "@/components/ATSScoreCard"
import { UploadCloud, FileText, X, Loader2, ChevronRight, RotateCcw } from "lucide-react"
import gsap from "gsap"

const FEATURES = [
  { label: "ATS Compatibility Score (0–100)" },
  { label: "Detailed strengths analysis" },
  { label: "Actionable improvement suggestions" },
  { label: "Missing skills recommendations" },
]

function FileUploadZone({
  file,
  onFile,
  onClear,
}: {
  file: File | null
  onFile: (f: File) => void
  onClear: () => void
}) {
  const zoneRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped?.type === "application/pdf") {
        onFile(dropped)
      } else {
        toast.error("Please upload a PDF file")
      }
    },
    [onFile]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
    gsap.to(zoneRef.current, { borderColor: "rgba(108,99,255,0.6)", background: "rgba(108,99,255,0.06)", duration: 0.2 })
  }

  const handleDragLeave = () => {
    setIsDragging(false)
    gsap.to(zoneRef.current, { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", duration: 0.25 })
  }

  useEffect(() => {
    if (file) {
      gsap.to(zoneRef.current, { borderColor: "rgba(0,229,190,0.35)", background: "rgba(0,229,190,0.04)", duration: 0.35 })
    } else {
      gsap.to(zoneRef.current, { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", duration: 0.25 })
    }
  }, [file])

  return (
    <div>
      <label className="text-xs font-mono uppercase tracking-wider mb-2.5 block" style={{ color: "rgba(255,255,255,0.28)" }}>
        Upload Resume
      </label>
      <div
        ref={zoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="relative rounded-xl transition-all duration-200"
        style={{
          border: "1px dashed rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          minHeight: "140px",
        }}
      >
        {!file ? (
          <label className="flex flex-col items-center justify-center gap-3 cursor-pointer py-10 px-6">
            <input
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onFile(f)
              }}
            />
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <UploadCloud className="w-5 h-5" style={{ color: "rgba(255,255,255,0.30)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm text-white mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Drop your PDF here, or{" "}
                <span style={{ color: "#8B82FF" }}>browse</span>
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "'DM Sans', sans-serif" }}>
                PDF only · Max 10 MB
              </p>
            </div>
          </label>
        ) : (
          <div className="flex items-center gap-4 px-5 py-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(0,229,190,0.10)", border: "1px solid rgba(0,229,190,0.2)" }}
            >
              <FileText className="w-5 h-5" style={{ color: "#00E5BE" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-white truncate"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {file.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans', sans-serif" }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
              </p>
            </div>
            <button
              onClick={onClear}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { background: "rgba(255,124,92,0.12)", borderColor: "rgba(255,124,92,0.25)", duration: 0.2 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)", duration: 0.2 })}
            >
              <X className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.40)" }} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResumeChecker() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(
        headerRef.current?.querySelectorAll(".h-el") ?? [],
        { y: 28, opacity: 0, filter: "blur(5px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, stagger: 0.1 },
        0.1
      )
      tl.fromTo(
        formRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.35
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  // Animate results in
  useEffect(() => {
    if (results && resultsRef.current) {
      gsap.fromTo(
        resultsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      )
    }
  }, [results])

  const handleAnalyze = async () => {
    if (!file) return
    setIsAnalyzing(true)
    const loadingToast = toast.loading("Analyzing your resume...")
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("jobDescription", jobDescription)
      const response = await fetch("/api/analyze-resume", { method: "POST", body: formData })
      if (!response.ok) throw new Error("Analysis failed")
      const data = await response.json()
      setResults(data)
      toast.success("Resume analyzed!", { id: loadingToast })
    } catch {
      toast.error("Failed to analyze. Please try again.", { id: loadingToast })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setFile(null)
    setJobDescription("")
    toast.success("Ready for a new analysis!")
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#080808] pt-24 pb-20">
      {/* Ambient */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse at top, rgba(108,99,255,0.10) 0%, transparent 65%)",
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
            <span className="w-1.5 h-1.5 flex items-center justify-center rounded-full" style={{ background: "#6C63FF", boxShadow: "0 0 8px rgba(108,99,255,0.8)" }} />
           
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
            Know your{" "}
            <span style={{
              background: "linear-gradient(135deg, #a39bff 0%, #6C63FF 50%, #00E5BE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              ATS score.
            </span>
          </h1>

          <p
            className="h-el text-sm max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans', sans-serif", opacity: 0 }}
          >
            Upload your resume and get instant feedback on ATS compatibility, strengths, and exactly what to fix.
          </p>
        </div>

        {/* Form or Results */}
        {!results ? (
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
              <FileText className="w-4 h-4" style={{ color: "rgba(255,255,255,0.22)" }} />
              <span className="text-xs font-mono uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.22)" }}>
                Resume Analysis
              </span>
            </div>

            <div className="space-y-5">
              {/* File upload */}
              <FileUploadZone
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
              />

              {/* Job description */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider mb-2.5 block" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Job Description{" "}
                  <span className="normal-case tracking-normal font-sans" style={{ color: "rgba(255,255,255,0.18)" }}>
                    (optional — for targeted feedback)
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get role-specific recommendations..."
                  className="w-full resize-none rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.16)]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.75)",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(108,99,255,0.45)"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.08)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              {/* What you'll get */}
              <div
                className="rounded-xl p-5"
                style={{ background: "rgba(108,99,255,0.05)", border: "1px solid rgba(108,99,255,0.12)" }}
              >
                <p
                  className="text-xs font-mono uppercase tracking-wider mb-3.5"
                  style={{ color: "rgba(108,99,255,0.7)" }}
                >
                  What you'll get
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FEATURES.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: "#6C63FF" }} />
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background:
                    !file
                      ? "rgba(255,255,255,0.04)"
                      : isAnalyzing
                      ? "rgba(108,99,255,0.4)"
                      : "linear-gradient(135deg, #6C63FF, #5a52d5)",
                  color: !file ? "rgba(255,255,255,0.22)" : "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: file && !isAnalyzing ? "0 0 30px rgba(108,99,255,0.28), inset 0 1px 0 rgba(255,255,255,0.15)" : "none",
                  cursor: !file || isAnalyzing ? "not-allowed" : "pointer",
                  border: !file ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (file && !isAnalyzing) gsap.to(e.currentTarget, { scale: 1.02, boxShadow: "0 0 50px rgba(108,99,255,0.45)", duration: 0.25 })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, boxShadow: file && !isAnalyzing ? "0 0 30px rgba(108,99,255,0.28)" : "none", duration: 0.25 })
                }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing resume...
                  </>
                ) : (
                  <>
                    <Loader2 className="w-4 h-4" />
                    {file ? "Analyze Resume" : "Upload a PDF to continue"}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div ref={resultsRef} style={{ opacity: 0 }}>
            <ATSScoreCard
              score={results.score}
              strengths={results.strengths}
              improvements={results.improvements}
              missingSkills={results.missingSkills}
            />

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.50)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: "rgba(255,255,255,0.22)", color: "#fff", duration: 0.25 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.50)", duration: 0.25 })}
              >
                <RotateCcw className="w-4 h-4" />
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}