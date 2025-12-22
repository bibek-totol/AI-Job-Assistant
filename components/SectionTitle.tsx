import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({ children, subtitle, center = false }: SectionTitleProps) {
  return (
    <div className={` mt-12 ${center ? 'text-center' : ''}`}>
      <h2 className="text-4xl md:text-5xl font-bold  bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">{children}</h2>
      {subtitle && <p className="text-xl text-slate-300 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
