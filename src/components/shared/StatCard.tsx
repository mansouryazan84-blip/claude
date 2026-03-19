import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info';

const toneStyles: Record<Tone, { icon: string; value: string; bg: string }> = {
  default:  { icon: 'text-muted-foreground', value: 'text-foreground',  bg: 'bg-muted/50' },
  success:  { icon: 'text-emerald-600',      value: 'text-emerald-700', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
  warning:  { icon: 'text-amber-600',        value: 'text-amber-700',   bg: 'bg-amber-50 dark:bg-amber-950/50' },
  danger:   { icon: 'text-rose-600',         value: 'text-rose-700',    bg: 'bg-rose-50 dark:bg-rose-950/50' },
  info:     { icon: 'text-blue-600',         value: 'text-blue-700',    bg: 'bg-blue-50 dark:bg-blue-950/50' },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; direction?: 'up' | 'down' | 'flat' };
  tone?: Tone;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, tone = 'default', className }: StatCardProps) {
  const styles = toneStyles[tone];

  const TrendIcon =
    trend?.direction === 'up' ? TrendingUp :
    trend?.direction === 'down' ? TrendingDown :
    Minus;

  return (
    <Card className={cn('glass-card hover:shadow-md transition-all duration-200', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">{title}</p>
            <p className={cn('text-2xl font-bold mt-1 tabular-nums', styles.value)}>
              {value}
            </p>
          </div>
          <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', styles.bg)}>
            <Icon className={cn('h-5 w-5', styles.icon)} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/50">
            <TrendIcon className={cn(
              'h-3.5 w-3.5',
              trend.direction === 'up' ? 'text-emerald-500' :
              trend.direction === 'down' ? 'text-rose-500' :
              'text-muted-foreground'
            )} />
            <span className="text-xs text-muted-foreground">{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
