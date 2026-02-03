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
    className: 'bg-sentiment-positive text-white',
  },
  neutral: {
    label: 'Neutral',
    className: 'bg-sentiment-neutral text-black',
  },
  negative: {
    label: 'Negative',
    className: 'bg-sentiment-negative text-white',
  },
};

const sizeClasses = {
  sm: 'h-2 w-2',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
};

export function SentimentBadge({ sentiment, showLabel = false, size = 'md', className }: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment];

  if (showLabel) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
          config.className,
          className
        )}
      >
        <span className={cn('rounded-full bg-current opacity-80', sizeClasses[size])} />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-block rounded-full',
        sizeClasses[size],
        config.className,
        className
      )}
      title={config.label}
    />
  );
}
