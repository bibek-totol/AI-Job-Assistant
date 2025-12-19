'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Briefcase, FileText } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only, no backend logic needed as per instructions
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen  pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Have questions about our AI Job Assistant? We're here to help you navigate your career journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information & Context */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Info Cards */}
            <div className="grid gap-6">
              <div className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                    <p className="text-slate-300">support@aijobassistant.com</p>
                    <p className="text-slate-300">careers@aijobassistant.com</p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Call Us</h3>
                    <p className="text-slate-300">+1 (555) 123-4567</p>
                    <p className="text-slate-300 text-sm mt-1">Mon-Fri from 9am to 6pm EST</p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-white/10">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Visit Us</h3>
                    <p className="text-slate-300">123 AI Innovation Drive</p>
                    <p className="text-slate-300">Tech Valley, CA 94043</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purpose Friendly Section */}
            <div className="glass p-8 rounded-2xl border border-white/10 mt-8">
              <h3 className="text-xl font-bold text-white mb-6">How can we assist you?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-300">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>Issues with Resume Parsing?</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <span>Job Suggestion Feedback</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                  <span>Interview Prep Questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-8 rounded-3xl border border-white/10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-slate-300">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all [&>option]:bg-slate-900"
                  required
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="resume">Resume Checker Support</option>
                  <option value="jobs">Job Suggestions Help</option>
                  <option value="interview">Interview Scheduler</option>
                  <option value="partnership">Partnership Opportunities</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-300">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="How can we help you today?"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2 group"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
