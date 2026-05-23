"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080808]">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse at center top, #6C63FF 0%, transparent 70%)" }}
      />

      {/* Accent orb left */}
      <div className="absolute bottom-1/4 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ background: "#6C63FF" }}
      />
      {/* Accent orb right */}
      <div className="absolute top-1/3 right-10 w-56 h-56 rounded-full opacity-10 blur-3xl"
        style={{ background: "#00E5BE" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        {/* Badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5BE]" />
            <span className="text-xs font-medium tracking-widest uppercase text-white/50 font-mono">
              AI-Powered Career Platform
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1
            className="font-bold leading-[1.08] tracking-tight"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            <span className="text-white">Land your</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #8B82FF 0%, #6C63FF 50%, #00E5BE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              dream role
            </span>
            <span className="text-white"> faster.</span>
          </h1>
        </div>

        {/* Subheadline */}
        <p className="text-center text-white/40 max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ fontSize: "1.1rem", fontFamily: "'DM Sans', sans-serif" }}
        >
          Resume optimization, interview coaching, and intelligent job matching — everything you need, powered by AI.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
          <button
            className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #6C63FF, #5a52d5)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 0 40px rgba(108, 99, 255, 0.35)",
            }}
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            See how it works
          </button>
        </div>

        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-0 max-w-lg mx-auto">
          {[
            { value: "50K+", label: "Jobs Found" },
            { value: "98%", label: "ATS Pass Rate" },
            { value: "10K+", label: "Hired Users" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 text-center py-5 ${
                i < 2 ? "border-b sm:border-b-0 sm:border-r border-white/10" : ""
              }`}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: "#fff",
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-white/30 uppercase tracking-wider font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #080808, transparent)" }}
      />
    </section>
  )
}