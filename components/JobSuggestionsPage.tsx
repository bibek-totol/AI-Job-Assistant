'use client';
 
 import { useState } from 'react';
 import toast from 'react-hot-toast';
 import SectionTitle from '@/components/SectionTitle';
 import Textarea from '@/components/Textarea';
 import Select from '@/components/Select';
 import Button from '@/components/Button';
 import JobCard from '@/components/JobCard';
 import SkeletonLoader from '@/components/SkeletonLoader';
 import { motion } from 'framer-motion';

export default function JobSuggestion() {
  const [preferences, setPreferences] = useState('');
  const [country, setCountry] = useState('us');
  const [experience, setExperience] = useState('mid');
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  const countries = [
    { value: 'bd', label: 'Bangladesh' },
    { value: 'in', label: 'India' },
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

 

  const handleSearch = async () => {
    if (!preferences) {
      toast.error('Please enter your job preferences');
      return;
    }

    setIsSearching(true);
    const loadingToast = toast.loading('Searching for the latest jobs...');

    try {
      const response = await fetch('/api/job-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences,
          country,
          experience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      
      if (data.jobs?.length > 0) {
        toast.success(`Found ${data.jobs.length} jobs!`, { id: loadingToast });
      } else {
        toast.error('No jobs found matching your criteria', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error searching jobs:', error);
      toast.error('Failed to search for jobs', { id: loadingToast });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className=" min-h-screen  py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <SectionTitle center subtitle="AI-powered job matching based on your skills and preferences">
          Smart Job Search
        </SectionTitle>

        <div className="bg-transparent mt-6 border-6  border-cyan-400 shadow-[0_0_100px_rgba(6,182,212,0.5)] rounded-2xl p-8 mb-8">
          <div className="space-y-6 ">
            <Textarea
              label="Resume Summary / Job Preferences"
              placeholder="Describe your skills, experience, or what you're looking for..."
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

            <Button onClick={handleSearch} className="w-full cursor-pointer" size="lg">
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
    </motion.div>
  );
}
