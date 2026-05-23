"use client"

import { useEffect, useRef } from "react"
import { FileText, Mail, Video, Search, Users, ClipboardList, ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

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
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animate in
      gsap.fromTo(
        headerRef.current?.children ?? [],
        { y: 40, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 82%",
          },
        }
      )

      // Cards — clip-path wipe stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 50,
            scale: 0.96,
            filter: "blur(4px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
            delay: (i % 3) * 0.08, // column-based stagger
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-32 bg-[#080808] relative overflow-hidden"
    >
      {/* BG glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "900px",
          height: "500px",
          background: "radial-gradient(ellipse at center, rgba(108,99,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#6C63FF]" />
            <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.28)" }}>
              Services
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2
              className="text-4xl sm:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.025em", maxWidth: "520px" }}
            >
              Every tool you need to get hired.
            </h2>
            <p
              className="text-sm max-w-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans', sans-serif" }}
            >
              AI-powered from start to finish. No fluff, just results.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                ref={(el) => { cardsRef.current[index] = el }}
                className="group relative rounded-2xl p-7 cursor-pointer overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  opacity: 0,
                  willChange: "transform",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  gsap.to(el, {
                    y: -6,
                    borderColor: "rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    boxShadow: `0 20px 60px -10px ${service.accent}22`,
                    duration: 0.35,
                    ease: "power2.out",
                  })
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  gsap.to(el, {
                    y: 0,
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    boxShadow: "none",
                    duration: 0.4,
                    ease: "power2.out",
                  })
                }}
              >
                {/* Accent top line */}
                <div
                  className="absolute top-0 inset-x-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to right, transparent, ${service.accent}, transparent)` }}
                />

                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `${service.accent}18` }}
                    ref={(el) => {
                      if (!el) return
                      // pulse on hover via parent card
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: service.accent }} />
                  </div>

                  {service.tag ? (
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: `${service.accent}18`, color: service.accent }}
                    >
                      {service.tag}
                    </span>
                  ) : (
                    <ArrowUpRight
                      className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      style={{ color: "#fff" }}
                    />
                  )}
                </div>

                <h3
                  className="text-base font-semibold text-white mb-2.5"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {service.title}
                </h3>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.34)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}