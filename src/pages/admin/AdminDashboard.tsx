import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Shield, 
  Activity, 
  AlertTriangle,
  Plus,
  Check,
  X,
} from 'lucide-react';
import { users, incidents, auditLog } from '@/data/mockData';
import { roleLabels } from '@/contexts/RoleContext';
import type { UserRole, IncidentCategory } from '@/types';

const roleColors: Record<UserRole, string> = {
  receptionist: 'bg-role-receptionist',
  'guest-relations': 'bg-role-guest-relations',
  marketing: 'bg-role-marketing',
  manager: 'bg-role-manager',
  admin: 'bg-role-admin',
};

const incidentCategoryLabels: Record<IncidentCategory, string> = {
  'data-breach': 'Data Breach',
  'ai-error': 'AI Error',
  'urgent-feedback': 'Urgent Feedback',
  'system': 'System',
  'compliance': 'Compliance',
};

export default function AdminDashboard() {
  const openIncidents = incidents.filter(i => i.status !== 'resolved');

  return (
    <MainLayout 
      title="User Management" 
      breadcrumbs={[{ label: 'Users' }]}
    >
      {/* Stats Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">across all roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Roles
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">permission levels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Incidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{openIncidents.length}</div>
            <p className="text-xs text-muted-foreground">requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Audit Events
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLog.length}</div>
            <p className="text-xs text-muted-foreground">last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage user access and permissions</CardDescription>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Invite User
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={`text-white ${roleColors[user.role]}`}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Badge className={`${roleColors[user.role]} text-white`}>
                  {roleLabels[user.role]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Audit Log */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Audit log of system actions</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditLog.slice(0, 4).map(entry => (
              <div key={entry.id} className="flex items-start gap-3 rounded-lg border p-3">
                <Activity className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{entry.userName}</span>
                    {' '}{entry.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.entity} • {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Incidents */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Incident Tracker</CardTitle>
                <CardDescription>System issues and escalations</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Report Incident
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incidents.map(incident => (
                <div key={incident.id} className="flex items-start justify-between rounded-lg border p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={incident.status === 'resolved' ? 'secondary' : 'destructive'}>
                        {incident.status}
                      </Badge>
                      <Badge variant="outline">
                        {incidentCategoryLabels[incident.category]}
                      </Badge>
                      <Badge variant="outline" className={
                        incident.severity === 'critical' ? 'border-destructive text-destructive' :
                        incident.severity === 'high' ? 'border-warning text-warning' :
                        ''
                      }>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="mt-2 font-medium">{incident.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{incident.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Reported by {incident.reportedBy} on {new Date(incident.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {incident.status !== 'resolved' ? (
                      <>
                        <Button size="sm" variant="outline">Investigate</Button>
                        <Button size="sm" className="gap-1">
                          <Check className="h-3 w-3" />
                          Resolve
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" className="gap-1">
                        <X className="h-3 w-3" />
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
