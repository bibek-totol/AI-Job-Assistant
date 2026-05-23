"use client"

import { useState, useRef, useEffect } from "react"
import toast from "react-hot-toast"
import JobCard from "@/components/JobCard"
import { Search, ChevronDown, Loader2, MapPin, Briefcase, SlidersHorizontal } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const countries = [
  { value: "bd", label: "Bangladesh" },
  { value: "in", label: "India" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "au", label: "Australia" },
  { value: "sg", label: "Singapore" },
]

const experienceLevels = [
  { value: "junior", label: "Junior (0–2 yrs)" },
  { value: "mid", label: "Mid-Level (3–5 yrs)" },
  { value: "senior", label: "Senior (6+ yrs)" },
]

function StyledSelect({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string
  icon: React.ElementType
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs font-mono uppercase tracking-wider"
        style={{ color: "rgba(255,255,255,0.28)" }}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "rgba(255,255,255,0.25)" }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)"
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.1)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ background: "#141414", color: "#fff" }}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "rgba(255,255,255,0.25)" }}
        />
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-6 animate-pulse"
      style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="flex-1">
          <div className="h-3 rounded-full mb-2 w-3/4" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-2.5 rounded-full w-1/2" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
      <div className="space-y-2.5 mb-5">
        <div className="h-2.5 rounded-full w-2/3" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="h-2.5 rounded-full w-1/2" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
      <div className="h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
    </div>
  )
}

export default function JobSuggestion() {
  const [preferences, setPreferences] = useState("")
  const [country, setCountry] = useState("us")
  const [experience, setExperience] = useState("mid")
  const [isSearching, setIsSearching] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        headerRef.current?.querySelectorAll(".h-el") ?? [],
        { y: 30, opacity: 0, filter: "blur(5px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, stagger: 0.1 },
        0.1
      )
      tl.fromTo(
        formRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.4
      )
    }, pageRef)
    return () => ctx.revert()
  }, [])

  // Animate result cards in after search
  useEffect(() => {
    if (!isSearching && jobs.length > 0 && resultsRef.current) {
      const cards = resultsRef.current.querySelectorAll(".job-card-wrap")
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.6, stagger: 0.08, ease: "power3.out",
          delay: 0.1,
        }
      )
    }
  }, [isSearching, jobs])

  const handleSearch = async () => {
    if (!preferences.trim()) {
      toast.error("Please describe your skills or preferences")
      textareaRef.current?.focus()
      return
    }
    setIsSearching(true)
    setHasSearched(true)
    const loadingToast = toast.loading("Searching for the best matches...")
    try {
      const response = await fetch("/api/job-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences, country, experience }),
      })
      if (!response.ok) throw new Error("Failed")
      const data = await response.json()
      setJobs(data.jobs || [])
      if (data.jobs?.length > 0) {
        toast.success(`Found ${data.jobs.length} matches`, { id: loadingToast })
      } else {
        toast.error("No matches found — try adjusting your preferences", { id: loadingToast })
      }
    } catch {
      toast.error("Search failed. Please try again.", { id: loadingToast })
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSearch()
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#080808] pt-24 pb-20"
    >
      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "800px", height: "400px",
          background: "radial-gradient(ellipse at top, rgba(108,99,255,0.10) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">

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
            <span className="w-1.5 h-1.5 flex items-center justify-center rounded-full bg-[#00E5BE]"
              style={{ boxShadow: "0 0 8px rgba(0,229,190,0.8)" }} />
           
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
            Find your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a39bff 0%, #6C63FF 50%, #00E5BE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              perfect role.
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
            Describe your skills and preferences. Our AI scans thousands of live listings to surface what's actually worth your time.
          </p>
        </div>

        {/* Search form */}
        <div
          ref={formRef}
          className="rounded-2xl p-6 sm:p-8 mb-10"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(12px)",
            opacity: 0,
          }}
        >
          {/* Section label */}
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-4 h-4" style={{ color: "rgba(255,255,255,0.25)" }} />
            <span
              className="text-xs font-mono uppercase tracking-[0.18em]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Search Preferences
            </span>
          </div>

          <div className="space-y-5">
            {/* Textarea */}
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-mono uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                Your Skills & Preferences
              </label>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={4}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. React developer with 3 years experience, looking for remote frontend roles in fintech..."
                  className="w-full resize-none rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.18)]"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.8)",
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
                <span
                  className="absolute bottom-3 right-3 text-[10px] font-mono"
                  style={{ color: "rgba(255,255,255,0.15)" }}
                >
                  ⌘↵ to search
                </span>
              </div>
            </div>

            {/* Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StyledSelect
                label="Country"
                icon={MapPin}
                options={countries}
                value={country}
                onChange={setCountry}
              />
              <StyledSelect
                label="Experience Level"
                icon={Briefcase}
                options={experienceLevels}
                value={experience}
                onChange={setExperience}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="group relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300"
              style={{
                background: isSearching
                  ? "rgba(108,99,255,0.4)"
                  : "linear-gradient(135deg, #6C63FF, #5a52d5)",
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: isSearching ? "none" : "0 0 30px rgba(108,99,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                cursor: isSearching ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isSearching) gsap.to(e.currentTarget, { scale: 1.02, boxShadow: "0 0 50px rgba(108,99,255,0.5)", duration: 0.25 })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1, boxShadow: "0 0 30px rgba(108,99,255,0.3)", duration: 0.25 })
              }}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching live listings...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Find Matching Jobs
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skeleton loading state */}
        {isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Results */}
        {!isSearching && jobs.length > 0 && (
          <div ref={resultsRef}>
            {/* Results header */}
            <div
              className="flex items-center justify-between mb-6 pb-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <h3
                  className="text-lg font-bold text-white mb-0.5"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {jobs.length} Perfect Matches
                </h3>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Sorted by relevance to your profile
                </p>
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-mono"
                style={{
                  background: "rgba(0,229,190,0.08)",
                  border: "1px solid rgba(0,229,190,0.2)",
                  color: "#00E5BE",
                }}
              >
                Live results
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job, index) => (
                <div key={index} className="job-card-wrap" style={{ opacity: 0 }}>
                  <JobCard {...job} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state after search */}
        {!isSearching && hasSearched && jobs.length === 0 && (
          <div
            className="text-center py-20 rounded-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Search className="w-6 h-6" style={{ color: "rgba(255,255,255,0.25)" }} />
            </div>
            <h3
              className="text-base font-semibold text-white mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              No matches found
            </h3>
            <p
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Try broadening your preferences or switching countries
            </p>
          </div>
        )}
      </div>
    </div>
  )
}