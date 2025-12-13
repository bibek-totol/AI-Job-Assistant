'use client';

import { useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Card from '@/components/Card';
import FileUpload from '@/components/FileUpload';
import SkeletonLoader from '@/components/SkeletonLoader';

interface Course {
  title: string;
  platform: string;
  difficulty: string;
  duration: string;
  reason: string;
  url: string;
}

export default function Courses() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobGoal, setJobGoal] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const mockCourses: Course[] = [
    {
      title: 'Advanced React Patterns',
      platform: 'Udemy',
      difficulty: 'Advanced',
      duration: '12 hours',
      reason: 'Strengthen your React skills with advanced patterns and best practices',
      url: '#',
    },
    {
      title: 'TypeScript: The Complete Developer\'s Guide',
      platform: 'Udemy',
      difficulty: 'Intermediate',
      duration: '24 hours',
      reason: 'Essential for modern frontend development, missing from your current skillset',
      url: '#',
    },
    {
      title: 'AWS Certified Solutions Architect',
      platform: 'Coursera',
      difficulty: 'Advanced',
      duration: '40 hours',
      reason: 'Cloud skills are highly sought after in your target roles',
      url: '#',
    },
    {
      title: 'System Design Interview Prep',
      platform: 'Educative',
      difficulty: 'Advanced',
      duration: '15 hours',
      reason: 'Critical for senior-level positions you\'re targeting',
      url: '#',
    },
    {
      title: 'Docker & Kubernetes: The Complete Guide',
      platform: 'Udemy',
      difficulty: 'Intermediate',
      duration: '22 hours',
      reason: 'DevOps knowledge will make you a more well-rounded engineer',
      url: '#',
    },
    {
      title: 'Data Structures and Algorithms',
      platform: 'LeetCode',
      difficulty: 'All Levels',
      duration: 'Self-paced',
      reason: 'Essential for technical interviews at top companies',
      url: '#',
    },
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setCourses(mockCourses);
      setIsAnalyzing(false);
    }, 2000);
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Choose one option:
                  </h3>
                  <FileUpload
                    label="Upload Your Resume"
                    accept=".pdf"
                    onFileSelect={setResumeFile}
                  />
                </div>

                <div className="text-center text-gray-500">OR</div>

                <Textarea
                  label="Describe Your Career Goals"
                  placeholder="e.g., I want to become a senior full-stack developer specializing in cloud technologies..."
                  value={jobGoal}
                  onChange={(e) => setJobGoal(e.target.value)}
                  rows={4}
                />

                <Button
                  onClick={handleAnalyze}
                  className="w-full"
                  size="lg"
                  disabled={(!resumeFile && !jobGoal) || isAnalyzing}
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
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Recommended Courses
                </h3>
                <p className="text-gray-600">
                  {courses.length} courses tailored to your career path
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setCourses([]);
                  setResumeFile(null);
                  setJobGoal('');
                }}
              >
                Start Over
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                          course.difficulty
                        )}`}
                      >
                        {course.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl mb-4">
                    <p className="text-sm font-medium text-indigo-900 mb-1">
                      Why this course:
                    </p>
                    <p className="text-sm text-indigo-700">{course.reason}</p>
                  </div>

                  <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    View Course
                  </button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
