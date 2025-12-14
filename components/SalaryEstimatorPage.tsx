'use client';

import { useState } from 'react';
import SectionTitle from '@/components/SectionTitle';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function SalaryEstimator() {
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('mid');
  const [country, setCountry] = useState('bd');
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);

  const experienceLevels = [
    { value: 'junior', label: 'Junior (0-2 years)' },
    { value: 'mid', label: 'Mid-Level (3-5 years)' },
    { value: 'senior', label: 'Senior (6-10 years)' },
    { value: 'lead', label: 'Lead (10+ years)' },
  ];

  const countries = [
    { value: 'bd', label: 'Bangladesh' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'de', label: 'Germany' },
    { value: 'au', label: 'Australia' },
    { value: 'sg', label: 'Singapore' },
  ];

  const mockEstimates = {
    junior: { min: 60000, max: 85000, avg: 72500 },
    mid: { min: 90000, max: 130000, avg: 110000 },
    senior: { min: 130000, max: 180000, avg: 155000 },
    lead: { min: 160000, max: 220000, avg: 190000 },
  };

  const handleEstimate = () => {
    setIsEstimating(true);
    setTimeout(() => {
      const data = mockEstimates[experience as keyof typeof mockEstimates];
      setEstimate({
        ...data,
        jobTitle,
        experience,
        country,
        insights: [
          '15% higher than last year',
          'High demand in tech industry',
          'Remote positions pay 8% more on average',
          'Certifications can increase salary by 12%',
        ],
      });
      setIsEstimating(false);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle center subtitle="Get AI-powered salary insights for any role">
          Salary Estimator
        </SectionTitle>

        {!estimate ? (
          <div className="bg-violet-600/20 border-2 border-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <Input
                label="Job Title"
                placeholder="e.g., Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />

              <Select
                label="Experience Level"
                options={experienceLevels}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />

              <Select
                label="Country"
                options={countries}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <Button
                onClick={handleEstimate}
                className="w-full cursor-pointer"
                size="lg"
                disabled={!jobTitle || isEstimating}
              >
                {isEstimating ? 'Calculating...' : 'Estimate Salary'}
              </Button>
            </div>

            <div className="mt-8 p-6 bg-indigo-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                Our estimates include:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Industry-wide salary ranges</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Location-based adjustments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Experience level comparisons</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">✓</span>
                  <span>Market trend insights</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Salary Range Card */}
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Estimated Salary for {estimate.jobTitle}
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Minimum</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(estimate.min)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl">
                  <p className="text-sm opacity-90 mb-2">Average</p>
                  <p className="text-3xl font-bold">{formatCurrency(estimate.avg)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-2">Maximum</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(estimate.max)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Actual salaries may vary based on company size,
                  specific skills, and negotiation. This estimate is based on current
                  market data.
                </p>
              </div>
            </Card>

            {/* Salary Chart Placeholder */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Salary Distribution
              </h3>
              <div className="h-64 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-gray-600">
                    Interactive salary chart visualization
                  </p>
                </div>
              </div>
            </Card>

            {/* Market Insights */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market Insights</h3>
              <ul className="space-y-3">
                {estimate.insights.map((insight: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-gray-700">{insight}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setEstimate(null);
                  setJobTitle('');
                }}
              >
                Estimate Another Position
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
