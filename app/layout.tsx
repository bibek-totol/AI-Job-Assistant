import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import localFont from 'next/font/local';
import bgImage from '../public/backpic.png';
import { Toaster } from 'react-hot-toast';
import ChatbotWidget from '@/components/ChatbotWidget';


const sekuya = localFont({
  src: '../public/fonts/Sekuya-Regular.ttf',
  variable: '--font-sekuya',
});

export const metadata: Metadata = {
  title: {
    default: 'AI Job Assistant - Your Personal Career Companion',
    template: '%s | AI Job Assistant',
  },
  description: 'Find jobs, ace interviews, and advance your career with AI-powered tools. Resume checker, interview scheduler, job suggestions, and more.',
  keywords: ['AI Job Assistant', 'Career Companion', 'Resume Checker', 'Interview Prep', 'Job Search', 'AI Career Tools'],
  authors: [{ name: 'AI Job Assistant Team' }],
  creator: 'AI Job Assistant',
  publisher: 'AI Job Assistant',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-job-assistant.demo',
    title: 'AI Job Assistant - Your Personal Career Companion',
    description: 'Find jobs, ace interviews, and advance your career with AI-powered tools.',
    siteName: 'AI Job Assistant',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Job Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Job Assistant - Your Personal Career Companion',
    description: 'Find jobs, ace interviews, and advance your career with AI-powered tools.',
    creator: '@aijobassistant',
    images: ['/twitter-image.jpg'],
  },
  metadataBase: new URL('https://ai-job-assistant.demo'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en">
       <body
  className={`${sekuya.className} bg-contain bg-repeat backdrop-blur-md      min-h-screen`}
  style={{ backgroundImage: `url(${bgImage.src})` }}
>

  

        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main className="min-h-dvh pt-16 ">{children}</main>
        <Footer />
        <ChatbotWidget />
    
      </body>
      
    </html>
  );
}
