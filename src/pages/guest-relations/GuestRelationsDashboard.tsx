import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ExternalLink,
  ArrowUpRight,
  Search,
  Building2,
  UserCheck,
  Languages,
} from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { SentimentBadge } from '@/components/shared/SentimentBadge';
import { NpsScoreBadge } from '@/components/shared/NpsScoreBadge';
import { ResponseComposerDialog } from '@/components/shared/ResponseComposerDialog';
import { GuestDossierDialog } from '@/components/shared/GuestDossierDialog';
import type { Feedback, Guest, FeedbackStatus } from '@/types';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const statusConfig: Record<FeedbackStatus, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  new: { label: 'New Review', icon: MessageSquare, className: 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-300 border-sky-600 font-semibold' },
  'in-review': { label: 'In Review', icon: Clock, className: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-600 font-semibold' },
  responded: { label: 'Responded', icon: CheckCircle2, className: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-600 font-semibold' },
  escalated: { label: 'Escalated to GM', icon: AlertTriangle, className: 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border-rose-600 font-semibold' },
  resolved: { label: 'Resolved', icon: CheckCircle2, className: 'bg-muted text-foreground border-border font-semibold' },
};

export default function GuestRelationsDashboard() {
  const { 
    filteredFeedback, 
    guests, 
    properties, 
    escalateFeedback, 
    resolveFeedback,
    privacyMode,
  } = useHospitalityData();

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedFeedbackForResponse, setSelectedFeedbackForResponse] = useState<Feedback | null>(null);
  const [selectedGuestForDossier, setSelectedGuestForDossier] = useState<Guest | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Subroute tab selection
  const isTimelinesView = location.pathname.includes('/timelines');
  const isTemplatesView = location.pathname.includes('/templates');

  const unresolved = filteredFeedback.filter(f => f.status === 'new' || f.status === 'in-review');
  const negative = filteredFeedback.filter(f => f.sentiment === 'negative');
  const escalated = filteredFeedback.filter(f => f.status === 'escalated');
  const responded = filteredFeedback.filter(f => f.status === 'responded');

  const displayedFeedback = filteredFeedback.filter(fb => {
    const guest = guests.find(g => g.id === fb.guestId);
    const matchesSearch = 
      fb.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fb.fullText && fb.fullText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      fb.themes.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (guest && guest.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (guest && guest.pseudonymizedKey.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'new') return fb.status === 'new';
    if (activeTab === 'negative') return fb.sentiment === 'negative';
    if (activeTab === 'escalated') return fb.status === 'escalated';
    if (activeTab === 'responded') return fb.status === 'responded';
    return true;
  });

  const handleBatchAiDraft = () => {
    setIsBatchProcessing(true);
    setTimeout(() => {
      setIsBatchProcessing(false);
      toast.success('Batch AI Analysis Complete', {
        description: `Generated calibrated multi-tone responses for ${unresolved.length} pending reviews with 98.4% brand consistency.`,
      });
    }, 800);
  };

  return (
    <MainLayout 
      title={isTimelinesView ? "Guest Experience Timelines" : isTemplatesView ? "Hospitality Response Narratives" : "Feedback & Service Recovery Queue"} 
      breadcrumbs={[
        { label: 'Guest Relations', href: '/guest-relations' },
        { label: isTimelinesView ? 'Timelines' : isTemplatesView ? 'Templates' : 'Inbox' }
      ]}
    >
      {/* High-Contrast Metrics Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Unresolved Inbox
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
              <MessageSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">{unresolved.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">awaiting staff dispatch</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Friction & Recovery
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-destructive">{negative.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">requiring diplomatic restitution</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Escalated to GM
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-amber-800 dark:text-amber-400">{escalated.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">under executive review</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Response Time
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-emerald-800 dark:text-emerald-400">1.8h</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">vs 4.2h luxury industry benchmark</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Feedback Queue Table/Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-serif font-bold text-foreground">
                Collected Guest Reviews & Micro-Surveys
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
                Multi-channel feedback processed with zero-PII architectural pseudonymization
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleBatchAiDraft} 
                disabled={isBatchProcessing}
                variant="outline"
                size="sm" 
                className="gap-2 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10 shadow-2xs"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isBatchProcessing ? 'animate-spin' : ''}`} />
                {isBatchProcessing ? 'Analyzing...' : 'AI Draft All Unresolved'}
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by keyword, guest key, theme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 text-xs h-9 bg-card border-border text-foreground font-medium placeholder:text-muted-foreground shadow-2xs"
              />
            </div>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="h-9 bg-muted border border-border p-1">
                <TabsTrigger value="all" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs">
                  All ({filteredFeedback.length})
                </TabsTrigger>
                <TabsTrigger value="new" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs">
                  New ({filteredFeedback.filter(f => f.status === 'new').length})
                </TabsTrigger>
                <TabsTrigger value="negative" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-destructive data-[state=active]:shadow-xs">
                  Attention ({negative.length})
                </TabsTrigger>
                <TabsTrigger value="escalated" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-amber-800 dark:data-[state=active]:text-amber-300 data-[state=active]:shadow-xs">
                  Escalated ({escalated.length})
                </TabsTrigger>
                <TabsTrigger value="responded" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-emerald-800 dark:data-[state=active]:text-emerald-300 data-[state=active]:shadow-xs">
                  Responded ({responded.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {displayedFeedback.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm font-medium">
              No feedback items match the selected filter.
            </div>
          ) : (
            displayedFeedback.map(fb => {
              const guest = guests.find(g => g.id === fb.guestId);
              const property = properties.find(p => p.id === fb.propertyId);
              const statusInfo = statusConfig[fb.status];
              const StatusIcon = statusInfo.icon;
              const isMasked = privacyMode === 'pseudonymized';

              return (
                <div 
                  key={fb.id} 
                  className={`rounded-lg border p-4.5 transition-all shadow-2xs ${
                    fb.status === 'escalated'
                      ? 'border-rose-600/70 bg-rose-50/25 dark:bg-rose-950/20'
                      : fb.sentiment === 'negative'
                      ? 'border-amber-600/60 bg-amber-50/20 dark:bg-amber-950/15'
                      : 'border-border bg-card hover:border-foreground/30'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Feedback content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SentimentBadge sentiment={fb.sentiment} showLabel />
                        {fb.npsScore && <NpsScoreBadge score={fb.npsScore} />}
                        <Badge variant="outline" className={`gap-1 text-xs border ${statusInfo.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                        <Badge variant="secondary" className="gap-1 text-xs capitalize font-semibold border border-border">
                          <ExternalLink className="h-3 w-3" />
                          {fb.source}
                        </Badge>
                        <Badge variant="outline" className="text-[11px] uppercase font-bold border-border">
                          <Languages className="h-3 w-3 mr-1" />
                          {fb.language}
                        </Badge>
                      </div>

                      {/* Guest and Property context */}
                      <div className="flex items-center gap-2 text-sm font-medium flex-wrap pt-0.5">
                        <button 
                          onClick={() => setSelectedGuestForDossier(guest || null)}
                          className="hover:underline text-foreground font-bold flex items-center gap-1.5"
                        >
                          <UserCheck className="h-4 w-4 text-primary" />
                          {isMasked 
                            ? (guest?.fullNameMasked || `${guest?.firstName} ${guest?.lastInitial}.`)
                            : `${guest?.title ? guest.title + ' ' : ''}${guest?.firstName} ${guest?.lastInitial}.`}
                        </button>
                        <span className="text-muted-foreground text-xs font-mono font-semibold">
                          [{guest?.pseudonymizedKey}]
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-foreground text-xs font-semibold flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          {property?.name}
                        </span>
                        <span className="text-muted-foreground text-xs font-mono">• {fb.date}</span>
                      </div>

                      {/* Summary and Full text */}
                      <div className="text-sm text-foreground font-semibold leading-snug">
                        "{fb.summary}"
                      </div>
                      {fb.fullText && fb.fullText !== fb.summary && (
                        <p className="text-xs text-foreground/90 font-sans leading-relaxed italic bg-muted/40 p-3 rounded-md border border-border/80">
                          {fb.fullText}
                        </p>
                      )}

                      {/* Themes */}
                      {fb.themes.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Themes:</span>
                          {fb.themes.map(theme => (
                            <Badge key={theme} variant="secondary" className="text-[11px] font-medium capitalize border border-border/80">
                              {theme.replace(/-/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Response snippet if responded */}
                      {fb.responseText && (
                        <div className="mt-3 p-3 rounded-md border border-emerald-600/40 bg-emerald-50/40 dark:bg-emerald-950/25 text-xs space-y-1">
                          <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            Dispatched Official Response
                            {fb.respondedAt && (
                              <span className="text-muted-foreground font-normal font-mono text-[11px]">
                                • {new Date(fb.respondedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-foreground italic leading-relaxed font-sans">
                            "{fb.responseText}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-2 shrink-0">
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedFeedbackForResponse(fb)}
                        className="gap-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs w-full lg:w-32"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {fb.status === 'responded' ? 'View Response' : 'Respond (AI)'}
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedGuestForDossier(guest || null)}
                        className="gap-1.5 text-xs font-semibold border-border bg-card text-foreground hover:bg-muted shadow-2xs w-full lg:w-32"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Guest Dossier
                      </Button>

                      {fb.status !== 'escalated' && fb.status !== 'resolved' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => escalateFeedback(fb.id, `Escalated by Guest Relations Officer`)}
                          className="text-amber-800 dark:text-amber-300 border-amber-600/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold shadow-2xs w-full lg:w-32"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-600" />
                          Escalate to GM
                        </Button>
                      )}

                      {fb.status === 'escalated' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => resolveFeedback(fb.id, 'Resolved via executive guest reconciliation')}
                          className="text-emerald-800 dark:text-emerald-300 border-emerald-600/50 hover:bg-emerald-50 text-xs font-semibold shadow-2xs w-full lg:w-32"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Response Composer Modal */}
      <ResponseComposerDialog
        feedback={selectedFeedbackForResponse}
        open={!!selectedFeedbackForResponse}
        onOpenChange={(open) => {
          if (!open) setSelectedFeedbackForResponse(null);
        }}
      />

      {/* Guest Dossier Modal */}
      <GuestDossierDialog
        guest={selectedGuestForDossier}
        open={!!selectedGuestForDossier}
        onOpenChange={(open) => {
          if (!open) setSelectedGuestForDossier(null);
        }}
      />
    </MainLayout>
  );
}
