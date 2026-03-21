import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, clickable = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-zinc-100 p-6',
        clickable && 'cursor-pointer hover:border-zinc-300 transition-all duration-150',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
