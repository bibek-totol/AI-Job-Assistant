'use client';
import { useState } from "react";
import { FileText, Briefcase, MessageSquare, Search, Mail, Award, ArrowRight } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional, ATS-optimized resumes that stand out. Our AI analyzes job descriptions and tailors your resume for maximum impact.",
    link: "Build Resume",
  },
  {
    icon: Mail,
    title: "Cover Letter Writer",
    description: "Generate compelling, personalized cover letters in seconds. Match your experience with job requirements effortlessly.",
    link: "Write Cover Letter",
  },
  {
    icon: MessageSquare,
    title: "Interview Coach",
    description: "Practice with AI-powered mock interviews. Get instant feedback, suggested answers, and confidence-building tips.",
    link: "Start Practice",
  },
  {
    icon: Search,
    title: "Job Matching",
    description: "Discover perfect job opportunities matched to your skills, experience, and preferences. Never miss a relevant opening.",
    link: "Find Jobs",
  },
  {
    icon: Award,
    title: "Skills Assessment",
    description: "Identify your strengths and areas for growth. Get personalized recommendations to boost your career prospects.",
    link: "Assess Skills",
  },
  {
    icon: Briefcase,
    title: "Career Advisor",
    description: "Get AI-powered career guidance. Plan your path, negotiate salaries, and make informed decisions about your future.",
    link: "Get Advice",
  },
];

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(0);
  const ActiveIcon = services[activeService].icon;

  return (
    <section className="py-20 bg-secondary" id="services">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Explore Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered tools designed to accelerate your job search, enhance your applications, 
            and boost your career growth.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Service Showcase */}
          <div className="bg-feature-blue-light rounded-3xl p-8 lg:p-12 min-h-[500px] flex flex-col">
            <div className="bg-primary rounded-2xl p-8 text-center mb-8">
              <ActiveIcon className="w-12 h-12 mx-auto text-primary-foreground mb-4" />
              <h3 className="text-xl font-bold text-primary-foreground">
                {services[activeService].title}
              </h3>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                  <ActiveIcon className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="bg-cream rounded-3xl p-8 lg:p-12 min-h-[500px] flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-6">{services[activeService].title}</h3>
            <p className="text-lg text-muted-foreground mb-8">
              {services[activeService].description}
            </p>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              {services[activeService].link} <ArrowRight className="w-5 h-5" />
            </a>

            {/* Service Navigation */}
            <div className="mt-12 grid grid-cols-3 gap-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveService(index)}
                    className={`p-4 rounded-xl transition-all ${
                      index === activeService
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-card hover:bg-muted border border-border"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
