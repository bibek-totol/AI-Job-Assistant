"use client"

import { Shield, Zap, Target, Settings, Users, Sparkles } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "ATS-Optimized",
    description: "Every document is optimized to pass applicant tracking systems, increasing your interview chances.",
  },
  {
    icon: Zap,
    title: "Boost Productivity",
    description:
      "Focus on interview prep and networking while AI handles the repetitive application tasks efficiently.",
  },
  {
    icon: Target,
    title: "Perfect Job Match",
    description: "Our AI analyzes your profile and preferences to surface the most relevant opportunities for you.",
  },
  {
    icon: Settings,
    title: "Easy Customization",
    description: "Tailor every document with simple prompts. Professional results without design skills required.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Access AI career coaching based on insights from successful professionals in your field.",
  },
  {
    icon: Sparkles,
    title: "Smart Insights",
    description: "Get actionable recommendations powered by analysis of millions of successful applications.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose JobAI</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to give you an unfair advantage in your job search
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>

                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
