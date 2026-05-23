"use client"

import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const stats = [
  { value: 50000, suffix: "+", label: "Jobs Found" },
  { value: 98, suffix: "%", label: "ATS Pass Rate" },
  { value: 10000, suffix: "+", label: "Hired Users" },
]

const headline1 = ["Land", "your"]
const headline2 = ["dream", "role"]
const headline3 = ["faster."]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Grid fade in
      tl.fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0)

      // Orbs bloom
      tl.fromTo(
        [orb1Ref.current, orb2Ref.current],
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out", stagger: 0.3 },
        0.1
      )

      // Badge slides down
      tl.fromTo(
        badgeRef.current,
        { y: -24, opacity: 0, filter: "blur(4px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7 },
        0.5
      )

      // Headline words — 3D flip up
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".word")
        tl.fromTo(
          words,
          { y: 90, opacity: 0, rotateX: -50, transformOrigin: "center bottom" },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.85,
            stagger: 0.055,
            ease: "power4.out",
          },
          0.7
        )
      }

      // Subtitle blur reveal
      tl.fromTo(
        subRef.current,
        { y: 28, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9 },
        1.35
      )

      // CTA buttons stagger
      tl.fromTo(
        ctaRef.current?.children ?? [],
        { y: 24, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.14, ease: "back.out(1.4)" },
        1.55
      )

      // Stats
      tl.fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        1.75
      )

      // Counters
      tl.call(() => {
        counterRefs.current.forEach((el, i) => {
          if (!el) return
          const { value, suffix } = stats[i]
          const obj = { val: 0 }
          gsap.to(obj, {
            val: value,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
              const display = value >= 1000
                ? Math.round(obj.val / 1000) + "K"
                : Math.round(obj.val).toString()
              el.textContent = display + suffix
            },
          })
        })
      }, [], 1.9)
    }, sectionRef)

    // Floating idle animation
    gsap.to(orb1Ref.current, {
      y: -35, x: 18,
      duration: 7, ease: "sine.inOut",
      yoyo: true, repeat: -1,
    })
    gsap.to(orb2Ref.current, {
      y: 28, x: -22,
      duration: 9, ease: "sine.inOut",
      yoyo: true, repeat: -1, delay: 2,
    })

    // Mouse parallax
    const section = sectionRef.current
    const handleMouse = (e: MouseEvent) => {
      if (!section) return
      const cx = section.offsetWidth / 2
      const cy = section.offsetHeight / 2
      const dx = (e.clientX - cx) / cx
      const dy = (e.clientY - cy) / cy
      gsap.to(orb1Ref.current, { x: dx * 45, y: dy * 45, duration: 1.6, ease: "power2.out", overwrite: "auto" })
      gsap.to(orb2Ref.current, { x: -dx * 32, y: -dy * 32, duration: 2, ease: "power2.out", overwrite: "auto" })
      gsap.to(gridRef.current, { x: dx * 10, y: dy * 10, duration: 2.2, ease: "power2.out", overwrite: "auto" })
    }
    section?.addEventListener("mousemove", handleMouse)

    return () => {
      ctx.revert()
      section?.removeEventListener("mousemove", handleMouse)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#080808]"
    >
      {/* Grid */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          willChange: "transform",
          opacity: 0,
        }}
      />

      {/* Top radial orb */}
      <div
        ref={orb1Ref}
        className="absolute pointer-events-none"
        style={{
          top: "-5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          height: "600px",
          background: "radial-gradient(ellipse at 50% 30%, rgba(108,99,255,0.25) 0%, transparent 65%)",
          willChange: "transform",
          opacity: 0,
        }}
      />
      {/* Bottom teal orb */}
      <div
        ref={orb2Ref}
        className="absolute pointer-events-none"
        style={{
          bottom: "5%",
          right: "5%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(ellipse at center, rgba(0,229,190,0.13) 0%, transparent 65%)",
          willChange: "transform",
          opacity: 0,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-20">
        {/* Badge */}
        <div className="flex justify-center mb-10">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              opacity: 0,
            }}
          >
            <span
              className="w-1.5 h-1.5 mx-auto rounded-full"
              style={{ background: "#00E5BE", boxShadow: "0 0 8px rgba(0,229,190,0.8)" }}
            />
            
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-5xl mx-auto mb-8" style={{ perspective: "1000px" }}>
          <h1
            ref={headlineRef}
            className="font-bold leading-[1.06]"
            style={{
              fontSize: "clamp(3rem, 7.5vw, 5.8rem)",
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.035em",
            }}
          >
            {headline1.map((w, i) => (
              <span
                key={`h1-${i}`}
                className="word inline-block text-white"
                style={{ marginRight: "0.22em", opacity: 0 }}
              >
                {w}
              </span>
            ))}
            <br />
            {headline2.map((w, i) => (
              <span
                key={`h2-${i}`}
                className="word inline-block"
                style={{
                  marginRight: "0.22em",
                  opacity: 0,
                  background: "linear-gradient(135deg, #a39bff 0%, #6C63FF 45%, #00E5BE 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {w}
              </span>
            ))}
            {headline3.map((w, i) => (
              <span
                key={`h3-${i}`}
                className="word inline-block text-white"
                style={{ opacity: 0 }}
              >
                {w}
              </span>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-center max-w-xl mx-auto mb-12 leading-relaxed"
          style={{
            opacity: 0,
            color: "rgba(255,255,255,0.38)",
            fontSize: "1.08rem",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Resume optimization, interview coaching, and intelligent job matching — everything you need, powered by AI.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20"
        >
          <Link
            href="/resume-checker"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm"
            style={{
              opacity: 0,
              background: "linear-gradient(135deg, #6C63FF, #5a52d5)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 0 40px rgba(108,99,255,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
              willChange: "transform",
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, boxShadow: "0 0 60px rgba(108,99,255,0.65)", duration: 0.28 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, boxShadow: "0 0 40px rgba(108,99,255,0.38)", duration: 0.28 })}
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>

          <Link
            href="#services"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-sm"
            style={{
              opacity: 0,
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { borderColor: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.9)", duration: 0.25 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { borderColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.5)", duration: 0.25 })}
          >
            See how it works
          </Link>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex flex-col sm:flex-row items-center justify-center max-w-lg mx-auto"
          style={{ opacity: 0 }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 text-center py-5"
              style={{
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "'Syne', sans-serif", color: "#fff" }}
              >
                <span ref={(el) => { counterRefs.current[i] = el }}>0+</span>
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
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, #080808, transparent)" }}
      />
    </section>
  )
}