import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  | 'in_transit' | 'available' | 'maintenance' | 'critical' | 'warning' | 'info';

const variantStyles: Record<StatusVariant, string> = {
  active:      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  inactive:    'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700',
  pending:     'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
  completed:   'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  cancelled:   'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800',
  in_transit:  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
  available:   'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
  maintenance: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800',
  critical:    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800',
  warning:     'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
  info:        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
};

const dotColors: Record<StatusVariant, string> = {
  active:      'bg-emerald-500',
  inactive:    'bg-slate-400',
  pending:     'bg-amber-500',
  completed:   'bg-emerald-500',
  cancelled:   'bg-rose-500',
  in_transit:  'bg-blue-500',
  available:   'bg-emerald-500',
  maintenance: 'bg-orange-500',
  critical:    'bg-rose-500',
  warning:     'bg-amber-500',
  info:        'bg-blue-500',
};

interface StatusBadgeProps {
  variant: StatusVariant;
  label: string;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ variant, label, dot = true, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      {label}
    </span>
  );
}
