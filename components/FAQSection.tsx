"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

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
}: {
  item: (typeof audiences)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="border-b border-white/[0.06] last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span
          className={`text-sm font-medium transition-colors duration-200 ${isOpen ? "text-white" : "text-white/50 group-hover:text-white/75"}`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {item.title}
        </span>
        <div
          className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
            isOpen ? "border-[#6C63FF] bg-[#6C63FF]/10" : "border-white/10 group-hover:border-white/20"
          }`}
        >
          {isOpen ? (
            <Minus className="w-3 h-3 text-[#6C63FF]" />
          ) : (
            <Plus className="w-3 h-3 text-white/40" />
          )}
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "200px" : "0", opacity: isOpen ? 1 : 0 }}
      >
        <p
          className="text-sm text-white/30 leading-relaxed pb-5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {item.content}
        </p>
      </div>
    </div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-32 bg-[#080808] relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-5 blur-3xl rounded-full"
        style={{ background: "#00E5BE" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#6C63FF]" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/30">Who We Serve</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <h2
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
            >
              Built for every stage of your career.
            </h2>
            <p
              className="text-sm text-white/30 leading-relaxed mb-12 max-w-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Whether you're just starting out or making a bold pivot, JobAI meets you exactly where you are.
            </p>

            {/* Accordion */}
            <div className="border-t border-white/[0.06]">
              {audiences.map((item, index) => (
                <AccordionItem
                  key={index}
                  item={item}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>

          {/* Right — Stats panel */}
          <div className="lg:pt-20">
            {/* Purpose block */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full bg-[#00E5BE]" />
                <span className="text-xs font-mono uppercase tracking-wider text-white/30">Our Purpose</span>
              </div>
              <p
                className="text-sm text-white/40 leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                We remove the barriers that keep talented people from their dream roles. AI-powered tools that level
                the playing field — for everyone, not just the privileged few.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "50K+", label: "Resumes Optimized", accent: "#6C63FF" },
                { value: "98%", label: "Success Rate", accent: "#00E5BE" },
                { value: "24/7", label: "AI Support", accent: "#00E5BE" },
                { value: "5 min", label: "Avg. Analysis Time", accent: "#6C63FF" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ fontFamily: "'Syne', sans-serif", color: stat.accent }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs text-white/25 uppercase tracking-wider font-mono"
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 rounded-2xl border border-[#6C63FF]/20 bg-[#6C63FF]/5 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Ready to get started?
                </p>
                <p className="text-xs text-white/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Free forever. No credit card needed.
                </p>
              </div>
              <button
                className="shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #6C63FF, #5a52d5)",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 0 20px rgba(108, 99, 255, 0.3)",
                }}
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