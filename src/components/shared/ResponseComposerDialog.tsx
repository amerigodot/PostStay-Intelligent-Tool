import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Languages, 
  AlertCircle,
  Quote,
} from 'lucide-react';
import type { Feedback, FeedbackAiDrafts } from '@/types';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { SentimentBadge } from './SentimentBadge';

interface ResponseComposerDialogProps {
  feedback: Feedback | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ToneKey = keyof FeedbackAiDrafts;

const toneLabels: Record<ToneKey, { title: string; desc: string }> = {
  diplomatic: { title: 'Diplomatic Haute Luxury', desc: 'Aristocratic, deferential & elegant language' },
  warm: { title: 'Warm Personalized Concierge', desc: 'Heartfelt, gracious & familiar tone' },
  recovery: { title: 'Executive Service Recovery', desc: 'Decisive restitution & corrective accountability' },
  concise: { title: 'Executive Brevity', desc: 'Crisp, respectful & clear' },
};

export function ResponseComposerDialog({ feedback, open, onOpenChange }: ResponseComposerDialogProps) {
  const { respondToFeedback, properties, guests } = useHospitalityData();
  const [selectedTone, setSelectedTone] = useState<ToneKey>('diplomatic');
  const [draftContent, setDraftContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const guest = feedback ? guests.find(g => g.id === feedback.guestId) : null;
  const property = feedback ? properties.find(p => p.id === feedback.propertyId) : null;

  useEffect(() => {
    if (!feedback) return;

    // Default tone recommendation based on sentiment and urgency
    let recommendedTone: ToneKey = 'diplomatic';
    if (feedback.urgency === 'critical' || feedback.sentiment === 'negative') {
      recommendedTone = 'recovery';
    } else if (feedback.sentiment === 'positive') {
      recommendedTone = 'warm';
    }
    setSelectedTone(recommendedTone);

    const defaultDraft = feedback.aiDrafts 
      ? feedback.aiDrafts[recommendedTone]
      : (feedback.responseText || `Dear ${guest?.title ? guest.title + ' ' : ''}${guest?.firstName || 'Guest'}, thank you sincerely for your feedback regarding your stay at ${property?.name}.`);

    setDraftContent(defaultDraft);
  }, [feedback, guest, property]);

  const handleToneChange = (tone: ToneKey) => {
    setSelectedTone(tone);
    if (feedback?.aiDrafts && feedback.aiDrafts[tone]) {
      setDraftContent(feedback.aiDrafts[tone]);
    }
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (feedback?.aiDrafts) {
        setDraftContent(feedback.aiDrafts[selectedTone]);
      }
      setIsGenerating(false);
    }, 400);
  };

  const handleDispatch = () => {
    if (!feedback) return;
    respondToFeedback(feedback.id, draftContent, toneLabels[selectedTone].title);
    onOpenChange(false);
  };

  if (!feedback) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl font-serif">
                AI Hospitality Response Co-Pilot
              </DialogTitle>
            </div>
            <Badge variant="outline" className="border-emerald-600/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 gap-1 text-xs">
              <ShieldCheck className="h-3 w-3" />
              Zero-PII Tokenized AI
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Human-in-the-loop review orchestration. AI generated draft aligned with {property?.name || 'hotel'} brand guidelines.
          </DialogDescription>
        </DialogHeader>

        {/* Guest Feedback Snippet */}
        <div className="rounded-lg border bg-muted/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {guest?.title ? `${guest.title} ` : ''}{guest?.firstName} {guest?.lastInitial}.
              </span>
              <span className="text-muted-foreground font-mono">({guest?.pseudonymizedKey})</span>
              <span className="text-muted-foreground">•</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Building2 className="h-3 w-3" />
                {property?.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <SentimentBadge sentiment={feedback.sentiment} showLabel />
              <Badge variant="secondary" className="text-[11px] uppercase">
                {feedback.language}
              </Badge>
            </div>
          </div>

          <div className="relative pl-6 italic text-sm text-foreground/90 border-l-2 border-primary/40 my-1 py-0.5">
            <Quote className="h-3.5 w-3.5 text-primary/60 absolute left-1 top-1" />
            "{feedback.fullText || feedback.summary}"
          </div>

          <div className="flex flex-wrap items-center gap-1 pt-1">
            <span className="text-[11px] text-muted-foreground mr-1">Extracted Vectors:</span>
            {feedback.themes.map(t => (
              <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                {t.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tone Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Select Response Narrative & Tone
          </Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(toneLabels) as ToneKey[]).map(key => {
              const info = toneLabels[key];
              const isSelected = selectedTone === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleToneChange(key)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/10 text-primary font-medium ring-1 ring-primary' 
                      : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <div className="text-xs font-medium leading-tight">{info.title}</div>
                  <div className="text-[10px] opacity-80 mt-1 line-clamp-1">{info.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editable Draft Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="response-text" className="text-xs font-medium">
              Review & Customize Response (Dispatch in {feedback.language.toUpperCase()})
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRegenerate} 
              disabled={isGenerating}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>

          <Textarea
            id="response-text"
            rows={5}
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            className="text-sm font-sans leading-relaxed resize-none focus-visible:ring-primary"
            placeholder="Type your response..."
          />

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Languages className="h-3 w-3" />
              Language auto-aligned to guest locale ({feedback.language.toUpperCase()})
            </span>
            <span>{draftContent.length} characters</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t pt-3">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Ready for PMS outbox & encrypted vault dispatch</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleDispatch} className="gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Approve & Dispatch
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
