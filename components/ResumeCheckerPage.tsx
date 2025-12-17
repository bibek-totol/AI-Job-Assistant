'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import SectionTitle from '@/components/SectionTitle';
import FileUpload from '@/components/FileUpload';
import Button from '@/components/Button';
import ATSScoreCard from '@/components/ATSScoreCard';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function ResumeChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    const loadingToast = toast.loading('Analyzing your resume...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
      toast.success('Resume analyzed successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Failed to analyze resume. Please try again.', { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#4B3C70]/50   min-h-screen  py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-4xl mx-auto">
        <SectionTitle  center subtitle="Get instant ATS analysis and personalized feedback">
          AI Resume Checker
        </SectionTitle>

        {!results ? (
          <div className="bg-purple-950 border-2 border-white rounded-2xl shadow-lg p-8">
            <FileUpload
              label="Upload Your Resume"
              accept=".pdf"
              onFileSelect={setFile}
            />

            <div className="mt-6">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-white mb-2">
                Job Description (Optional)
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get more targeted feedback..."
                className="w-full px-4 py-3 rounded-lg border border-purple-300/30 bg-white/10 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm min-h-[120px] resize-y"
              />
            </div>

            {file && (
              <div className="mt-6">
                <Button disabled={isAnalyzing} onClick={handleAnalyze} className= {`w-full ${isAnalyzing ? 'cursor-not-allowed' : 'cursor-pointer'}`}size="lg">
                  {
                    isAnalyzing ? 'Analyzing...' : 'Analyze Resume'
                  }
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
            <div className="mt-6 text-center ">
              <Button
                variant="outline"
                className='cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                onClick={() => {
                  setResults(null);
                  setFile(null);
                  setJobDescription('');
                  toast.success('Ready for a new analysis!');
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
