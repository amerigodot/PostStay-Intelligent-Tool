import { cn } from '@/lib/utils';

interface NpsScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getNpsCategory(score: number): { label: string; className: string } {
  if (score >= 9) {
    return { label: 'Promoter', className: 'bg-sentiment-positive text-white' };
  } else if (score >= 7) {
    return { label: 'Passive', className: 'bg-sentiment-neutral text-black' };
  } else {
    return { label: 'Detractor', className: 'bg-sentiment-negative text-white' };
  }
}

const sizeClasses = {
  sm: 'h-5 w-5 text-xs',
  md: 'h-6 w-6 text-sm',
  lg: 'h-8 w-8 text-base',
};

export function NpsScoreBadge({ score, showLabel = false, size = 'md', className }: NpsScoreBadgeProps) {
  const category = getNpsCategory(score);

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full font-semibold',
          sizeClasses[size],
          category.className
        )}
      >
        {score}
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground">{category.label}</span>
      )}
    </div>
  );
}
