import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Star, 
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  BarChart3,
} from 'lucide-react';
import { dashboardKPIs, alerts, feedback } from '@/data/mockData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock trend data for chart
const trendData = [
  { date: 'Jan 1', nps: 38, volume: 42 },
  { date: 'Jan 8', nps: 41, volume: 38 },
  { date: 'Jan 15', nps: 39, volume: 45 },
  { date: 'Jan 22', nps: 44, volume: 52 },
  { date: 'Jan 29', nps: 42, volume: 48 },
  { date: 'Feb 1', nps: 42, volume: 44 },
];

const sentimentColors = {
  positive: 'hsl(142, 71%, 45%)',
  neutral: 'hsl(38, 92%, 50%)',
  negative: 'hsl(0, 72%, 51%)',
};

export default function ManagerDashboard() {
  const { sentimentDistribution } = dashboardKPIs;
  const pieData = [
    { name: 'Positive', value: sentimentDistribution.positive, color: sentimentColors.positive },
    { name: 'Neutral', value: sentimentDistribution.neutral, color: sentimentColors.neutral },
    { name: 'Negative', value: sentimentDistribution.negative, color: sentimentColors.negative },
  ];

  return (
    <MainLayout 
      title="Dashboard" 
      breadcrumbs={[{ label: 'Overview' }]}
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <KpiCard
          title="NPS Score"
          value={dashboardKPIs.npsScore}
          trend={dashboardKPIs.npsTrend}
          subtitle="Net Promoter Score"
          icon={Star}
        />
        <KpiCard
          title="Response Rate"
          value={`${dashboardKPIs.responseRate}%`}
          trend={dashboardKPIs.responseRateTrend}
          subtitle="Survey responses"
          icon={MessageSquare}
        />
        <KpiCard
          title="Review Volume"
          value={dashboardKPIs.reviewVolume}
          trend={dashboardKPIs.reviewVolumeTrend}
          subtitle="Last 30 days"
          icon={BarChart3}
        />
        <KpiCard
          title="Pending Actions"
          value={dashboardKPIs.unresolvedFeedback + dashboardKPIs.pendingResponses}
          subtitle={`${dashboardKPIs.unresolvedFeedback} unresolved, ${dashboardKPIs.pendingResponses} pending`}
          icon={AlertTriangle}
          warning
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>NPS & Review Trends</CardTitle>
            <CardDescription>Weekly performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="nps" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)" 
                  name="NPS"
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(var(--info))" 
                  fill="hsl(var(--info) / 0.2)" 
                  name="Reviews"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
            <CardDescription>Current period breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-4">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-1.5 text-sm">
                  <span 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Insights */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 3).map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </CardContent>
        </Card>

        {/* AI Insights Placeholder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>AI Insights</CardTitle>
                <Badge variant="secondary">Beta</Badge>
              </div>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <CardDescription>Automatically generated observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <InsightCard 
              title="Check-in Experience Alert"
              description="Check-in complaints increased 30% this month compared to last. Consider reviewing front desk processes."
              type="warning"
            />
            <InsightCard 
              title="Spa Upsell Opportunity"
              description="23% of positive reviews mention spa services. Consider targeted promotion to recent positive guests."
              type="opportunity"
            />
            <InsightCard 
              title="Response Time Impact"
              description="Guests who received responses within 24h show 15% higher rebooking rate."
              type="insight"
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  warning?: boolean;
}

function KpiCard({ title, value, trend, subtitle, icon: Icon, warning }: KpiCardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${warning ? 'text-warning' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${warning ? 'text-warning' : ''}`}>
            {value}
          </span>
          {trend !== undefined && (
            <span className={`flex items-center text-xs ${isPositive ? 'text-success' : isNegative ? 'text-destructive' : 'text-muted-foreground'}`}>
              {isPositive ? <TrendingUp className="mr-0.5 h-3 w-3" /> : isNegative ? <TrendingDown className="mr-0.5 h-3 w-3" /> : null}
              {isPositive ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

interface AlertItemProps {
  alert: typeof alerts[number];
}

function AlertItem({ alert }: AlertItemProps) {
  const severityColors = {
    low: 'bg-muted',
    medium: 'bg-info',
    high: 'bg-warning',
    critical: 'bg-destructive',
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${severityColors[alert.severity]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{alert.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0">
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface InsightCardProps {
  title: string;
  description: string;
  type: 'warning' | 'opportunity' | 'insight';
}

function InsightCard({ title, description, type }: InsightCardProps) {
  const typeStyles = {
    warning: 'border-l-warning',
    opportunity: 'border-l-success',
    insight: 'border-l-info',
  };

  return (
    <div className={`rounded-lg border border-l-4 p-3 ${typeStyles[type]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
