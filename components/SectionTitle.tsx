import { ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({ children, subtitle, center = false }: SectionTitleProps) {
  return (
    <div className={` mt-8 ${center ? 'text-center' : ''}`}>
      <h2 className="text-4xl  text-white mb-2">{children}</h2>
      {subtitle && <p className="text-lg text-white">{subtitle}</p>}
    </div>
  );
}
