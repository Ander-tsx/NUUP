'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge, { getStatusVariant } from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { formatMXN } from '@/lib/utils';
import type { Project, User as UserType } from '@/types';

interface ProjectCardProps {
  project: Project;
  currentUserId: string;
}

export default function ProjectCard({ project, currentUserId }: ProjectCardProps) {
  const router = useRouter();

  const otherParty = typeof project.recruiter_id === 'object'
    ? (project.recruiter_id as UserType)._id === currentUserId
      ? typeof project.freelancer_id === 'object'
        ? (project.freelancer_id as UserType).username
        : 'Freelancer'
      : typeof project.recruiter_id === 'object'
        ? (project.recruiter_id as UserType).username
        : 'Reclutador'
    : 'Usuario';

  return (
    <Card clickable onClick={() => router.push(`/projects/${project._id}`)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Avatar name={otherParty} size="sm" />
          <span className="text-xs text-zinc-400">{otherParty}</span>
        </div>
        <Badge variant={getStatusVariant(project.status)}>{undefined}</Badge>
      </div>
      <h3 className="text-base font-semibold text-zinc-900 mb-1">{project.title}</h3>
      <p className="text-2xl font-bold text-zinc-900">{formatMXN(project.amount)}</p>
    </Card>
  );
}
