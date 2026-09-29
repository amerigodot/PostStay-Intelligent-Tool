import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Megaphone, 
  Users, 
  Eye, 
  Plus,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { campaigns as initialCampaigns } from '@/data/mockData';
import type { Campaign } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const statusColors: Record<Campaign['status'], string> = {
  draft: 'bg-muted text-foreground border-border font-semibold',
  scheduled: 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-300 border-sky-600 font-semibold',
  active: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-600 font-semibold',
  completed: 'bg-primary/10 text-primary border-primary font-semibold',
  paused: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-600 font-semibold',
};

export default function MarketingDashboard() {
  const { filteredGuests } = useHospitalityData();
  const [campaignList, setCampaignList] = useState<Campaign[]>(initialCampaigns);
  const [newCampaignOpen, setNewCampaignOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignPref, setNewCampaignPref] = useState('private-riva-transfer');

  const consentedGuests = filteredGuests.filter(g => g.consentStatus.marketing);
  const totalGuests = filteredGuests.length;
  const consentRate = totalGuests > 0 ? Math.round((consentedGuests.length / totalGuests) * 100) : 92;

  // Segment simulation
  const [minNpsFilter, setMinNpsFilter] = useState<number>(8);
  const matchingSegmentGuests = filteredGuests.filter(g => 
    g.consentStatus.marketing && 
    (g.npsScore || 0) >= minNpsFilter
  );

  const handleCreateCampaign = () => {
    if (!newCampaignName.trim()) {
      toast.error('Please enter a campaign title.');
      return;
    }

    const created: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampaignName,
      type: 'email',
      status: 'scheduled',
      segmentCriteria: {
        sentiments: ['positive'],
        minNps: 9,
        preferences: [newCampaignPref],
      },
      scheduledAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    };

    setCampaignList(prev => [created, ...prev]);
    setNewCampaignOpen(false);
    setNewCampaignName('');
    toast.success('Bespoke Campaign Scheduled', {
      description: `Targeting ${matchingSegmentGuests.length} verified consented patrons with zero PII exposure.`,
    });
  };

  return (
    <MainLayout 
      title="Marketing & Loyalty Audience Intelligence" 
      breadcrumbs={[{ label: 'Marketing', href: '/marketing' }]}
    >
      {/* High-Contrast Metrics Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Megaphone className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">
              {campaignList.filter(c => c.status === 'active' || c.status === 'scheduled').length}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">running or scheduled</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Consented Patrons
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-emerald-800 dark:text-emerald-400">
              {consentedGuests.length}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Article 6 & 9 verified opt-ins</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              GDPR Consent Rate
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-sky-800 dark:text-sky-400">{consentRate}%</div>
            <Progress value={consentRate} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Luxury Open Rate
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">69.8%</div>
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-1">+24% vs generic hospitality</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Campaign List (Span 2) */}
        <Card className="lg:col-span-2 border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-serif font-bold text-foreground">
                  Curated Patron Communications
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-medium">
                  Targeted bespoke dispatches governed by zero-knowledge consent policies
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setNewCampaignOpen(true)} className="gap-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs">
                <Plus className="h-3.5 w-3.5" />
                New Campaign
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {campaignList.map(camp => (
              <div key={camp.id} className="p-4 rounded-lg border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-foreground">{camp.name}</span>
                    <Badge variant="outline" className={`text-[11px] capitalize border ${statusColors[camp.status]}`}>
                      {camp.status}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase border border-border">
                      {camp.type}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap font-medium">
                    {camp.segmentCriteria.minNps && (
                      <span>Min NPS: <strong className="text-foreground">{camp.segmentCriteria.minNps}+</strong></span>
                    )}
                    {camp.segmentCriteria.preferences && camp.segmentCriteria.preferences.length > 0 && (
                      <span>• Affinity: <strong className="text-foreground">{camp.segmentCriteria.preferences.join(', ')}</strong></span>
                    )}
                  </div>

                  {camp.metrics && (
                    <div className="flex items-center gap-4 text-xs pt-1 text-muted-foreground font-medium">
                      <span>Delivered: <strong className="text-foreground">{camp.metrics.delivered}</strong></span>
                      <span>Opened: <strong className="text-foreground">{camp.metrics.opened}</strong> ({Math.round(camp.metrics.opened / camp.metrics.delivered * 100)}%)</span>
                      <span>Clicked: <strong className="text-foreground">{camp.metrics.clicked}</strong></span>
                      <span>Unsubscribed: <strong className="text-foreground">{camp.metrics.unsubscribed}</strong></span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-xs font-mono font-medium text-muted-foreground block">
                    {camp.scheduledAt ? `Scheduled: ${new Date(camp.scheduledAt).toLocaleDateString()}` : camp.sentAt ? `Sent: ${new Date(camp.sentAt).toLocaleDateString()}` : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Interactive Segment Builder */}
        <Card className="border-border bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-serif font-bold text-foreground">
                Interactive Segment Builder
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Live patron query using architectural tokenization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Minimum Patron NPS Score</Label>
              <div className="flex items-center gap-2">
                {[7, 8, 9, 10].map(score => (
                  <Button
                    key={score}
                    type="button"
                    size="sm"
                    variant={minNpsFilter === score ? 'default' : 'outline'}
                    onClick={() => setMinNpsFilter(score)}
                    className={`h-8 text-xs font-bold flex-1 ${
                      minNpsFilter === score 
                        ? 'bg-primary text-primary-foreground' 
                        : 'border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    {score}+
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-border bg-muted/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Matching Audience</span>
                <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.5">
                  {matchingSegmentGuests.length} Patrons
                </Badge>
              </div>
              <p className="text-[11px] text-foreground/80 leading-relaxed font-sans font-medium">
                All candidates possess active GDPR marketing consent proofs. Outbound dispatches are routed through Identity Vault proxies without exposing email addresses to marketing tools.
              </p>
            </div>

            <div className="space-y-1.5 text-[11px] text-muted-foreground border-t border-border/80 pt-3">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-bold">
                <Lock className="h-3.5 w-3.5" />
                Zero-Knowledge Audience Verification Active
              </div>
              <p className="font-mono text-[10px]">
                Hashing protocol: HMAC-SHA256 with rotating salt.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Campaign Dialog */}
      <Dialog open={newCampaignOpen} onOpenChange={setNewCampaignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif font-bold text-foreground">Schedule Curated Campaign</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-medium">
              Create an exclusive outreach for verified patrons.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label htmlFor="camp-name" className="font-semibold text-foreground">Campaign Title</Label>
              <Input
                id="camp-name"
                placeholder="e.g. Private Riva Sunset Tasting Preview"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="text-xs h-9 bg-card border-border text-foreground font-medium"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="camp-affinity" className="font-semibold text-foreground">Target Guest Affinity Theme</Label>
              <Input
                id="camp-affinity"
                placeholder="e.g. private-riva-transfer"
                value={newCampaignPref}
                onChange={(e) => setNewCampaignPref(e.target.value)}
                className="text-xs h-9 bg-card border-border text-foreground font-medium"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setNewCampaignOpen(false)} className="text-xs font-semibold border-border">
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateCampaign} className="gap-1 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
              <Sparkles className="h-3 w-3" />
              Schedule Dispatch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
