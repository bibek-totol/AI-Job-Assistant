import JobSuggestions from "@/components/JobSuggestionsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Job Suggestions',
  description: 'Get personalized job recommendations based on your skills and experience.',
};


export default function JobSuggestionsPage() {
  

  return (
   <JobSuggestions/>
  );
}
