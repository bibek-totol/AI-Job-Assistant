"use client";

import { useEffect, useRef } from "react";
import { Shield, Zap, Target, Settings, Users } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Shield,
    title: "ATS-Optimized",
    description:
      "Every document passes applicant tracking systems. Your resume actually gets seen by humans.",
  },
  {
    icon: Zap,
    title: "Boost Productivity",
    description:
      "Let AI handle the repetitive work. You focus on what matters — relationships and interviews.",
  },
  {
    icon: Target,
    title: "Perfect Job Match",
    description:
      "Our model surfaces only the opportunities you'll actually want. No noise, no filler.",
  },
  {
    icon: Settings,
    title: "Easy Customization",
    description:
      "Tailor every document with a single prompt. Professional output without design expertise.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description:
      "AI coaching trained on insights from high-performers across every industry.",
  },
  {
    icon: Zap,
    title: "Smart Insights",
    description:
      "Actionable recommendations powered by analysis of millions of successful applications.",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      const headerEls = headerRef.current?.querySelectorAll(".header-el") ?? [];
      gsap.fromTo(
        headerEls,
        { y: 35, opacity: 0, filter: "blur(5px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 82%" },
        },
      );

      // Grid cells: slide in from alternating directions
      cellRefs.current.forEach((cell, i) => {
        if (!cell) return;
        const col = i % 3;
        const xFrom = col === 0 ? -30 : col === 2 ? 30 : 0;
        const yFrom = col === 1 ? 40 : 20;

        gsap.fromTo(
          cell,
          { x: xFrom, y: yFrom, opacity: 0, filter: "blur(4px)" },
          {
            x: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cell,
              start: "top 87%",
            },
            delay: (i % 3) * 0.07,
          },
        );
      });

      // Hover: number counter glow on enter
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
      style={{ background: "#0c0c0c" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
        }}
      />

      {/* Accent glow */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(ellipse at right, rgba(0,229,190,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <div
            className="flex items-center gap-3 mb-6 header-el"
            style={{ opacity: 0 }}
          >
            <div className="h-px w-8 bg-[#00E5BE]" />
            <span
              className="text-xs font-mono uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.28)" }}
            >
              Why JobAI
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2
              className="text-4xl sm:text-5xl font-bold text-white leading-tight header-el"
              style={{
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "-0.025em",
                maxWidth: "480px",
                opacity: 0,
              }}
            >
              Built for unfair advantage.
            </h2>
            <p
              className="text-sm max-w-xs leading-relaxed header-el"
              style={{
                color: "rgba(255,255,255,0.28)",
                fontFamily: "'DM Sans', sans-serif",
                opacity: 0,
              }}
            >
              Six core capabilities that put you ahead of 95% of applicants from
              day one.
            </p>
          </div>
        </div>

        {/* Feature grid */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                ref={(el) => {
                  cellRefs.current[index] = el;
                }}
                className="group relative p-8"
                style={{
                  background: "#0c0c0c",
                  opacity: 0,
                  willChange: "transform",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    background: "rgba(255,255,255,0.03)",
                    duration: 0.3,
                  });
                  const numEl = e.currentTarget.querySelector(".feat-num");
                  gsap.to(numEl, { color: "#6C63FF", duration: 0.25 });
                  const iconWrap = e.currentTarget.querySelector(".icon-wrap");
                  gsap.to(iconWrap, {
                    borderColor: "rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.07)",
                    duration: 0.3,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    background: "#0c0c0c",
                    duration: 0.3,
                  });
                  const numEl = e.currentTarget.querySelector(".feat-num");
                  gsap.to(numEl, {
                    color: "rgba(255,255,255,0.08)",
                    duration: 0.25,
                  });
                  const iconWrap = e.currentTarget.querySelector(".icon-wrap");
                  gsap.to(iconWrap, {
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    duration: 0.3,
                  });
                }}
              >
                {/* Number label */}
                <div
                  className="feat-num absolute top-6 right-7 text-xs font-mono"
                  style={{ color: "rgba(255,255,255,0.08)" }}
                >
                  0{index + 1}
                </div>

                <div
                  className="icon-wrap w-10 h-10 rounded-lg flex items-center justify-center mb-6"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <Icon
                    style={{
                      width: "18px",
                      height: "18px",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  />
                </div>

                <h3
                  className="text-sm font-semibold text-white mb-2.5"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {feature.title}
                </h3>

                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.30)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
