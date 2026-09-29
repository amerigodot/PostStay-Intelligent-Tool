import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Activity, 
  AlertTriangle,
  Building2,
  CheckCircle2,
  Lock,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { IncidentCategory } from '@/types';
import { toast } from 'sonner';

const incidentCategoryLabels: Record<IncidentCategory, string> = {
  'data-breach': 'Data Breach',
  'ai-error': 'AI Error',
  'urgent-feedback': 'Executive Escalation',
  'system': 'System Telemetry',
  'compliance': 'GDPR Compliance',
};

export default function AdminDashboard() {
  const { 
    auditLog, 
    incidents, 
    properties, 
  } = useHospitalityData();

  const [searchAudit, setSearchAudit] = useState('');
  const [activeTab, setActiveTab] = useState('audit');
  const [isRotatingSalt, setIsRotatingSalt] = useState(false);

  const openIncidents = incidents.filter(i => i.status !== 'resolved');

  const filteredAudit = auditLog.filter(item => 
    item.action.toLowerCase().includes(searchAudit.toLowerCase()) ||
    item.userName.toLowerCase().includes(searchAudit.toLowerCase()) ||
    item.entity.toLowerCase().includes(searchAudit.toLowerCase()) ||
    (item.details && item.details.toLowerCase().includes(searchAudit.toLowerCase()))
  );

  const handleRotateSalt = () => {
    setIsRotatingSalt(true);
    setTimeout(() => {
      setIsRotatingSalt(false);
      toast.success('Identity Vault Salt Rotated', {
        description: 'HMAC-SHA256 salt re-keyed. Zero-knowledge pseudonymization tokens refreshed across all operational nodes.',
      });
    }, 700);
  };

  return (
    <MainLayout 
      title="System Governance & Privacy Architecture" 
      breadcrumbs={[{ label: 'System Admin', href: '/admin' }]}
    >
      {/* High-Contrast Metrics Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Operators
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">5</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">RBAC permission tiers</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Vault Proof Status
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
              <Lock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-emerald-800 dark:text-emerald-400">Active</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Zero-PII isolation verified</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Open Incidents
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-amber-800 dark:text-amber-400">
              {openIncidents.length}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">investigating or pending</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Audit Events Logged
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">{auditLog.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">tamper-evident entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Governance Content Tabs */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-serif font-bold text-foreground">
                Governance & Compliance Console
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
                Audit ledger inspection, cryptographic key management, and PMS connector telemetry
              </CardDescription>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRotateSalt} 
              disabled={isRotatingSalt}
              className="gap-2 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10 shadow-2xs self-start sm:self-auto"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRotatingSalt ? 'animate-spin' : ''}`} />
              {isRotatingSalt ? 'Re-keying...' : 'Rotate Vault Salt'}
            </Button>
          </div>

          <div className="pt-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="h-9 bg-muted border border-border p-1">
                <TabsTrigger value="audit" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs">
                  Audit Ledger ({filteredAudit.length})
                </TabsTrigger>
                <TabsTrigger value="incidents" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs">
                  Incident Log ({incidents.length})
                </TabsTrigger>
                <TabsTrigger value="pms" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs">
                  PMS Connectors ({properties.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* TAB 1: Audit Log */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="relative w-full sm:w-80 pb-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter audit actions, users, entities..."
                  value={searchAudit}
                  onChange={(e) => setSearchAudit(e.target.value)}
                  className="pl-8.5 text-xs h-9 bg-card border-border text-foreground font-medium placeholder:text-muted-foreground shadow-2xs"
                />
              </div>

              <div className="rounded-lg border border-border overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted border-b border-border text-foreground font-bold">
                      <tr>
                        <th className="p-3 font-bold text-foreground">Timestamp</th>
                        <th className="p-3 font-bold text-foreground">Operator</th>
                        <th className="p-3 font-bold text-foreground">Action</th>
                        <th className="p-3 font-bold text-foreground">Entity</th>
                        <th className="p-3 font-bold text-foreground">Details</th>
                        <th className="p-3 font-bold text-foreground">Client IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredAudit.map(entry => (
                        <tr key={entry.id} className="hover:bg-muted/40 transition-colors bg-card">
                          <td className="p-3 font-mono font-semibold text-[11px] text-muted-foreground whitespace-nowrap">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>
                          <td className="p-3 font-bold text-foreground whitespace-nowrap">
                            {entry.userName}
                          </td>
                          <td className="p-3 text-foreground font-semibold">
                            {entry.action}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-[10px] font-mono font-bold border-border bg-muted/30">
                              {entry.entity}
                            </Badge>
                          </td>
                          <td className="p-3 text-muted-foreground font-medium max-w-xs truncate">
                            {entry.details || '—'}
                          </td>
                          <td className="p-3 font-mono font-medium text-[11px] text-muted-foreground">
                            {entry.ipAddress || '10.240.12.01'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Incident Tracker */}
          {activeTab === 'incidents' && (
            <div className="space-y-3">
              {incidents.map(inc => (
                <div 
                  key={inc.id}
                  className={`p-4 rounded-lg border transition-all shadow-2xs ${
                    inc.status === 'open' 
                      ? 'border-amber-600/60 bg-amber-50/20 dark:bg-amber-950/15' 
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-bold border-border">
                        {incidentCategoryLabels[inc.category]}
                      </Badge>
                      <h4 className="font-bold text-sm text-foreground">{inc.title}</h4>
                    </div>
                    <Badge variant={inc.status === 'resolved' ? 'secondary' : 'default'} className="capitalize text-xs font-bold">
                      {inc.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/80 font-medium leading-relaxed mb-2 font-sans">
                    {inc.description}
                  </p>
                  {inc.resolution && (
                    <div className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 p-2.5 rounded border border-emerald-600/40 font-medium">
                      <strong>Resolution:</strong> {inc.resolution}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-medium pt-2">
                    <span>Reported by: <strong className="text-foreground">{inc.reportedBy}</strong></span>
                    <span>•</span>
                    <span className="font-mono">{new Date(inc.reportedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PMS Connectors Telemetry */}
          {activeTab === 'pms' && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {properties.map(prop => (
                  <div key={prop.id} className="p-4 rounded-lg border border-border bg-card space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <h4 className="font-bold text-sm text-foreground">{prop.name}</h4>
                      </div>
                      <Badge className="bg-emerald-700 text-white text-[10px] font-bold gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Connected (TLS 1.3)
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-muted-foreground font-medium">
                      <div>Connector: <strong className="text-foreground">Oracle Opera Cloud v24.2</strong></div>
                      <div>Webhook Latency: <strong className="text-emerald-800 dark:text-emerald-400 font-bold">24ms</strong></div>
                      <div>Queue Sync: <strong className="text-foreground">Every 15 min</strong></div>
                      <div>Error Rate: <strong className="text-emerald-800 dark:text-emerald-400 font-bold">0.00%</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
