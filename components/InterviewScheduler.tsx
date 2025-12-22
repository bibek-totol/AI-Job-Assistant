'use client';

import { useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import Button from '@/components/Button';
import GeneratedLinkBox from '@/components/GeneratedLinkBox';
import toast from 'react-hot-toast';

export default function InterviewScheduler() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewType, setInterviewType] = useState('technical');
  const [interviewTime, setInterviewTime] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  interface GeneratedData {
    link: string;
    questions: string[];
  }

  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);

  const interviewTypes = [
    { value: 'technical', label: 'Technical Interview' },
    { value: 'behavioral', label: 'Behavioral Interview' },
    { value: 'mock', label: 'Mock Interview' },
  ];

  

  const handleSchedule = async () => {
    const toastId = toast.loading('Generating questions...');
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          interviewType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      toast.success('Questions generated successfully!', { id: toastId });
      
      const randomId = Math.random().toString(36).substring(7);
      
      setGeneratedData({
        link: `${window.location.origin}/interview/${randomId}`,
        questions: data.questions,
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate questions', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className=" min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle center subtitle="Create AI-powered interview sessions with auto-generated questions">
          Interview Scheduler
        </SectionTitle>

        {!generatedData ? (
          <div className="bg-transparent mt-6 border-6  border-cyan-400 shadow-[0_0_100px_rgba(6,182,212,0.5)]   rounded-2xl  p-8">
            <div className="space-y-6">
              <Input
                label="Job Title"
                placeholder="e.g., Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />

              <Textarea
                label="Job Description"
                placeholder="Paste the job description or key responsibilities..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
              />

              <Select
                label="Interview Type"
                options={interviewTypes}
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
              />

              <Input
                label="Interview Date & Time"
                type="datetime-local"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
              />

              <Button
                onClick={handleSchedule}
                className="w-full cursor-pointer"
                size="lg"
                disabled={!jobTitle || !jobDescription || !interviewTime || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Interview'}
              </Button>
            </div>

            <div className="mt-8 p-6 bg-indigo-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">What happens next:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">1.</span>
                  <span>AI generates 15 tailored interview questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">2.</span>
                  <span>You receive a unique interview link</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">3.</span>
                  <span>Share the link with candidates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">4.</span>
                  <span>AI conducts the interview automatically</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <GeneratedLinkBox
              link={generatedData.link}
              questions={generatedData.questions}
            />
            <div className="mt-6 text-center">
              <Button
              
                className='cursor-pointer   bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-110'
                onClick={() => {
                  setGeneratedData(null);
                  setJobTitle('');
                  setJobDescription('');
                  setInterviewTime('');
                }}
              >
                Schedule Another Interview
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
