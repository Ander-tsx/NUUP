import React from 'react';

interface ReputationBarProps {
  label: string;
  score: number;
  maxScore?: number;
}

export default function ReputationBar({ label, score, maxScore = 200 }: ReputationBarProps) {
  const pct = Math.min((score / maxScore) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-sm font-semibold text-zinc-900">{score} pts</span>
      </div>
      <div className="h-1 bg-zinc-100 rounded-full">
        <div
          className="h-full bg-[#81DA47] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
