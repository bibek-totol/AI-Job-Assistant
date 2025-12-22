"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

export function FAQSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Your Questions, Answered</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explore how JobAI can support you at every stage of your career journey.
            </p>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Who We Serve</h3>
              <Accordion type="single" collapsible className="w-full">
                {audiences.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                    <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline py-4">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-accent mb-4">Our Purpose</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our purpose is to make career advancement accessible, efficient, and achievable for everyone. We remove
              the barriers that prevent job seekers from landing their dream roles by providing AI-powered tools that
              level the playing field.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/10">
                <div className="text-2xl font-bold text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Resumes Optimized</div>
              </div>
              <div className="p-4 rounded-xl bg-accent/10">
                <div className="text-2xl font-bold text-accent mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="p-4 rounded-xl bg-accent/10">
                <div className="text-2xl font-bold text-accent mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">AI Support</div>
              </div>
              <div className="p-4 rounded-xl bg-primary/10">
                <div className="text-2xl font-bold text-primary mb-1">5 min</div>
                <div className="text-sm text-muted-foreground">Avg. Analysis Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
