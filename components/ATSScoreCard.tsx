"use client"

import { useEffect, useRef } from "react"
import { CheckCircle2, AlertTriangle, PlusCircle } from "lucide-react"
import gsap from "gsap"

interface ATSScoreCardProps {
  score: number
  strengths: string[]
  improvements: string[]
  missingSkills: string[]
}

function getScoreMeta(score: number) {
  if (score >= 80) return { label: "Excellent", color: "#00E5BE", bg: "rgba(0,229,190,0.10)", ring: "rgba(0,229,190,0.3)" }
  if (score >= 60) return { label: "Good", color: "#FFB547", bg: "rgba(255,181,71,0.10)", ring: "rgba(255,181,71,0.3)" }
  return { label: "Needs Work", color: "#FF7C5C", bg: "rgba(255,124,92,0.10)", ring: "rgba(255,124,92,0.3)" }
}

function ScoreRing({ score }: { score: number }) {
  const circleRef = useRef<SVGCircleElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const meta = getScoreMeta(score)

  const radius = 64
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const offset = circumference - (score / 100) * circumference

    // Animate stroke
    gsap.fromTo(
      circleRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: offset, duration: 1.6, ease: "power3.out", delay: 0.3 }
    )

    // Animate counter
    const obj = { val: 0 }
    gsap.to(obj, {
      val: score,
      duration: 1.6,
      ease: "power3.out",
      delay: 0.3,
      onUpdate: () => {
        if (countRef.current) countRef.current.textContent = Math.round(obj.val).toString()
      },
    })
  }, [score, circumference])

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-30"
        style={{ background: meta.color, transform: "scale(0.85)" }}
      />
      <svg width="160" height="160" viewBox="0 0 160 160" className="relative">
        {/* Track */}
        <circle
          cx="80" cy="80" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx="80" cy="80" r={radius}
          fill="none"
          stroke={meta.color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 80 80)"
          style={{ filter: `drop-shadow(0 0 8px ${meta.color})` }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={countRef}
          className="text-4xl font-bold"
          style={{ fontFamily: "'Syne', sans-serif", color: meta.color }}
        >
          0
        </span>
        <span
          className="text-xs font-mono uppercase tracking-wider mt-0.5"
          style={{ color: "rgba(255,255,255,0.30)" }}
        >
          / 100
        </span>
      </div>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  accentColor,
  children,
  delay = 0,
}: {
  icon: React.ElementType
  title: string
  accentColor: string
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: 28, opacity: 0, filter: "blur(4px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power3.out", delay }
    )
  }, [delay])

  return (
    <div
      ref={ref}
      className="rounded-2xl p-6"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
        opacity: 0,
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        <h3
          className="text-sm font-bold text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h3>
        <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>
      {children}
    </div>
  )
}

export default function ATSScoreCard({ score, strengths, improvements, missingSkills }: ATSScoreCardProps) {
  const meta = getScoreMeta(score)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
  }, [])

  return (
    <div className="space-y-4">

      {/* Score hero */}
      <div
        ref={heroRef}
        className="rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
          opacity: 0,
        }}
      >
        <ScoreRing score={score} />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
            <div className="h-px w-6" style={{ background: meta.color }} />
            <span className="text-xs font-mono uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.28)" }}>
              ATS Compatibility Score
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ fontFamily: "'Syne', sans-serif", color: meta.color }}
          >
            {meta.label}
          </h2>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}
          >
            {score >= 80
              ? "Your resume is well-optimized for ATS systems. Minor tweaks may further improve your visibility."
              : score >= 60
              ? "A solid foundation. Apply the suggested improvements to increase your callback rate."
              : "Significant improvements needed to pass automated screening. Review all suggestions below."}
          </p>

          {/* Score bar */}
          <div className="mt-5 max-w-xs mx-auto sm:mx-0">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${score}%`,
                  background: `linear-gradient(to right, ${meta.color}88, ${meta.color})`,
                  boxShadow: `0 0 10px ${meta.color}60`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              {[0, 25, 50, 75, 100].map((v) => (
                <span
                  key={v}
                  className="text-[10px] font-mono"
                  style={{ color: "rgba(255,255,255,0.18)" }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      <Section icon={CheckCircle2} title="Strengths" accentColor="#00E5BE" delay={0.15}>
        <ul className="space-y-2.5">
          {strengths.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 py-2.5 px-3 rounded-xl"
              style={{ background: "rgba(0,229,190,0.04)", border: "1px solid rgba(0,229,190,0.08)" }}
            >
              <span
                className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono"
                style={{ background: "rgba(0,229,190,0.15)", color: "#00E5BE" }}
              >
                ✓
              </span>
              <span
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.60)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Improvements */}
      <Section icon={AlertTriangle} title="Suggested Improvements" accentColor="#FFB547" delay={0.25}>
        <ul className="space-y-2.5">
          {improvements.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 py-2.5 px-3 rounded-xl"
              style={{ background: "rgba(255,181,71,0.04)", border: "1px solid rgba(255,181,71,0.08)" }}
            >
              <span
                className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px]"
                style={{ background: "rgba(255,181,71,0.15)", color: "#FFB547" }}
              >
                !
              </span>
              <span
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.60)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Missing skills */}
      <Section icon={PlusCircle} title="Recommended Skills to Add" accentColor="#8B82FF" delay={0.35}>
        <div className="flex flex-wrap gap-2">
          {missingSkills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(108,99,255,0.10)",
                border: "1px solid rgba(108,99,255,0.20)",
                color: "#a39bff",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ color: "#6C63FF" }}>+</span>
              {skill}
            </span>
          ))}
        </div>
      </Section>
    </div>
  )
}