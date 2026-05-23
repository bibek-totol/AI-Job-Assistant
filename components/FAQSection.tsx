"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Minus } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const audiences = [
  {
    title: "Recent Graduates",
    content:
      "Perfect for new graduates entering the job market. Our AI helps you craft compelling resumes that highlight your education, internships, and transferable skills even without extensive work experience.",
  },
  {
    title: "Career Changers",
    content:
      "Making a career pivot? We help you reframe your existing experience, identify transferable skills, and position yourself effectively for roles in your new target industry.",
  },
  {
    title: "Experienced Professionals",
    content:
      "For seasoned professionals, we help optimize your executive presence, highlight leadership achievements, and ensure your resume passes through enterprise-level ATS systems.",
  },
  {
    title: "Tech Industry",
    content:
      "Specialized support for tech roles including software engineering, data science, and product management. We understand the unique requirements and keywords that tech recruiters look for.",
  },
  {
    title: "Creative Professionals",
    content:
      "Balance creativity with ATS compatibility. We help designers, writers, and marketers showcase their portfolios while ensuring their applications get past automated screening.",
  },
  {
    title: "Remote Workers",
    content:
      "Optimized for the remote job market. We help you highlight remote work skills, virtual collaboration experience, and self-management capabilities that remote employers value.",
  },
]

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: (typeof audiences)[0]
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    if (isOpen) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.45, ease: "power3.out" }
      )
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: "power3.in" })
    }
  }, [isOpen])

  return (
    <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span
          className="text-sm font-medium transition-colors duration-200"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: isOpen ? "#fff" : "rgba(255,255,255,0.48)",
          }}
        >
          {item.title}
        </span>
        <div
          className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            border: isOpen ? "1px solid rgba(108,99,255,0.5)" : "1px solid rgba(255,255,255,0.10)",
            background: isOpen ? "rgba(108,99,255,0.12)" : "transparent",
          }}
        >
          {isOpen
            ? <Minus className="w-3 h-3" style={{ color: "#6C63FF" }} />
            : <Plus className="w-3 h-3" style={{ color: "rgba(255,255,255,0.35)" }} />
          }
        </div>
      </button>

      <div ref={contentRef} style={{ overflow: "hidden", height: 0, opacity: 0 }}>
        <p
          className="text-sm leading-relaxed pb-5"
          style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}
        >
          {item.content}
        </p>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column slides in from left
      gsap.fromTo(
        leftRef.current,
        { x: -40, opacity: 0, filter: "blur(6px)" },
        {
          x: 0, opacity: 1, filter: "blur(0px)",
          duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      )

      // Right column slides in from right
      gsap.fromTo(
        rightRef.current,
        { x: 40, opacity: 0, filter: "blur(6px)" },
        {
          x: 0, opacity: 1, filter: "blur(0px)",
          duration: 1, ease: "power3.out",
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      )

      // Stat cards stagger
      const statCards = rightRef.current?.querySelectorAll(".stat-card") ?? []
      gsap.fromTo(
        statCards,
        { y: 24, opacity: 0, scale: 0.96 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.65, stagger: 0.1, ease: "back.out(1.3)",
          scrollTrigger: { trigger: rightRef.current, start: "top 80%" },
          delay: 0.3,
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-[#080808] relative overflow-hidden"
    >
      {/* Teal glow */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: "600px", height: "500px",
          background: "radial-gradient(ellipse at bottom right, rgba(0,229,190,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div ref={leftRef} style={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#6C63FF]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.28)" }}>
                Who We Serve
              </span>
            </div>

            <h2
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.025em" }}
            >
              Built for every stage of your career.
            </h2>

            <p
              className="text-sm leading-relaxed mb-12 max-w-sm"
              style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Whether you're just starting out or making a bold pivot, JobAI meets you exactly where you are.
            </p>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {audiences.map((item, index) => (
                <AccordionItem
                  key={index}
                  item={item}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>

          {/* Right */}
          <div ref={rightRef} className="lg:pt-20" style={{ opacity: 0 }}>
            {/* Purpose block */}
            <div
              className="rounded-2xl p-7 mb-5"
              style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full bg-[#00E5BE]" />
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.28)" }}>
                  Our Purpose
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif" }}
              >
                We remove the barriers that keep talented people from their dream roles. AI-powered tools that level
                the playing field — for everyone, not just the privileged few.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { value: "50K+", label: "Resumes Optimized", accent: "#6C63FF" },
                { value: "98%", label: "Success Rate", accent: "#00E5BE" },
                { value: "24/7", label: "AI Support", accent: "#00E5BE" },
                { value: "5 min", label: "Avg. Analysis Time", accent: "#6C63FF" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card rounded-xl p-5 cursor-default"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                  onMouseEnter={(e) => gsap.to(e.currentTarget, {
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.12)",
                    y: -3, duration: 0.3
                  })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, {
                    background: "rgba(255,255,255,0.02)",
                    borderColor: "rgba(255,255,255,0.06)",
                    y: 0, duration: 0.3
                  })}
                >
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ fontFamily: "'Syne', sans-serif", color: stat.accent }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.25)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA unit */}
            <div
              className="rounded-2xl p-6 flex items-center justify-between"
              style={{ border: "1px solid rgba(108,99,255,0.22)", background: "rgba(108,99,255,0.05)" }}
            >
              <div>
                <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Ready to get started?
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "'DM Sans', sans-serif" }}>
                  Free forever. No credit card needed.
                </p>
              </div>
              <button
                className="shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #6C63FF, #5a52d5)",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 0 20px rgba(108,99,255,0.3)",
                }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, boxShadow: "0 0 35px rgba(108,99,255,0.55)", duration: 0.28 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, boxShadow: "0 0 20px rgba(108,99,255,0.3)", duration: 0.28 })}
              >
                Sign up free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}