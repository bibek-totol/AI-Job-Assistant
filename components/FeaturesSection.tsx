'use client';
import { Clock, Shield, Zap, Target, Settings, Users } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Save Time Instantly",
    description: "Automate resume creation, cover letter writing, and job applications to free up hours in your job search.",
  },
  {
    icon: Shield,
    title: "ATS-Optimized",
    description: "Every document is optimized to pass Applicant Tracking Systems, increasing your interview chances.",
  },
  {
    icon: Zap,
    title: "Boost Productivity",
    description: "Focus on interview prep and networking while AI handles the repetitive application tasks efficiently.",
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
];

const FeaturesSection = () => {
  return (
    <section className="py-20 hero-gradient px-0 lg:px-14">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Why Choose JobAI</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how JobAI helps job seekers save time, land interviews, and advance their careers with AI-powered tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="feature-card group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
