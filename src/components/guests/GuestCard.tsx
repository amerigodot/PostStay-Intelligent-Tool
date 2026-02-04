import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { SentimentSummaryBadge } from '@/components/shared/SentimentSummaryBadge';
import { NpsScoreBadge } from '@/components/shared/NpsScoreBadge';
import { 
  createPseudonymisedProfile, 
  getDisplayName,
  hasAIConsent 
} from '@/lib/pseudonymisation';
import type { Guest, Stay } from '@/types';

interface GuestCardProps {
  guest: Guest;
  stay: Stay;
}

export function GuestCard({ guest, stay }: GuestCardProps) {
  // Create pseudonymised profile for AI-safe sentiment display
  const pseudoProfile = createPseudonymisedProfile(guest);
  const displayName = getDisplayName(guest);
  const isVip = pseudoProfile.lifetimeValueBand === 'vip';
  const canShowAIFeatures = hasAIConsent(guest);

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          {/* Sentiment uses pseudonymised data with "Not enough data" fallback */}
          <SentimentSummaryBadge 
            summary={pseudoProfile.sentimentSummary} 
            size="lg" 
          />
          {guest.npsScore !== undefined && pseudoProfile.sentimentSummary.hasEnoughData && (
            <NpsScoreBadge score={guest.npsScore} size="sm" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{displayName}</span>
            {isVip && (
              <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3" />
                VIP
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {guest.nationality}
            </Badge>
            {!canShowAIFeatures && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Limited insights
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Room {stay.roomNumber}</span>
            <span>•</span>
            <span>{stay.roomType}</span>
            <span>•</span>
            <span>{guest.totalStays} stays</span>
          </div>
          {guest.preferences.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {guest.preferences.slice(0, 3).map(pref => (
                <Badge key={pref} variant="secondary" className="text-xs">
                  {pref}
                </Badge>
              ))}
              {guest.preferences.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{guest.preferences.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          View Profile
        </Button>
        <Button size="sm">
          Actions
        </Button>
      </div>
    </div>
  );
}
