'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SectionTitle from '@/components/SectionTitle';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Card from '@/components/Card';
import FileUpload from '@/components/FileUpload';
import SkeletonLoader from '@/components/SkeletonLoader';

interface Course {
  title: string;
  platform: string;
  duration: string;
  reason: string;
  platformUrl: string;
  difficultyLevel: string;
}

export default function Courses() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobGoal, setJobGoal] = useState('');
  const [country, setCountry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

 
  const handleAnalyze = async () => {
    if (!country) {
      toast.error('Please select a country');
      return;
    }

    setIsAnalyzing(true);
    const loadingToast = toast.loading('Getting course recommendations...');

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append('file', resumeFile);
      }
      formData.append('jobGoal', jobGoal);
      formData.append('country', country);

      const response = await fetch('/api/recommend-courses', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get course recommendations');
      }

      const data = await response.json();
      setCourses(data.courses || []);
      toast.success('Course recommendations generated!', { id: loadingToast });
    } catch (error) {
      console.error('Error getting course recommendations:', error);
      toast.error('Failed to get course recommendations. Showing fallback courses.', { id: loadingToast });
      router.push('/courses');
    
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle center subtitle="Get personalized course recommendations based on your career goals">
          AI Course Recommendations
        </SectionTitle>

        {courses.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#4B3C70]/80 rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Choose one option:
                  </h3>
                  <FileUpload
                    label="Upload Your Resume"
                    accept=".pdf"
                    onFileSelect={setResumeFile}
                  />
                </div>

                <div className="text-center text-gray-300">OR</div>

                <Textarea
                  label="Describe Your Career Goals"
                  placeholder="e.g., I want to become a senior full-stack developer specializing in cloud technologies..."
                  value={jobGoal}
                  onChange={(e) => setJobGoal(e.target.value)}
                  rows={4}
                />

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-white mb-2">
                    Country *
                  </label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-purple-300/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  >
                    <option value="" className="text-gray-500">Select a country</option>
                    <option value="Bangladesh" className="text-gray-500">Bangladesh</option>
                    <option value="India" className="text-gray-500">India</option>
                    <option value="Europe" className="text-gray-500">Europe</option>
                  </select>
                </div>

                <Button
                  onClick={handleAnalyze}
                  className="w-full cursor-pointer"
                  size="lg"
                  disabled={(!resumeFile && !jobGoal) || !country || isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Get Course Recommendations'}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="mt-8">
                  <SkeletonLoader />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2 flex justify-between items-center">
              <div className='border-2 bg-white border-white p-3 rounded-4xl'>
                {/* <h3 className="text-2xl font-bold text-white">
                  Recommended Courses
                </h3> */}

                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Recommended Courses
                </h1>

                <p className="text-gray-500">
                  {courses.length} courses tailored to your career path
                </p>
                <p className="text-sm text-indigo-600 font-medium mt-1">
                  📍 Country: {country}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setCourses([]);
                  setResumeFile(null);
                  setJobGoal('');
                  setCountry('');
                }}
                className='cursor-pointer bg-white'
              >
                Start Over
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {courses.map((course, index) => (
                <Card key={index}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">
                      {course.title}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Platform:</span>
                      <span className="font-medium text-gray-900">{course.platform}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Difficulty:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficultyLevel)}`}>
                        {course.difficultyLevel}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl mb-4">
                    <p className="text-sm font-medium text-indigo-900 mb-1">
                      Why this course:
                    </p>
                    <p className="text-sm text-indigo-700">{course.reason}</p>
                  </div>

                  <a 
                    href={course.platformUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cursor-pointer block text-center w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    View Course
                  </a>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
