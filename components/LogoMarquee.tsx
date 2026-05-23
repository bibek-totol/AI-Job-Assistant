"use client"

const companies = ["Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Spotify", "Uber", "Google", "Airbnb", "Stripe"]

export function LogoMarquee() {
  return (
    <section className="py-14 bg-[#080808] relative overflow-hidden">
      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <p
        className="text-center text-xs uppercase tracking-[0.25em] text-white/20 mb-10 font-mono"
      >
        Trusted by professionals at
      </p>

      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 z-10"
          style={{ background: "linear-gradient(to right, #080808, transparent)" }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-40 z-10"
          style={{ background: "linear-gradient(to left, #080808, transparent)" }}
        />

        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "marquee 30s linear infinite",
          }}
        >
          {[...companies, ...companies, ...companies].map((company, index) => (
            <div
              key={index}
              className="inline-flex items-center mx-10 shrink-0"
            >
              <span
                className="text-sm font-semibold text-white/20 hover:text-white/40 transition-colors duration-300 cursor-default tracking-widest uppercase"
                style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "0.12em" }}
              >
                {company}
              </span>
              <span className="ml-10 w-1 h-1 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  )
}