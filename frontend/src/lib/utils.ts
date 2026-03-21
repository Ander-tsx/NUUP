import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isValidDate(dateString: string | undefined | null): boolean {
  if (!dateString) return false;
  const d = new Date(dateString);
  return !isNaN(d.getTime());
}

export function formatDate(dateString: string): string {
  if (!isValidDate(dateString)) return '-';
  return format(new Date(dateString), "d 'de' MMM, yyyy", { locale: es });
}

export function formatDateShort(dateString: string): string {
  if (!isValidDate(dateString)) return '-';
  return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
}

export function formatRelative(dateString: string): string {
  if (!isValidDate(dateString)) return '-';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
}

export function formatTime(dateString: string): string {
  if (!isValidDate(dateString)) return '-';
  return format(new Date(dateString), 'HH:mm', { locale: es });
}

export function truncateAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name: string): string {
  const colors = [
    '#3F3F46', '#52525B', '#71717A', '#27272A',
    '#44403C', '#57534E', '#78716C', '#292524',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
