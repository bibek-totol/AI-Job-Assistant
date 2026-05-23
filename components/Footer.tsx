"use client"

import Link from "next/link"
import { Twitter, Linkedin, Github } from "lucide-react"

const footerLinks = {
  Product: [
    { name: "Resume Checker", href: "#" },
    { name: "Job Search", href: "#" },
    { name: "Interview Scheduler", href: "#" },
    { name: "Courses", href: "#" },
    { name: "Salary Estimator", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
}

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
]

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(108,99,255,0.4), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
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

            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", maxWidth: "200px" }}
            >
              Your AI-powered career companion. Find jobs, ace interviews, grow faster.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-white/15"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                    color: "rgba(255,255,255,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = "#fff"
                    el.style.background = "rgba(255,255,255,0.06)"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.color = "rgba(255,255,255,0.35)"
                    el.style.background = "rgba(255,255,255,0.02)"
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p
                className="text-xs uppercase tracking-[0.15em] mb-5"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: "rgba(255,255,255,0.25)",
                  fontWeight: 700,
                }}
              >
                {group}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif" }}
          >
            © {new Date().getFullYear()} JobAI. All rights reserved.
          </p>

          <div className="flex items-center gap-1">
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Built with
            </span>
            <span className="text-xs" style={{ color: "#6C63FF" }}>♥</span>
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'DM Sans', sans-serif" }}
            >
              for job seekers everywhere
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}