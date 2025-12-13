'use client';

import { useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import FileUpload from '@/components/FileUpload';
import Button from '@/components/Button';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function CoverLetterGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');

  const handleGenerate = () => {
    if (!file || !jobDescription) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setGeneratedLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the position as described. With my background in [relevant field based on CV] and my passion for [company mission/industry], I am confident in my ability to contribute effectively to your team.

Based on the job description, I understand you are looking for someone who can [key requirement from JD]. My experience with [relevant skill] aligns perfectly with this need.

I would welcome the opportunity to discuss how my skills and experience make me a strong candidate for this role. Thank you for your time and consideration.

Sincerely,
[Your Name]`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle center subtitle="Upload your CV and job description to generate a tailored cover letter">
          AI Cover Letter Generator
        </SectionTitle>

        {!generatedLetter ? (
          <div className="bg-[#4B3C70]/80 rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* CV Upload Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Upload Your CV</h3>
              <FileUpload
                label="Upload Resume (PDF)"
                accept=".pdf"
                onFileSelect={setFile}
              />
            </div>

            {/* Job Description Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Job Description</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste the job description here
              </label>
              <textarea
                className="w-full h-48 p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors resize-none text-gray-700"
                placeholder="Paste the full job description..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <Button 
                onClick={handleGenerate} 
                className="w-full" 
                size="lg"
                disabled={!file || !jobDescription || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
              </Button>
            </div>

            {isGenerating && (
              <div className="mt-8">
                <SkeletonLoader />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Generated Cover Letter</h3>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedLetter('');
                    setFile(null);
                    setJobDescription('');
                  }}
                >
                  Create New
                </Button>
                <Button onClick={() => navigator.clipboard.writeText(generatedLetter)}>
                  Copy to Clipboard
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 whitespace-pre-wrap text-gray-700 leading-relaxed font-serif">
              {generatedLetter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
