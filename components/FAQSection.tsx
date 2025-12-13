'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const audiences = [
  {
    title: "RECENT GRADUATES",
    content: "Start your career journey with AI-powered tools designed for entry-level job seekers. Build your first professional resume, prepare for interviews, and discover opportunities matched to your potential.",
  },
  {
    title: "CAREER CHANGERS",
    content: "Transitioning to a new field? Our AI helps translate your existing skills, identify transferable experience, and craft compelling narratives that resonate with hiring managers in your target industry.",
  },
  {
    title: "EXPERIENCED PROFESSIONALS",
    content: "Advance your career with executive-level resume optimization, strategic job matching, and interview preparation tailored to senior roles. Stand out in competitive markets.",
  },
  {
    title: "TECH INDUSTRY",
    content: "Specialized tools for software engineers, data scientists, and tech professionals. Optimize for technical recruiters, prepare for coding interviews, and track opportunities at top tech companies.",
  },
  {
    title: "CREATIVE PROFESSIONALS",
    content: "Showcase your portfolio, craft compelling project descriptions, and find roles that value creativity. Our AI understands the nuances of creative job markets.",
  },
  {
    title: "REMOTE WORKERS",
    content: "Find remote-first opportunities, optimize your profile for distributed teams, and prepare for virtual interviews. Navigate the global job market with confidence.",
  },
  {
    title: "FREELANCERS",
    content: "Build a compelling professional brand, find contract opportunities, and manage multiple applications efficiently. Perfect for those building independent careers.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-0 lg:px-14 bg-[#4B3C70]/60 ">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Your Questions, Answered</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore how JobAI can support you at every stage of your career journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Accordion */}
          <div className="lg:col-span-2">
            <p className="text-lg font-semibold text-indigo-400 mb-4 tracking-wider">WHO WE SERVE</p>
            <Accordion type="single" collapsible className="space-y-2">
              {audiences.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-border"
                >
                  <AccordionTrigger className="text-left text-gray-100 text-lg font-bold hover:text-purple-600 py-4">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Purpose & Mission */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg text-gray-100  ">OUR PURPOSE</h3>
              <p className="text-gray-400 leading-relaxed">
                Our purpose is to make career advancement accessible, efficient, and achievable for everyone. 
                We remove the barriers that prevent job seekers from landing their dream roles by providing 
                AI-powered tools that level the playing field.
              </p>
            </div>
            
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
