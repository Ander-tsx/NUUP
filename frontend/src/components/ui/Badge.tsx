import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'active'
  | 'completed'
  | 'pending'
  | 'in_progress'
  | 'review'
  | 'correction'
  | 'rejected'
  | 'disputed'
  | 'cancelled'
  | 'selecting'
  | 'draft';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  active:     'bg-[rgba(33,133,213,0.10)] text-[#1a6fb5] border border-[rgba(33,133,213,0.18)]',
  completed:  'bg-[rgba(33,133,213,0.10)] text-[#1a6fb5] border border-[rgba(33,133,213,0.18)]',
  pending:    'bg-zinc-100 text-zinc-500 border border-zinc-200',
  draft:      'bg-zinc-100 text-zinc-500 border border-zinc-200',
  in_progress:'bg-blue-50 text-blue-700 border border-blue-100',
  review:     'bg-amber-50 text-amber-700 border border-amber-100',
  correction: 'bg-purple-50 text-purple-700 border border-purple-100',
  rejected:   'bg-red-50 text-red-600 border border-red-100',
  disputed:   'bg-orange-50 text-orange-700 border border-orange-100',
  cancelled:  'bg-zinc-100 text-zinc-400 border border-zinc-200',
  selecting:  'bg-amber-50 text-amber-700 border border-amber-100',
};

const variantLabels: Record<BadgeVariant, string> = {
  active:     'Activo',
  completed:  'Completado',
  pending:    'Pendiente',
  draft:      'Borrador',
  in_progress:'En progreso',
  review:     'En revisión',
  correction: 'Corrección',
  rejected:   'Rechazado',
  disputed:   'En disputa',
  cancelled:  'Cancelado',
  selecting:  'Seleccionando',
};

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[11px] font-medium inline-block tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children || variantLabels[variant]}
    </span>
  );
}

export function getStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    active:      'active',
    completed:   'completed',
    pending:     'pending',
    proposed:    'pending',
    draft:       'draft',
    in_progress: 'in_progress',
    review:      'review',
    correction:  'correction',
    rejected:    'rejected',
    disputed:    'disputed',
    cancelled:   'cancelled',
    selecting:   'selecting',
  };
  return map[status] || 'pending';
}
