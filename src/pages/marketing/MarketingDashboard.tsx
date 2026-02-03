import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Megaphone, 
  Users, 
  Mail, 
  Send, 
  Eye, 
  MousePointer,
  UserMinus,
  Plus,
} from 'lucide-react';
import { campaigns, guests } from '@/data/mockData';
import type { Campaign } from '@/types';

const statusColors: Record<Campaign['status'], string> = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-info text-info-foreground',
  active: 'bg-success text-success-foreground',
  completed: 'bg-primary text-primary-foreground',
  paused: 'bg-warning text-warning-foreground',
};

export default function MarketingDashboard() {
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'scheduled');
  const consentedGuests = guests.filter(g => g.consentStatus.marketing);
  const totalGuests = guests.length;
  const consentRate = Math.round((consentedGuests.length / totalGuests) * 100);

  return (
    <MainLayout 
      title="Campaigns" 
      breadcrumbs={[{ label: 'Campaigns' }]}
    >
      {/* Stats Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">running or scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reachable Guests
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentedGuests.length}</div>
            <p className="text-xs text-muted-foreground">with marketing consent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Consent Rate
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consentRate}%</div>
            <Progress value={consentRate} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Open Rate
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37%</div>
            <p className="text-xs text-success">+5% vs. industry avg</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Management</CardTitle>
              <CardDescription>
                Create and manage guest communication campaigns
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{campaign.name}</span>
            <Badge className={statusColors[campaign.status]}>
              {campaign.status}
            </Badge>
            <Badge variant="outline">{campaign.type}</Badge>
          </div>

          {/* Segment Info */}
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {campaign.segmentCriteria.sentiments && (
              <span>Sentiments: {campaign.segmentCriteria.sentiments.join(', ')}</span>
            )}
            {campaign.segmentCriteria.minNps !== undefined && (
              <span>• NPS ≥ {campaign.segmentCriteria.minNps}</span>
            )}
            {campaign.segmentCriteria.stayRecency && (
              <span>• Stay: {campaign.segmentCriteria.stayRecency}</span>
            )}
          </div>

          {/* Metrics for active/completed campaigns */}
          {campaign.metrics && (
            <div className="mt-3 flex flex-wrap gap-4">
              <MetricItem icon={Send} label="Sent" value={campaign.metrics.sent} />
              <MetricItem icon={Mail} label="Delivered" value={campaign.metrics.delivered} />
              <MetricItem icon={Eye} label="Opened" value={campaign.metrics.opened} />
              <MetricItem icon={MousePointer} label="Clicked" value={campaign.metrics.clicked} />
              <MetricItem icon={UserMinus} label="Unsubscribed" value={campaign.metrics.unsubscribed} />
            </div>
          )}

          {/* Schedule info */}
          {campaign.scheduledAt && (
            <p className="mt-2 text-sm text-muted-foreground">
              Scheduled: {new Date(campaign.scheduledAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline">Edit</Button>
          {campaign.status === 'draft' && (
            <Button size="sm">Schedule</Button>
          )}
          {campaign.status === 'active' && (
            <Button size="sm" variant="secondary">Pause</Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface MetricItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}

function MetricItem({ icon: Icon, label, value }: MetricItemProps) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
