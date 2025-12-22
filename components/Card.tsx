import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  hover = true,
}: CardProps) {
  const pathname = usePathname();

  const hideBorder = pathname.startsWith('/interview/');

  return (
    <div
      className={`
        bg-transparent rounded-2xl shadow-lg p-6
        ${hideBorder ? '' : 'border-2 border-cyan-400'}
        ${hover ? 'card-hover' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
