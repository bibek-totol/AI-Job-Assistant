'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import logo from '../public/Screenshot_40.jpg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/resume-checker', label: 'Resume Checker' },
    { href: '/job-suggestions', label: 'Job Search' },
   
    { href: '/courses', label: 'Courses' },
    { href: '/cover-letter', label: 'Cover Letter' },
     { href: '/interview-scheduler', label: 'Interview' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 text-[13px]">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
              <img src={logo.src} className='w-full h-full object-contain' alt="AI Job Assistant Logo" />
            </div>
            <span className="font-bold gradient-text">AI Job Assistant</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 font-medium ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-4 py-2 font-bold' 
                      : 'text-slate-100 hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-gray-700 hover:bg-indigo-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
