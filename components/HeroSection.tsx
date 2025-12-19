
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import roboimg from "../public/robot-removebg-preview.png"

const HeroSection = () => {
  return (
    <section className="hero-gradient py-8  px-0 lg:px-14 ">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <span className="badge-accent inline-flex items-center gap-2 text-gray-300">
              <Sparkles className="w-4 h-4" />
              Your ultimate job search companion
            </span>

            <h1 className="text-4xl font-bold leading-tight text-gray-300">
              AI Assistant for{" "}
              <span className="text-highlight mt-2">
                Job Seekers & Career Growth
              </span>
            </h1>

            {/* <p className="text-lg text-muted-foreground max-w-xl">
              Build stunning resumes, craft compelling cover letters, prepare for interviews, 
              and discover perfect job matches — all powered by AI in one platform.
            </p> */}

            <div className="flex flex-wrap gap-4">
              <Link href="/pricing" className="flex flex-wrap gap-4">
              <Button size="lg" className="cursor-pointer rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 ">
                Subscriptions
              </Button>
              </Link>
              

              <Link href="/pricing">
              <Button 
                variant="outline" 
                size="lg" 
                className="cursor-pointer rounded-full px-8 font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Explore Services <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px] bg-transparent   rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <div className="text-center space-y-4 p-8">
                
                 <Image src={roboimg} alt="Logo"  fill
    className="object-contain"  />
               
                {/* <h3 className="text-2xl font-bold text-foreground">AI-Powered Career Tools</h3>
                <p className="text-muted-foreground">Smart assistance for every step of your job search</p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Logo Marquee */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <p className="text-center text-sm text-gray-300 mb-6">Trusted by professionals at leading companies</p>
          <div className="overflow-hidden relative mt-12">
            <div className="flex gap-16 animate-marquee">
              {["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Spotify", "Uber"].map((company, i) => (
                <span key={i} className="text-xl font-bold text-violet-300 whitespace-nowrap">
                  {company}
                </span>
              ))}
              {["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Spotify", "Uber"].map((company, i) => (
                <span key={`dup-${i}`} className="text-xl font-bold text-violet-300  whitespace-nowrap">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
