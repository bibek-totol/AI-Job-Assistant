import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({ children, subtitle, center = false }: SectionTitleProps) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      <h2 className="text-4xl font-bold text-gray-900 mb-2">{children}</h2>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
}
