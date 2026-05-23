"use client"

import { useRef } from "react"
import { MapPin, DollarSign, ArrowUpRight, Briefcase } from "lucide-react"
import gsap from "gsap"

interface JobCardProps {
  title: string
  company: string
  location: string
  salary: string
  type: string
  matchReason?: string
  link?: string
  index?: number
}

export default function JobCard({
  title,
  company,
  location,
  salary,
  type,
  matchReason,
  link = "#",
  index = 0,
}: JobCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Magnetic glow follows mouse inside card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    gsap.to(glow, { x: x - 120, y: y - 120, duration: 0.4, ease: "power2.out" })
    gsap.to(glow, { opacity: 1, duration: 0.3 })
  }

  const handleMouseLeave = () => {
    gsap.to(glowRef.current, { opacity: 0, duration: 0.4 })
    gsap.to(cardRef.current, { y: 0, duration: 0.4, ease: "power2.out" })
  }

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -5, duration: 0.35, ease: "power2.out" })
  }

  const typeColor =
    type?.toLowerCase().includes("remote")
      ? { bg: "rgba(0,229,190,0.10)", color: "#00E5BE" }
      : type?.toLowerCase().includes("full")
      ? { bg: "rgba(108,99,255,0.12)", color: "#8B82FF" }
      : { bg: "rgba(255,124,92,0.10)", color: "#FF7C5C" }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
        willChange: "transform",
        cursor: "default",
      }}
    >
      {/* Magnetic glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "240px",
          height: "240px",
          background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)",
          opacity: 0,
          zIndex: 0,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(108,99,255,0.5), transparent)" }}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          {/* Company avatar */}
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {company?.[0]?.toUpperCase() ?? "J"}
            </div>
            <div className="min-w-0">
              <h3
                className="text-sm font-bold text-white leading-tight mb-0.5 truncate"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {title}
              </h3>
              <p
                className="text-xs truncate"
                style={{ color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {company}
              </p>
            </div>
          </div>

          {/* Type badge */}
          <span
            className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: typeColor.bg, color: typeColor.color }}
          >
            {type}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
            <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "'DM Sans', sans-serif" }}>
              {location}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "'DM Sans', sans-serif" }}>
              {salary}
            </span>
          </div>
        </div>

        {/* Match reason */}
        {matchReason && (
          <div
            className="rounded-xl p-3.5 mb-5"
            style={{ background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.15)" }}
          >
            <p
              className="text-[10px] font-mono uppercase tracking-wider mb-1.5"
              style={{ color: "rgba(108,99,255,0.7)" }}
            >
              Why this matches you
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>
              {matchReason}
            </p>
          </div>
        )}

        {/* CTA */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: "rgba(108,99,255,0.10)",
            border: "1px solid rgba(108,99,255,0.2)",
            color: "#8B82FF",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              background: "rgba(108,99,255,0.2)",
              borderColor: "rgba(108,99,255,0.45)",
              color: "#fff",
              duration: 0.25,
            })
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              background: "rgba(108,99,255,0.10)",
              borderColor: "rgba(108,99,255,0.2)",
              color: "#8B82FF",
              duration: 0.25,
            })
          }}
        >
          <span>View Details</span>
          <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
        </a>
      </div>
    </div>
  )
}