import CoverLetterGenerator from "@/components/CoverLetterGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator',
  description: 'Generate a personalized cover letter based on your resume and job description.',
};

export default function CoverLetterPage() {
  return (
    <CoverLetterGenerator />
  );
}
