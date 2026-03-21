'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge, { getStatusVariant } from '@/components/ui/Badge';
import { formatMXN, formatDate } from '@/lib/utils';
import { Calendar, Users } from 'lucide-react';
import type { Event, Category } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();
  const categoryName = typeof event.category_id === 'object'
    ? (event.category_id as Category).name
    : 'General';

  return (
    <Card clickable onClick={() => router.push(`/events/${event._id}`)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
          {categoryName}
        </span>
        <Badge variant={getStatusVariant(event.status)}>{undefined}</Badge>
      </div>

      <h3 className="text-base font-semibold text-zinc-900 mb-2 line-clamp-2">
        {event.title}
      </h3>

      <p className="text-2xl font-bold text-zinc-900 mb-4">
        {formatMXN(event.prize_amount)}
      </p>

      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(event.deadline_submission)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {event.max_winners} ganador{event.max_winners > 1 ? 'es' : ''}
        </span>
      </div>
    </Card>
  );
}
