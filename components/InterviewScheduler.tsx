'use client';

import { useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import Button from '@/components/Button';
import GeneratedLinkBox from '@/components/GeneratedLinkBox';

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

  const mockQuestions = {
    technical: [
      'Explain the difference between let, const, and var in JavaScript',
      'What is the Virtual DOM and how does React use it?',
      'How would you optimize the performance of a React application?',
      'Explain the concept of closures in JavaScript',
      'What are the differences between SQL and NoSQL databases?',
      'Describe your experience with version control systems',
      'How do you approach debugging a complex application?',
      'What is your preferred testing strategy?',
      'Explain the concept of RESTful APIs',
      'How do you ensure code quality in your projects?',
      'What design patterns have you used in your work?',
      'How do you stay updated with new technologies?',
      'Describe a challenging technical problem you solved',
      'What is your experience with CI/CD pipelines?',
      'How do you approach code reviews?',
    ],
    behavioral: [
      'Tell me about a time you faced a significant challenge at work',
      'Describe a situation where you had to work with a difficult team member',
      'How do you prioritize tasks when managing multiple deadlines?',
      'Give an example of when you showed leadership',
      'Describe a time you failed and what you learned from it',
      'How do you handle constructive criticism?',
      'Tell me about a project you\'re most proud of',
      'How do you adapt to changes in project requirements?',
      'Describe your ideal work environment',
      'How do you handle stress and pressure?',
      'Give an example of when you went above and beyond',
      'How do you approach learning new skills?',
      'Describe a time you had to make a difficult decision',
      'How do you handle conflicts in a team setting?',
      'What motivates you in your career?',
    ],
    mock: [
      'Tell me about yourself and your background',
      'Why are you interested in this position?',
      'What are your greatest strengths and weaknesses?',
      'Where do you see yourself in 5 years?',
      'Why should we hire you?',
      'Describe your experience with [relevant technology]',
      'How do you handle tight deadlines?',
      'What is your preferred work style?',
      'Tell me about a successful project you completed',
      'How do you handle failure?',
      'What interests you about our company?',
      'Describe your leadership style',
      'How do you approach problem-solving?',
      'What are your salary expectations?',
      'Do you have any questions for us?',
    ],
  };

  const handleSchedule = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(7);
      setGeneratedData({
        link: `${window.location.origin}/interview/${randomId}`,
        questions: mockQuestions[interviewType as keyof typeof mockQuestions],
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle center subtitle="Create AI-powered interview sessions with auto-generated questions">
          Interview Scheduler
        </SectionTitle>

        {!generatedData ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
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
                className="w-full"
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
                variant="outline"
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
