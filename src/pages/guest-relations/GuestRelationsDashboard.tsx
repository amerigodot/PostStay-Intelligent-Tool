import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import { feedback, getGuestById, getPropertyById } from '@/data/mockData';
import { SentimentBadge } from '@/components/shared/SentimentBadge';
import type { FeedbackStatus } from '@/types';

const statusConfig: Record<FeedbackStatus, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  new: { label: 'New', icon: MessageSquare, className: 'bg-info text-info-foreground' },
  'in-review': { label: 'In Review', icon: Clock, className: 'bg-warning text-warning-foreground' },
  responded: { label: 'Responded', icon: CheckCircle2, className: 'bg-success text-success-foreground' },
  escalated: { label: 'Escalated', icon: AlertTriangle, className: 'bg-destructive text-destructive-foreground' },
  resolved: { label: 'Resolved', icon: CheckCircle2, className: 'bg-muted text-muted-foreground' },
};

export default function GuestRelationsDashboard() {
  const unresolvedFeedback = feedback.filter(f => f.status !== 'resolved' && f.status !== 'responded');
  const negativeFeedback = feedback.filter(f => f.sentiment === 'negative');
  const escalatedFeedback = feedback.filter(f => f.status === 'escalated');

  return (
    <MainLayout 
      title="Feedback Inbox" 
      breadcrumbs={[{ label: 'Feedback' }]}
    >
      {/* Stats Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unresolved
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unresolvedFeedback.length}</div>
            <p className="text-xs text-muted-foreground">awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Negative Reviews
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{negativeFeedback.length}</div>
            <p className="text-xs text-muted-foreground">requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Escalated
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalatedFeedback.length}</div>
            <p className="text-xs text-muted-foreground">with management</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feedback Queue</CardTitle>
              <CardDescription>
                Review and respond to guest feedback across all channels
              </CardDescription>
            </div>
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Draft Responses
              <Badge variant="secondary" className="text-xs">Beta</Badge>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({feedback.length})</TabsTrigger>
              <TabsTrigger value="new">New ({feedback.filter(f => f.status === 'new').length})</TabsTrigger>
              <TabsTrigger value="negative">
                Negative ({negativeFeedback.length})
              </TabsTrigger>
              <TabsTrigger value="escalated">
                Escalated ({escalatedFeedback.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {feedback.map(fb => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              {feedback.filter(f => f.status === 'new').map(fb => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}
            </TabsContent>

            <TabsContent value="negative" className="space-y-4">
              {negativeFeedback.map(fb => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}
            </TabsContent>

            <TabsContent value="escalated" className="space-y-4">
              {escalatedFeedback.map(fb => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

interface FeedbackCardProps {
  feedback: typeof feedback[number];
}

function FeedbackCard({ feedback: fb }: FeedbackCardProps) {
  const guest = getGuestById(fb.guestId);
  const property = getPropertyById(fb.propertyId);
  const statusInfo = statusConfig[fb.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <SentimentBadge sentiment={fb.sentiment} showLabel />
            <Badge variant="outline" className="gap-1">
              <ExternalLink className="h-3 w-3" />
              {fb.source}
            </Badge>
            <Badge className={statusInfo.className}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusInfo.label}
            </Badge>
            {fb.rating && (
              <Badge variant="secondary">
                {fb.rating}/10
              </Badge>
            )}
          </div>
          
          <div className="mt-2">
            <span className="font-medium">
              {guest?.firstName} {guest?.lastInitial}.
            </span>
            <span className="text-muted-foreground"> at {property?.name}</span>
            <span className="text-muted-foreground"> • {fb.date}</span>
          </div>

          <p className="mt-2 text-sm">{fb.summary}</p>

          {fb.themes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {fb.themes.map(theme => (
                <Badge key={theme} variant="secondary" className="text-xs">
                  {theme}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button size="sm">Respond</Button>
          <Button variant="outline" size="sm">View Guest</Button>
          {fb.status !== 'escalated' && (
            <Button variant="ghost" size="sm" className="text-warning">
              Escalate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
