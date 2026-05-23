"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/resume-checker", label: "Resume Checker" },
  { href: "/interview-scheduler", label: "Interview" },
  { href: "/job-suggestions", label: "Job Search" },
  { href: "/courses", label: "Courses" },
  { href: "/cover-letter", label: "Cover Letter" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(8, 8, 8, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6C63FF, #5a52d5)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 4L10 5.5V8.5L7 10L4 8.5V5.5L7 4Z" fill="white" />
              </svg>
            </div>
            <span
              className="font-bold text-base text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              JobAI
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative px-3.5 py-2 text-sm transition-colors duration-200 rounded-lg"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: active ? "#fff" : "rgba(255,255,255,0.45)",
                    background: active ? "rgba(108,99,255,0.12)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"
                  }}
                >
                  {active && (
                    <span
                      className="absolute inset-x-3 bottom-1 h-px rounded-full"
                      style={{ background: "#6C63FF" }}
                    />
                  )}
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-px"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "linear-gradient(135deg, #6C63FF, #5a52d5)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(108, 99, 255, 0.3)",
              }}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? "400px" : "0",
          opacity: isOpen ? 1 : 0,
          background: "rgba(8,8,8,0.97)",
          backdropFilter: "blur(16px)",
          borderTop: isOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-3 text-sm rounded-xl transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                  background: active ? "rgba(108,99,255,0.10)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="mt-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Link
              href="/contact"
              className="flex items-center justify-center w-full py-3 rounded-full text-sm font-semibold"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "linear-gradient(135deg, #6C63FF, #5a52d5)",
                color: "#fff",
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}