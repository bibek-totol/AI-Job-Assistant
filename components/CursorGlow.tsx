"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Drop this into your root layout inside <body>.
 * Creates a subtle indigo cursor glow that follows the mouse.
 * Only renders on desktop (hidden on touch devices).
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const halo = haloRef.current
    if (!dot || !halo) return

    const move = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.12, ease: "power2.out" })
      gsap.to(halo, { x: e.clientX, y: e.clientY, duration: 0.55, ease: "power2.out" })
    }

    const grow = () => {
      gsap.to(halo, { scale: 1.8, opacity: 0.6, duration: 0.3 })
      gsap.to(dot, { scale: 0.5, opacity: 0.6, duration: 0.3 })
    }
    const shrink = () => {
      gsap.to(halo, { scale: 1, opacity: 0.35, duration: 0.3 })
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 })
    }

    window.addEventListener("mousemove", move)
    document.querySelectorAll("a, button, [role=button]").forEach((el) => {
      el.addEventListener("mouseenter", grow)
      el.addEventListener("mouseleave", shrink)
    })

    return () => {
      window.removeEventListener("mousemove", move)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#6C63FF",
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference",
        }}
      />
      {/* Halo */}
      <div
        ref={haloRef}
        className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid rgba(108,99,255,0.5)",
          transform: "translate(-50%, -50%)",
          opacity: 0.35,
        }}
      />
    </>
  )
}
