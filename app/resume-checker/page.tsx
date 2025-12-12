import ResumeChecker from "@/components/ResumeCheckerPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Resume Checker',
  description: 'Analyze your resume with AI and get actionable feedback to improve your ATS score.',
};


export default function ResumeCheckerPage() {
  

  return (
    <ResumeChecker/>
  );
}
