import React from 'react';
import { getInitials, getAvatarColor } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { wh: 28, text: 'text-[10px]' },
  md: { wh: 36, text: 'text-xs' },
  lg: { wh: 48, text: 'text-sm' },
  xl: { wh: 64, text: 'text-lg' },
};

export default function Avatar({ name, size = 'md', className }: AvatarProps) {
  const { wh, text } = sizeMap[size];
  const bg = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ${text} ${className || ''}`}
      style={{ width: wh, height: wh, backgroundColor: bg }}
    >
      {initials}
    </div>
  );
}
