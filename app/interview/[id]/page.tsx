'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import SectionTitle from '@/components/SectionTitle';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function InterviewEntry() {
  const params = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = () => {
    setIsStarting(true);
    // This would later integrate with Vapi or similar service
    setTimeout(() => {
      alert('Interview would start here! (Vapi integration placeholder)');
      setIsStarting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Card>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl">
              🎤
            </div>
            <SectionTitle center subtitle="Please enter your details to begin">
              AI Interview Session
            </SectionTitle>
            <p className="text-sm text-gray-500">Interview ID: {params.id}</p>
          </div>

          <div className="space-y-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="p-4 bg-indigo-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">Before you start:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Ensure you're in a quiet environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Check your microphone and camera permissions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Have your resume and notes ready</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>The interview will take approximately 30-45 minutes</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleStartInterview}
              className="w-full"
              size="lg"
              disabled={!name || !email || isStarting}
            >
              {isStarting ? 'Starting...' : 'Start AI Interview'}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By starting this interview, you agree to be recorded for evaluation purposes
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact{' '}
            <a href="mailto:support@aijobassistant.com" className="text-indigo-600 hover:underline">
              support@aijobassistant.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
