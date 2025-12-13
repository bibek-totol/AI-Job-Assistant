'use client';

import { useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import Textarea from '@/components/Textarea';
import Select from '@/components/Select';
import Button from '@/components/Button';
import JobCard from '@/components/JobCard';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function JobSuggestion() {
  const [preferences, setPreferences] = useState('');
  const [country, setCountry] = useState('us');
  const [experience, setExperience] = useState('mid');
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'de', label: 'Germany' },
    { value: 'au', label: 'Australia' },
    { value: 'sg', label: 'Singapore' },
  ];

  const experienceLevels = [
    { value: 'junior', label: 'Junior (0-2 years)' },
    { value: 'mid', label: 'Mid-Level (3-5 years)' },
    { value: 'senior', label: 'Senior (6+ years)' },
  ];

  const mockJobs = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA (Remote)',
      salary: '$120,000 - $160,000',
      type: 'Full-time',
      matchReason: 'Your React and TypeScript skills align perfectly with this role. The company values remote work, matching your preferences.',
    },
    {
      title: 'Full Stack Engineer',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      matchReason: 'Your experience with Next.js and Node.js makes you an ideal candidate. The startup culture matches your career goals.',
    },
    {
      title: 'React Developer',
      company: 'Digital Solutions Co.',
      location: 'Austin, TX (Hybrid)',
      salary: '$110,000 - $145,000',
      type: 'Contract',
      matchReason: 'Perfect match for your frontend expertise. The hybrid model offers flexibility while maintaining team collaboration.',
    },
    {
      title: 'Lead Software Engineer',
      company: 'Future Tech',
      location: 'Seattle, WA',
      salary: '$150,000 - $190,000',
      type: 'Full-time',
      matchReason: 'Leadership opportunities align with your career progression. Your technical stack is a 95% match with their requirements.',
    },
    {
      title: 'Frontend Architect',
      company: 'Scale Systems',
      location: 'Boston, MA (Remote)',
      salary: '$140,000 - $180,000',
      type: 'Full-time',
      matchReason: 'Your architectural experience and passion for scalable systems make this an excellent fit for your next career move.',
    },
    {
      title: 'UI/UX Engineer',
      company: 'Design First Inc.',
      location: 'Los Angeles, CA',
      salary: '$115,000 - $150,000',
      type: 'Full-time',
      matchReason: 'Combines your technical skills with design sensibility. The company culture emphasizes work-life balance.',
    },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setJobs(mockJobs);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionTitle center subtitle="AI-powered job matching based on your skills and preferences">
          Smart Job Search
        </SectionTitle>

        <div className="bg-[#4B3C70]/80 rounded-2xl shadow-lg p-8 mb-8">
          <div className="space-y-6 ">
            <Textarea
              label="Resume Summary / Job Preferences"
              placeholder="Describe your skills, experience, and what you're looking for..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Country"
                options={countries}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <Select
                label="Experience Level"
                options={experienceLevels}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            <Button onClick={handleSearch} className="w-full" size="lg">
              Find Matching Jobs
            </Button>
          </div>
        </div>

        {isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <SkeletonLoader />
              </div>
            ))}
          </div>
        )}

        {!isSearching && jobs.length > 0 && (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-300">
                Found {jobs.length} Perfect Matches
              </h3>
              <p className="text-gray-400">Sorted by relevance to your profile</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <JobCard key={index} {...job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
