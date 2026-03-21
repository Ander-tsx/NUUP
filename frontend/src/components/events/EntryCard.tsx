'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { EventSubmission } from '@/types';

interface EntryCardProps {
  submission: EventSubmission;
  username: string;
  onSelectWinner?: (submissionId: string) => void;
  isOwner: boolean;
}

export default function EntryCard({ submission, username, onSelectWinner, isOwner }: EntryCardProps) {
  return (
    <Card className="flex items-start gap-4">
      <Avatar name={username} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-zinc-900">{username}</h4>
          {submission.is_winner && <Badge variant="completed">Ganador</Badge>}
        </div>
        <p className="text-xs text-zinc-500 mb-2">{submission.description || 'Sin descripción'}</p>
        <div className="flex items-center gap-3">
          <a
            href={submission.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-900 underline hover:no-underline"
          >
            Ver entrega
          </a>
          <span className="text-xs text-zinc-400">
            {formatDate(submission.submitted_at)}
          </span>
        </div>
        {isOwner && !submission.is_winner && onSelectWinner && (
          <button
            onClick={() => onSelectWinner(submission._id)}
            className="mt-2 px-3 py-1 text-xs font-medium bg-zinc-900 text-white rounded-lg hover:bg-[#81DA47] hover:text-zinc-900 transition-all duration-150"
          >
            Seleccionar ganador
          </button>
        )}
      </div>
    </Card>
  );
}
