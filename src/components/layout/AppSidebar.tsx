import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Megaphone, 
  Settings, 
  Building2,
  ChevronDown,
  LogOut,
  Sparkles,
  Shield,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useRole } from '@/contexts/RoleContext';
import type { UserRole } from '@/types';
import { roleLabels } from '@/types';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function AppSidebar() {
  const { currentRole, currentUser } = useRole();
  const { 
    filteredFeedback, 
    filteredUpsells, 
    alerts, 
    incidents,
  } = useHospitalityData();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const unresolvedCount = filteredFeedback.filter(f => f.status === 'new' || f.status === 'in-review').length;
  const suggestedUpsellsCount = filteredUpsells.filter(u => u.status === 'suggested').length;
  const unreadAlertsCount = alerts.filter(a => !a.read).length;
  const openIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;

  const navigationByRole: Record<UserRole, Array<{
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }>> = {
    receptionist: [
      { title: 'Guest List', url: '/receptionist', icon: Users },
      { title: 'Arrivals & Stays', url: '/receptionist/arrivals', icon: Users },
      { title: 'Upsell Opportunities', url: '/receptionist/upsell', icon: Sparkles, badge: suggestedUpsellsCount },
    ],
    'guest-relations': [
      { title: 'Feedback Inbox', url: '/guest-relations', icon: MessageSquare, badge: unresolvedCount },
      { title: 'Guest Timelines', url: '/guest-relations/timelines', icon: Users },
      { title: 'Response Templates', url: '/guest-relations/templates', icon: MessageSquare },
    ],
    marketing: [
      { title: 'Campaigns', url: '/marketing', icon: Megaphone },
      { title: 'Segments', url: '/marketing/segments', icon: Users },
      { title: 'Consent Dashboard', url: '/marketing/consent', icon: Settings },
    ],
    manager: [
      { title: 'Overview & KPIs', url: '/manager', icon: BarChart3 },
      { title: 'Alerts & Recovery', url: '/manager/alerts', icon: MessageSquare, badge: unreadAlertsCount },
      { title: 'Estate Benchmarks', url: '/manager/reports', icon: BarChart3 },
    ],
    admin: [
      { title: 'User Management', url: '/admin', icon: Users },
      { title: 'Audit Ledger', url: '/admin/audit', icon: Settings },
      { title: 'Incidents', url: '/admin/incidents', icon: MessageSquare, badge: openIncidentsCount },
      { title: 'PMS Connectors', url: '/admin/integrations', icon: Building2 },
    ],
  };

  const navItems = navigationByRole[currentRole];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar font-sans">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar-background/60">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-serif font-bold tracking-tight text-foreground">PostStay</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Intelligence Console</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && 'sr-only', 'text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2')}>
            {roleLabels[currentRole]}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        'h-9 px-3 text-xs font-medium transition-colors',
                        isActive 
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/95 hover:text-primary-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <NavLink to={item.url} className="relative flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        {typeof item.badge === 'number' && item.badge > 0 && !collapsed && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              'h-5 min-w-5 px-1.5 text-[11px] font-bold rounded-full',
                              isActive 
                                ? 'bg-primary-foreground text-primary' 
                                : 'bg-primary text-primary-foreground'
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar-background/60 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full h-11 px-2 hover:bg-sidebar-accent rounded-lg border border-transparent hover:border-sidebar-border transition-colors">
                  <Avatar className="h-7 w-7 border border-border">
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <>
                      <div className="flex flex-1 flex-col items-start text-left min-w-0">
                        <span className="text-xs font-semibold text-foreground truncate max-w-[125px]">
                          {currentUser.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[125px]">
                          {roleLabels[currentRole]}
                        </span>
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 text-xs">
                <div className="px-2.5 py-2 border-b">
                  <p className="font-semibold text-foreground">{currentUser.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                  <Badge variant="outline" className="mt-1 text-[10px] font-mono border-primary/30 text-primary">
                    {roleLabels[currentRole]}
                  </Badge>
                </div>
                <DropdownMenuItem className="cursor-pointer gap-2 py-2">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  Security & Token Credentials
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-destructive focus:text-destructive">
                  <LogOut className="h-3.5 w-3.5" />
                  End Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
