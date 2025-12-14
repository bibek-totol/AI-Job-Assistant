'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Building2, Zap, Crown } from "lucide-react";


const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      description: "Ideal for job seekers who want to explore AI-powered resume and career assistance.",
      monthlyPrice: 12,
      yearlyPrice: 10,
      buttonVariant: "outline" as const,
      popular: false,
      features: [
        "50 AI resume generations/month",
        "Basic cover letter templates",
        "Interview question practice",
      ],
      includes: [
        "Access to resume builder",
        "Basic job matching",
        "AI-powered career tips",
      ],
    },
    {
      name: "Pro",
      icon: Crown,
      description: "Best value for professionals and active job seekers who need advanced AI career tools.",
      monthlyPrice: 39,
      yearlyPrice: 31,
      buttonVariant: "default" as const,
      popular: true,
      features: [
        "Unlimited AI resume generations",
        "Advanced cover letter writer",
        "Priority interview coaching",
      ],
      includes: [
        "Custom resume templates",
        "LinkedIn optimization",
        "Faster response times",
      ],
    },
    {
      name: "Enterprise",
      icon: Building2,
      description: "Tailored AI solutions with enterprise-grade security, unlimited access, and dedicated support.",
      monthlyPrice: 89,
      yearlyPrice: 71,
      buttonVariant: "secondary" as const,
      popular: false,
      features: [
        "Unlimited access across teams",
        "Custom AI model training",
        "Dedicated account manager",
      ],
      includes: [
        "Custom integrations",
        "SSO & advanced security",
        "Onboarding & dedicated training",
      ],
    },
  ];

  return (
    <div className="min-h-screen  ">

      
      <main className="container mx-auto px-4 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-white font-serif mb-4">
            Choose Your Career Plan
          </h1>
          <p className="text-lg text-gray-200">
            Unlock AI-powered tools to accelerate your job search and career growth.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="flex items-center bg-card border border-border rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="text-xs bg-violet-200 text-accent-foreground  px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            
            return (
              <div
                key={index}
                className={`relative bg-violet-600/20 rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 right-6">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
                      Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.popular ? "bg-primary" : "bg-muted"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        plan.popular ? "text-primary-foreground" : "text-muted-foreground"
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground font-serif">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-foreground">${price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full mb-8 h-12 text-base font-semibold ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:text-primary"
                      : plan.buttonVariant === "secondary"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white  hover:text-primary"
                      : ""
                  }`}
                >
                  Get started
                </Button>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-border my-6" />

                {/* Includes */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-4">
                    {index === 0 ? "Free includes:" : index === 1 ? "Everything in Starter, plus:" : "Everything in Pro, plus:"}
                  </p>
                  <div className="space-y-3">
                    {plan.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Need a custom plan for your organization?
          </p>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:text-primary" variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </main>


    </div>
  );
};

export default PricingPage;
