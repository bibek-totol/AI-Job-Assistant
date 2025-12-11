'use client';

import { useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import FileUpload from '@/components/FileUpload';
import Button from '@/components/Button';
import ATSScoreCard from '@/components/ATSScoreCard';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function ResumeChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults({
        score: 85,
        strengths: [
          'Clear and concise professional summary',
          'Quantifiable achievements with metrics',
          'Well-structured work experience section',
          'Relevant technical skills highlighted',
          'Clean, ATS-friendly formatting',
        ],
        improvements: [
          'Add more action verbs to describe responsibilities',
          'Include specific project outcomes and impact',
          'Expand on leadership experiences',
          'Add certifications section',
        ],
        missingSkills: [
          'Cloud Computing (AWS/Azure)',
          'Docker & Kubernetes',
          'CI/CD Pipeline',
          'Agile/Scrum',
          'Data Analytics',
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle center subtitle="Get instant ATS analysis and personalized feedback">
          AI Resume Checker
        </SectionTitle>

        {!results ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <FileUpload
              label="Upload Your Resume"
              accept=".pdf"
              onFileSelect={setFile}
            />

            {file && (
              <div className="mt-6">
                <Button onClick={handleAnalyze} className="w-full" size="lg">
                  Analyze Resume
                </Button>
              </div>
            )}

            {isAnalyzing && (
              <div className="mt-8">
                <SkeletonLoader />
              </div>
            )}

            <div className="mt-8 p-6 bg-indigo-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>ATS Compatibility Score (0-100)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Detailed strengths analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Actionable improvement suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Missing skills recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <ATSScoreCard
              score={results.score}
              strengths={results.strengths}
              improvements={results.improvements}
              missingSkills={results.missingSkills}
            />
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setResults(null);
                  setFile(null);
                }}
              >
                Analyze Another Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
