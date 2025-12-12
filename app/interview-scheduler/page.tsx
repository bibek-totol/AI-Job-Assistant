import InterviewScheduler from "@/components/InterviewScheduler";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Interview Scheduler',
  description: 'Schedule and conduct AI-powered interviews with auto-generated questions.',
};

export default function InterviewSchedulerPage() {
  return (
    <InterviewScheduler/>
  );
}
