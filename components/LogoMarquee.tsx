"use client"

const companies = ["Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Spotify", "Uber", "Google", "Airbnb", "Stripe"]

export function LogoMarquee() {
  return (
    <section className="py-16 border-y border-border/50 overflow-hidden">
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Trusted by professionals at leading companies
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee">
          {[...companies, ...companies].map((company, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-12 text-2xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
