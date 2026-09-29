import { cn } from '@/lib/utils';

interface NpsScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getNpsCategory(score: number): { label: string; className: string } {
  if (score >= 9) {
    return { label: 'Promoter', className: 'bg-emerald-700 dark:bg-emerald-600 text-white font-bold shadow-2xs' };
  } else if (score >= 7) {
    return { label: 'Passive', className: 'bg-amber-600 text-white font-bold shadow-2xs' };
  } else {
    return { label: 'Detractor', className: 'bg-rose-700 dark:bg-rose-600 text-white font-bold shadow-2xs' };
  }
}

const sizeClasses = {
  sm: 'h-5 w-5 text-xs',
  md: 'h-6 w-6 text-xs',
  lg: 'h-8 w-8 text-sm',
};

export function NpsScoreBadge({ score, showLabel = false, size = 'md', className }: NpsScoreBadgeProps) {
  const category = getNpsCategory(score);

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full leading-none',
          sizeClasses[size],
          category.className
        )}
      >
        {score}
      </span>
      {showLabel && (
        <span className="text-xs font-semibold text-foreground">{category.label}</span>
      )}
    </div>
  );
}
