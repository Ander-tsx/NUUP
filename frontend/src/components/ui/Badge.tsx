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
  active: 'bg-[rgba(129,218,71,0.10)] text-[#3a6b16]',
  completed: 'bg-[rgba(129,218,71,0.10)] text-[#3a6b16]',
  pending: 'bg-zinc-100 text-zinc-500',
  draft: 'bg-zinc-100 text-zinc-500',
  in_progress: 'bg-blue-50 text-blue-700',
  review: 'bg-amber-50 text-amber-700',
  correction: 'bg-purple-50 text-purple-700',
  rejected: 'bg-red-50 text-red-600',
  disputed: 'bg-orange-50 text-orange-700',
  cancelled: 'bg-zinc-100 text-zinc-400',
  selecting: 'bg-amber-50 text-amber-700',
};

const variantLabels: Record<BadgeVariant, string> = {
  active: 'Activo',
  completed: 'Completado',
  pending: 'Pendiente',
  draft: 'Borrador',
  in_progress: 'En progreso',
  review: 'En revisión',
  correction: 'Corrección',
  rejected: 'Rechazado',
  disputed: 'En disputa',
  cancelled: 'Cancelado',
  selecting: 'Seleccionando',
};

export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-md text-xs font-medium inline-block',
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
    active: 'active',
    completed: 'completed',
    pending: 'pending',
    proposed: 'pending',
    draft: 'draft',
    in_progress: 'in_progress',
    review: 'review',
    correction: 'correction',
    rejected: 'rejected',
    disputed: 'disputed',
    cancelled: 'cancelled',
    selecting: 'selecting',
  };
  return map[status] || 'pending';
}
