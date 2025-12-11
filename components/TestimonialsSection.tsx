'use client';
import { User } from "lucide-react";

const testimonials = [
  {
    quote: "JobAI transformed my job search. I landed 3 interviews in my first week using their resume builder and job matching tools.",
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    variant: "white",
  },
  {
    quote: "The AI cover letter writer saved me hours. Each letter felt personalized and I got more callbacks than ever before.",
    name: "Marcus Johnson",
    role: "Product Manager at Stripe",
    variant: "blue",
  },
  {
    quote: "Interview prep with JobAI gave me the confidence I needed. The mock interviews were incredibly realistic and helpful.",
    name: "Emily Rodriguez",
    role: "UX Designer at Apple",
    variant: "blue",
  },
  {
    quote: "As a career changer, JobAI helped me translate my skills into a new industry. The career advisor feature is a game-changer.",
    name: "David Park",
    role: "Data Analyst at Netflix",
    variant: "white",
  },
  {
    quote: "The job matching AI found opportunities I never would have discovered on my own. Highly recommend for any job seeker.",
    name: "Lisa Thompson",
    role: "Marketing Director at Meta",
    variant: "blue",
  },
  {
    quote: "JobAI's resume optimization helped me pass ATS systems that previously rejected me. Finally getting the interviews I deserve.",
    name: "James Wilson",
    role: "DevOps Engineer at Amazon",
    variant: "white",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's what our users — job seekers, career changers, and professionals — think about JobAI
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card ${
                testimonial.variant === "blue" ? "testimonial-card-blue" : "testimonial-card-white"
              }`}
            >
              <p className={`text-lg mb-6 leading-relaxed ${
                testimonial.variant === "blue" ? "text-primary-foreground" : "text-foreground"
              }`}>
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  testimonial.variant === "blue" ? "bg-primary-foreground/20" : "bg-muted"
                }`}>
                  <User className={`w-6 h-6 ${
                    testimonial.variant === "blue" ? "text-primary-foreground" : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <p className={`font-semibold ${
                    testimonial.variant === "blue" ? "text-primary-foreground" : "text-foreground"
                  }`}>
                    {testimonial.name}
                  </p>
                  <p className={`text-sm ${
                    testimonial.variant === "blue" ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
