import Courses from "@/components/Courses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Recommended Courses',
  description: 'Upskill with AI-curated courses tailored to your career goals.',
};



export default function CoursesPage() {
 

  return (
    <Courses/>
  );
}
