"use client"

import { Shield, Zap, Target, Settings, Users, Sparkles } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "ATS-Optimized",
    description: "Every document passes applicant tracking systems. Your resume actually gets seen by humans.",
  },
  {
    icon: Zap,
    title: "Boost Productivity",
    description: "Let AI handle the repetitive work. You focus on what matters — relationships and interviews.",
  },
  {
    icon: Target,
    title: "Perfect Job Match",
    description: "Our model surfaces only the opportunities you'll actually want. No noise, no filler.",
  },
  {
    icon: Settings,
    title: "Easy Customization",
    description: "Tailor every document with a single prompt. Professional output without design expertise.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "AI coaching trained on insights from high-performers across every industry.",
  },
  {
    icon: Sparkles,
    title: "Smart Insights",
    description: "Actionable recommendations powered by analysis of millions of successful applications.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: "#0c0c0c" }}>
      {/* Divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#00E5BE]" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/30">Why JobAI</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <h2
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em", maxWidth: "500px" }}
          >
            Built for unfair advantage.
          </h2>
          <p className="text-white/30 max-w-xs text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Six core capabilities that put you ahead of 95% of applicants from day one.
          </p>
        </div>

        {/* Features grid — 2 cols on mobile, 3 on lg */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 bg-[#0c0c0c] hover:bg-white/[0.03] transition-colors duration-200 relative"
            >
              {/* Number */}
              <div
                className="absolute top-6 right-7 text-xs font-mono text-white/10"
              >
                0{index + 1}
              </div>

              <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:border-white/15 transition-colors">
                <feature.icon className="w-4.5 h-4.5 text-white/40 group-hover:text-white/60 transition-colors" style={{ width: "18px", height: "18px" }} />
              </div>

              <h3
                className="text-sm font-semibold text-white/80 mb-2.5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {feature.title}
              </h3>

              <p
                className="text-sm text-white/30 leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}