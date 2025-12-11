'use client';

import { useState } from 'react';

interface GeneratedLinkBoxProps {
  link: string;
  questions: string[];
}

export default function GeneratedLinkBox({ link, questions }: GeneratedLinkBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Generated Link */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Interview Link</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700"
          />
          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Share this link with candidates to start the AI interview
        </p>
      </div>

      {/* Generated Questions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Interview Questions</h3>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                {index + 1}
              </span>
              <p className="text-gray-700 pt-1">{question}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
