import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  MessageSquare, 
  Star, 
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  Building2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

const trendData = [
  { date: 'Jan 1', nps: 76, volume: 48, luxuryBenchmark: 80 },
  { date: 'Jan 8', nps: 81, volume: 54, luxuryBenchmark: 80 },
  { date: 'Jan 15', nps: 79, volume: 62, luxuryBenchmark: 80 },
  { date: 'Jan 22', nps: 86, volume: 71, luxuryBenchmark: 80 },
  { date: 'Jan 29', nps: 84, volume: 82, luxuryBenchmark: 80 },
  { date: 'Feb 3', nps: 88, volume: 88, luxuryBenchmark: 80 },
];

export default function ManagerDashboard() {
  const { 
    kpis, 
    properties, 
    activeProperty,
  } = useHospitalityData();

  // Multi-property comparison benchmark data
  const propertyBenchmarkData = properties.map(p => ({
    name: p.name.replace('Hotel ', ''),
    nps: p.npsBenchmark,
    roomCount: p.roomCount,
    avgRate: p.averageRate,
  }));

  const sentimentData = [
    { name: 'Promoters (9-10)', value: kpis.sentimentDistribution.positive, color: 'hsl(154, 75%, 32%)' },
    { name: 'Passives (7-8)', value: kpis.sentimentDistribution.neutral, color: 'hsl(35, 92%, 42%)' },
    { name: 'Detractors (1-6)', value: kpis.sentimentDistribution.negative, color: 'hsl(0, 80%, 46%)' },
  ];

  return (
    <MainLayout 
      title={activeProperty ? `${activeProperty.name} • Executive Intelligence` : "Executive Portfolio Intelligence & KPIs"} 
      breadcrumbs={[{ label: 'Executive Dashboard' }]}
    >
      {/* Top Level KPIs */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {/* KPI 1: Net Promoter Score */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Portfolio Net Promoter Score
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">
              +{kpis.npsScore}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-400 mt-1 font-bold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{kpis.npsTrend} pts vs prior quarter</span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground mt-1">Leading Hotels benchmark: +78</p>
          </CardContent>
        </Card>

        {/* KPI 2: Survey Response Rate */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Micro-Survey Completion Rate
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">
              {kpis.responseRate}%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-400 mt-1 font-bold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+3.2% (T+2h checkout dispatch)</span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground mt-1">Average open rate: 94.8%</p>
          </CardContent>
        </Card>

        {/* KPI 3: Review Volume */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Analyzed Verified Reviews
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
              <BarChart3 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">
              {kpis.reviewVolume}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-sky-800 dark:text-sky-400 mt-1 font-bold">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+{kpis.reviewVolumeTrend}% YoY volume</span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground mt-1">Across survey, direct, & Leading channels</p>
          </CardContent>
        </Card>

        {/* KPI 4: Pending Actions */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Service Recovery Actions
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-amber-800 dark:text-amber-400">
              {kpis.unresolvedFeedback}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              {kpis.pendingResponses} escalated to executive desk
            </p>
            <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 mt-1">Turnaround: 100% &lt; 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Trend Chart (Span 2) */}
        <Card className="lg:col-span-2 border-border bg-card shadow-xs">
          <CardHeader className="pb-2 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-serif font-bold text-foreground">
                  NPS Trajectory & Survey Feedback Inflow
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-medium">
                  Weekly rolling sentiment index compared to luxury hospitality baseline
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-bold border-emerald-600/50 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30">
                Outperforming Index (+6 pts)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="npsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(24, 88%, 36%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(24, 88%, 36%)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 600 }} 
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false} 
                  />
                  <YAxis 
                    domain={[60, 100]} 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 600 }} 
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'hsl(var(--foreground))',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="nps" 
                    name="Estate NPS"
                    stroke="hsl(24, 88%, 36%)" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#npsGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Breakdown Pie */}
        <Card className="border-border bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2 border-b border-border/60">
            <CardTitle className="text-base font-serif font-bold text-foreground">
              Sentiment Distribution
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-medium">
              AI classified vector breakdown across {kpis.reviewVolume} stay surveys
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      fontWeight: 600,
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-2 pt-3 border-t border-border/80 text-xs">
              {sentimentData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full shadow-2xs" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Property Luxury Benchmark Bar Chart */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 border-border bg-card shadow-xs">
          <CardHeader className="pb-2 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-serif font-bold text-foreground">
                  Distinguished Estates • NPS Benchmarks
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground font-medium">
                  Comparative performance across the Italian luxury collection
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-bold border-border">
                Standard &gt; 80
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyBenchmarkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 600 }} 
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false} 
                  />
                  <YAxis 
                    domain={[70, 100]} 
                    tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 600 }} 
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      fontWeight: 600,
                    }} 
                  />
                  <Bar dataKey="nps" name="NPS Benchmark" radius={[4, 4, 0, 0]}>
                    {propertyBenchmarkData.map((entry, index) => (
                      <Cell 
                        key={`bar-${index}`} 
                        fill={entry.nps >= 90 ? 'hsl(24, 88%, 36%)' : 'hsl(215, 25%, 45%)'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Strategic Synthesis Panel */}
        <Card className="border-border bg-card shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-serif font-bold text-foreground">
                Executive AI Synthesis
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Algorithmic pattern recognition from recent stay surveys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs pt-4">
            <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Villa d'Este • Acoustic Quiet Hours
              </div>
              <p className="text-foreground/80 leading-relaxed font-sans font-medium">
                Early morning motorized blowers flagged near Queen Pavilion. Maintenance rescheduled to commence strictly at 09:30.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-amber-600" />
                Aman Venice • Discretion Benchmark
              </div>
              <p className="text-foreground/80 leading-relaxed font-sans font-medium">
                100% promoter score regarding zero-voucher billing and private water gate arrivals at Palazzo Papadopoli.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                Belmond Caruso • Executive Reconciliation
              </div>
              <p className="text-foreground/80 leading-relaxed font-sans font-medium">
                Mme de Rochechouart anniversary protocol failure addressed via private Capri charter compensation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
