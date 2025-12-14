'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import SectionTitle from '@/components/SectionTitle';
import FileUpload from '@/components/FileUpload';
import Button from '@/components/Button';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function CoverLetterGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');

  const handleGenerate = async () => {
    if (!file || !jobDescription) return;
    
    setIsGenerating(true);
    const loadingToast = toast.loading('Generating your cover letter...');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const data = await response.json();
      setGeneratedLetter(data.coverLetter);
      toast.success('Cover letter generated successfully!', { id: loadingToast });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('Failed to generate cover letter. Please try again.', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle center subtitle="Upload your CV and job description to generate a tailored cover letter">
          AI Cover Letter Generator
        </SectionTitle>

        {!generatedLetter ? (
          <div className="bg-violet-600/20 border-2 border-white rounded-2xl shadow-lg p-8 space-y-8">
            
            {/* CV Upload Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">1. Upload Your CV</h3>
              <FileUpload
                label="Upload Resume (PDF)"
                accept=".pdf"
                onFileSelect={setFile}
              />
            </div>

            {/* Job Description Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">2. Job Description</h3>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste the job description here
              </label>
              <textarea
                className="w-full h-48 p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-0 transition-colors resize-none text-gray-100"
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
                  className='cursor-pointer text-[13px]'
                  onClick={() => {
                    setGeneratedLetter('');
                    setFile(null);
                    setJobDescription('');
                  }}
                >
                  Create New
                </Button>
                <Button 
                  className='cursor-pointer text-[13px]' 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLetter);
                    toast.success('Cover letter copied to clipboard!');
                  }}
                >
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
