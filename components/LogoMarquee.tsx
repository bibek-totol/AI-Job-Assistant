"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

const companies = ["Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Spotify", "Uber", "Google", "Airbnb", "Stripe"]

export function LogoMarquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Measure one set width
    const totalWidth = track.scrollWidth / 3

    // GSAP seamless infinite marquee
    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: 28,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${parseFloat(x) % totalWidth}px`,
      },
    })

    // Scroll-triggered label fade in
    gsap.fromTo(
      labelRef.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      }
    )

    // Pause on hover
    const handleEnter = () => tweenRef.current?.pause()
    const handleLeave = () => tweenRef.current?.play()
    track.addEventListener("mouseenter", handleEnter)
    track.addEventListener("mouseleave", handleLeave)

    return () => {
      tweenRef.current?.kill()
      track.removeEventListener("mouseenter", handleEnter)
      track.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-14 bg-[#080808] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }} />

      <p
        ref={labelRef}
        className="text-center text-xs uppercase tracking-[0.25em] mb-10 font-mono"
        style={{ color: "rgba(255,255,255,0.18)", opacity: 0 }}
      >
        Trusted by professionals at
      </p>

      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #080808, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-40 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #080808, transparent)" }} />

        <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
          {[...companies, ...companies, ...companies].map((company, index) => (
            <div key={index} className="inline-flex items-center shrink-0 mx-10">
              <span
                className="text-sm font-semibold uppercase cursor-default transition-colors duration-300"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.18)",
                }}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { color: "rgba(255,255,255,0.55)", duration: 0.3 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { color: "rgba(255,255,255,0.18)", duration: 0.3 })}
              >
                {company}
              </span>
              <span className="ml-10 w-1 h-1 rounded-full inline-block" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}