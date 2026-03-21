'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import ReputationBar from '@/components/ui/ReputationBar';

interface FreelancerCardData {
  _id: string;
  username: string;
  title: string;
  reputations: { category: string; score: number }[];
}

interface FreelancerCardProps {
  freelancer: FreelancerCardData;
}

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const router = useRouter();

  return (
    <Card clickable onClick={() => router.push(`/freelancers/${freelancer._id}`)}>
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={freelancer.username} size="lg" />
        <div>
          <h3 className="text-base font-semibold text-zinc-900">{freelancer.username}</h3>
          <p className="text-xs text-zinc-500">{freelancer.title}</p>
        </div>
      </div>
      <div className="space-y-3">
        {freelancer.reputations.map((rep) => (
          <ReputationBar key={rep.category} label={rep.category} score={rep.score} />
        ))}
      </div>
    </Card>
  );
}
