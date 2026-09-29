import { cn } from '@/lib/utils';
import type { SentimentScore } from '@/types';

interface SentimentBadgeProps {
  sentiment: SentimentScore;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sentimentConfig: Record<SentimentScore, { label: string; className: string }> = {
  positive: {
    label: 'Positive',
    className: 'bg-emerald-700 dark:bg-emerald-600 text-white font-semibold shadow-2xs',
  },
  neutral: {
    label: 'Neutral',
    className: 'bg-amber-600 text-white font-semibold shadow-2xs',
  },
  negative: {
    label: 'Negative',
    className: 'bg-rose-700 dark:bg-rose-600 text-white font-semibold shadow-2xs',
  },
};

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3.5 w-3.5',
};

export function SentimentBadge({ sentiment, showLabel = false, size = 'md', className }: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment];

  if (showLabel) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
          config.className,
          className
        )}
      >
        <span className={cn('rounded-full bg-white opacity-90', sizeClasses[size])} />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-block rounded-full shadow-2xs',
        sizeClasses[size],
        config.className,
        className
      )}
      title={config.label}
    />
  );
}
