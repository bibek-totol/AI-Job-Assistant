'use client';

import { useState } from 'react';

import { Copy, Facebook, Mail, MessageCircle } from 'lucide-react';

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

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'gmail') => {
    const text = `Check out this AI-generated interview session: ${link}`;
    const subject = 'AI Interview Session';
    
    let url = '';
    
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
        break;
      case 'gmail':
        url = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Generated Link */}
      <div className="bg-slate-700 border-6 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Generated Interview Link</h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={link}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700"
            />
            <button
              onClick={handleCopy}
              className="cursor-pointer hover:scale-110 flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300"
            >
              <Copy className="w-5 h-5 mr-2" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-300">Share via:</span>
            
            <button
              onClick={() => handleShare('whatsapp')}
              className="cursor-pointer hover:scale-110  flex items-center px-4 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </button>

            <button
              onClick={() => handleShare('facebook')}
              className="cursor-pointer hover:scale-110 flex items-center px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-all duration-300"
            >
              <Facebook className="w-5 h-5 mr-2" />
              Facebook
            </button>

            <button
              onClick={() => handleShare('gmail')}
              className="cursor-pointer hover:scale-110 flex items-center px-4 py-2 bg-[#EA4335] text-white rounded-lg hover:opacity-90 transition-all duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              Gmail
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm text-center text-gray-300">
          Share this link with candidates to start the AI interview
        </p>
      </div>

      {/* Generated Questions */}
      <div className="bg-slate-700 border-6 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-100 mb-4">Generated Interview Questions</h3>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="flex items-start border-b-3 border-green-500 pb-2">
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                {index + 1}
              </span>
              <p className="text-white pt-1">{question}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
