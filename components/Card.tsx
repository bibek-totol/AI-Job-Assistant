import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  const path = usePathname();
  console.log(path);
  return (
    <div
      className={`   ${path === '/courses' ? 'bg-slate-400' : 'bg-slate-700'} rounded-2xl shadow-lg p-6 border-2 border-white ${
        hover ? 'card-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
