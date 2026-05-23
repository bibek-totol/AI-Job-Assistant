"use client"

import { FileText, Mail, Video, Search, Users, ClipboardList, ArrowUpRight } from "lucide-react"

const services = [
  {
    icon: FileText,
    title: "Resume Checker",
    description: "ATS compatibility analysis with personalized feedback to maximize your interview callback rate.",
    accent: "#6C63FF",
    tag: "Most Popular",
  },
  {
    icon: Mail,
    title: "Cover Letter",
    description: "Compelling, tailored cover letters generated from job descriptions in under 60 seconds.",
    accent: "#00E5BE",
    tag: null,
  },
  {
    icon: Video,
    title: "Interview Prep",
    description: "AI mock interviews with real-time feedback. Walk in confident, walk out with an offer.",
    accent: "#FF7C5C",
    tag: null,
  },
  {
    icon: Search,
    title: "Job Search",
    description: "Thousands of curated opportunities matched precisely to your skills and preferences.",
    accent: "#6C63FF",
    tag: null,
  },
  {
    icon: Users,
    title: "Career Coaching",
    description: "Personalized guidance from AI trained on the career paths of top professionals.",
    accent: "#00E5BE",
    tag: null,
  },
  {
    icon: ClipboardList,
    title: "Skill Assessment",
    description: "Comprehensive skill evaluations that surface your gaps and growth opportunities clearly.",
    accent: "#FF7C5C",
    tag: null,
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-32 bg-[#080808] relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-5 blur-3xl rounded-full"
        style={{ background: "#6C63FF" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#6C63FF]" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/30">Services</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <h2
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em", maxWidth: "540px" }}
          >
            Every tool you need to get hired.
          </h2>
          <p className="text-white/30 max-w-xs text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            AI-powered from start to finish. No fluff, just results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative rounded-2xl p-7 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Top accent line on hover */}
              <div
                className="absolute top-0 left-7 right-7 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right, transparent, ${service.accent}, transparent)` }}
              />

              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${service.accent}15` }}
                >
                  <service.icon className="w-5 h-5" style={{ color: service.accent }} />
                </div>

                {service.tag && (
                  <span
                    className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{
                      background: `${service.accent}15`,
                      color: service.accent,
                    }}
                  >
                    {service.tag}
                  </span>
                )}

                <ArrowUpRight
                  className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200"
                  style={{ ...(service.tag ? { display: "none" } : {}) }}
                />
              </div>

              <h3
                className="text-base font-semibold text-white mb-2.5 group-hover:text-white transition-colors"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {service.title}
              </h3>

              <p
                className="text-sm text-white/35 leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}