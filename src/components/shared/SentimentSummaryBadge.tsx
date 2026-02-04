import { cn } from '@/lib/utils';
import { AlertCircle, TrendingUp, Minus, TrendingDown, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { SentimentSummary } from '@/lib/pseudonymisation';

interface SentimentSummaryBadgeProps {
  summary: SentimentSummary;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function SentimentSummaryBadge({ 
  summary, 
  size = 'md',
  showTooltip = true 
}: SentimentSummaryBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  // Not enough data state
  if (!summary.hasEnoughData) {
    const badge = (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-muted border-2 border-dashed border-muted-foreground/30',
          sizeClasses[size]
        )}
        aria-label="Not enough data for sentiment analysis"
      >
        <HelpCircle className={cn(iconSizes[size], 'text-muted-foreground')} />
      </div>
    );

    if (!showTooltip) return badge;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px]">
            <p className="font-medium">Not enough data</p>
            <p className="text-xs text-muted-foreground mt-1">
              {summary.feedbackCount === 0 
                ? 'No feedback received yet'
                : `Only ${summary.feedbackCount} feedback point(s) available`
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Has enough data - show sentiment
  const sentimentConfig = {
    positive: {
      bg: 'bg-success/15',
      border: 'border-success/30',
      text: 'text-success',
      icon: TrendingUp,
      label: 'Positive sentiment',
    },
    neutral: {
      bg: 'bg-warning/15',
      border: 'border-warning/30',
      text: 'text-warning',
      icon: Minus,
      label: 'Neutral sentiment',
    },
    negative: {
      bg: 'bg-destructive/15',
      border: 'border-destructive/30',
      text: 'text-destructive',
      icon: TrendingDown,
      label: 'Negative sentiment',
    },
  };

  const config = sentimentConfig[summary.sentiment || 'neutral'];
  const Icon = config.icon;

  const badge = (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border',
        config.bg,
        config.border,
        sizeClasses[size]
      )}
      aria-label={config.label}
    >
      <Icon className={cn(iconSizes[size], config.text)} />
    </div>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[220px]">
          <p className="font-medium">{config.label}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {summary.feedbackCount} feedback point(s)
            {summary.lastFeedbackDate && (
              <span className="block mt-0.5">
                Last: {new Date(summary.lastFeedbackDate).toLocaleDateString()}
              </span>
            )}
          </p>
          {summary.npsCategory && (
            <p className="text-xs mt-1">
              NPS: <span className="capitalize font-medium">{summary.npsCategory}</span>
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
