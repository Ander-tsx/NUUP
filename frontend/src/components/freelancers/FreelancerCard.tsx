'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import ReputationBar from '@/components/ui/ReputationBar';
import type { SearchFreelancer } from '@/types';

interface FreelancerCardProps {
  freelancer: SearchFreelancer;
}

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const router = useRouter();
  const username = freelancer.user_id?.username || 'Freelancer';
  const userId = freelancer.user_id?._id || freelancer._id;

  return (
    <Card clickable onClick={() => router.push(`/freelancers/${userId}`)}>
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={username} size="lg" />
        <div>
          <h3 className="text-base font-semibold text-zinc-900">{username}</h3>
          {freelancer.title && (
            <p className="text-xs text-zinc-500">{freelancer.title}</p>
          )}
          {freelancer.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {freelancer.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded text-[10px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <ReputationBar label="Reputación total" score={freelancer.reputation_score || 0} />
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
          <span>{freelancer.completed_projects || 0} proyectos</span>
          {freelancer.rating > 0 && (
            <span>★ {freelancer.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
