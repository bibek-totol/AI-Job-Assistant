"use client"

import { FileText, Mail, Video, Search, Users, ClipboardList, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: FileText,
    title: "Resume Checker",
    description:
      "Check your resume ATS compatibility and get personalized feedback to improve your chances of landing a job.",
    color: "from-violet-500 to-purple-500",
    href: "#",
  },
  {
    icon: Mail,
    title: "Cover Letter",
    description:
      "Generate compelling cover letters tailored to specific job descriptions using advanced AI technology.",
    color: "from-cyan-500 to-teal-500",
    href: "#",
  },
  {
    icon: Video,
    title: "Interview Prep",
    description: "Practice with AI-powered mock interviews and receive real-time feedback to ace your interviews.",
    color: "from-amber-500 to-orange-500",
    href: "#",
  },
  {
    icon: Search,
    title: "Job Search",
    description: "Discover thousands of curated job opportunities matched to your skills and preferences.",
    color: "from-emerald-500 to-green-500",
    href: "#",
  },
  {
    icon: Users,
    title: "Career Coaching",
    description: "Get personalized career guidance based on insights from successful professionals in your field.",
    color: "from-rose-500 to-pink-500",
    href: "#",
  },
  {
    icon: ClipboardList,
    title: "Skill Assessment",
    description: "Evaluate your skills with comprehensive assessments and identify areas for improvement.",
    color: "from-blue-500 to-indigo-500",
    href: "#",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Explore Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered tools designed to accelerate your job search, enhance your applications, and boost your career
            growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group glass rounded-2xl p-6 hover-lift cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <service.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{service.description}</p>

              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto group/btn">
                Learn more
                <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
