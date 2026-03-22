'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import ReputationBar from '@/components/ui/ReputationBar';
import { Star, Award } from 'lucide-react';
import type { SearchFreelancer } from '@/types';

interface FreelancerCardProps {
  freelancer: SearchFreelancer;
}

// Level-to-color mapping
const levelColors: Record<string, string> = {
  bronze: '#cd7f32',
  silver: '#a8a9ad',
  gold: '#fbbf24',
  platinum: '#60b8f0',
  diamond: '#a78bfa',
};

const levelLabel: Record<string, string> = {
  bronze: 'Bronce',
  silver: 'Plata',
  gold: 'Oro',
  platinum: 'Platino',
  diamond: 'Diamante',
};

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const router = useRouter();
  const username = freelancer.user_id?.username || 'Freelancer';
  const userId = freelancer.user_id?._id || freelancer._id;
  const repByCategory = (freelancer.reputation_by_category || []).filter((r) => r.category && r.score > 0);

  return (
    <div
      onClick={() => router.push(`/freelancers/${userId}`)}
      className="card card-clickable p-5 relative overflow-hidden group cursor-pointer"
      style={{ background: 'var(--surface)' }}
    >
      {/* Top gradient bar on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, #2185D5, #818cf8)' }}
      />

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar name={username} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{username}</h3>
          {freelancer.title && (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-2)' }}>{freelancer.title}</p>
          )}
          {freelancer.user_id?.bio && (
            <p className="text-[10.5px] mt-1 line-clamp-2" style={{ color: 'var(--text-3)' }}>
              {freelancer.user_id.bio}
            </p>
          )}
          {freelancer.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {freelancer.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: 'rgba(33,133,213,0.10)', color: '#60b8f0', border: '1px solid rgba(33,133,213,0.15)' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overall Reputation */}
      <div className="space-y-3">
        <ReputationBar label="Reputación total" score={freelancer.reputation_score || 0} />

        {/* Per-category reputation */}
        {repByCategory.length > 0 && (
          <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-[9.5px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>
              Por categoría
            </p>
            {repByCategory.slice(0, 3).map((rep, i) => {
              const cat = rep.category!;
              const lvl = (rep.level || 'bronze').toLowerCase();
              const color = levelColors[lvl] || '#818cf8';
              const maxScore = 200;
              const pct = Math.min(100, (rep.score / maxScore) * 100);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10.5px]" style={{ color: 'var(--text-2)' }}>{cat.name}</span>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" style={{ color }} />
                      <span className="text-[10px] font-semibold" style={{ color }}>
                        {levelLabel[lvl] || rep.level} · {rep.score}
                      </span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: 'var(--border)' }}>
                    <div
                      className="h-1 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between text-xs pt-1" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-3)' }}>
          <span>{freelancer.completed_projects || 0} proyectos</span>
          {(freelancer.rating || 0) > 0 && (
            <span className="flex items-center gap-1 text-[#fbbf24]">
              <Star className="w-3 h-3" /> {freelancer.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
