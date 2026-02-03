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
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useRole, roleLabels } from '@/contexts/RoleContext';
import type { UserRole } from '@/types';
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

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  receptionist: Users,
  'guest-relations': MessageSquare,
  marketing: Megaphone,
  manager: BarChart3,
  admin: Settings,
};

const roleColors: Record<UserRole, string> = {
  receptionist: 'bg-role-receptionist',
  'guest-relations': 'bg-role-guest-relations',
  marketing: 'bg-role-marketing',
  manager: 'bg-role-manager',
  admin: 'bg-role-admin',
};

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationByRole: Record<UserRole, NavItem[]> = {
  receptionist: [
    { title: 'Guest List', url: '/receptionist', icon: Users },
    { title: 'Arrivals Today', url: '/receptionist/arrivals', icon: Users },
    { title: 'Upsell Opportunities', url: '/receptionist/upsell', icon: Sparkles, badge: 3 },
  ],
  'guest-relations': [
    { title: 'Feedback Inbox', url: '/guest-relations', icon: MessageSquare, badge: 5 },
    { title: 'Guest Timelines', url: '/guest-relations/timelines', icon: Users },
    { title: 'Response Templates', url: '/guest-relations/templates', icon: MessageSquare },
  ],
  marketing: [
    { title: 'Campaigns', url: '/marketing', icon: Megaphone },
    { title: 'Segments', url: '/marketing/segments', icon: Users },
    { title: 'Consent Dashboard', url: '/marketing/consent', icon: Settings },
  ],
  manager: [
    { title: 'Dashboard', url: '/manager', icon: BarChart3 },
    { title: 'Alerts', url: '/manager/alerts', icon: MessageSquare, badge: 2 },
    { title: 'Reports', url: '/manager/reports', icon: BarChart3 },
  ],
  admin: [
    { title: 'Users', url: '/admin', icon: Users },
    { title: 'Audit Log', url: '/admin/audit', icon: Settings },
    { title: 'Incidents', url: '/admin/incidents', icon: MessageSquare, badge: 1 },
    { title: 'Integrations', url: '/admin/integrations', icon: Building2 },
  ],
};

export function AppSidebar() {
  const { currentRole, currentUser, setRole, availableRoles } = useRole();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  const navItems = navigationByRole[currentRole];
  const RoleIcon = roleIcons[currentRole];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">PostStay</span>
              <span className="text-xs text-muted-foreground">Intelligence</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && 'sr-only')}>
            {roleLabels[currentRole]} Console
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <NavLink to={item.url} className="relative">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && !collapsed && (
                          <Badge 
                            variant="secondary" 
                            className="ml-auto h-5 min-w-5 px-1.5 text-xs bg-primary text-primary-foreground"
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

        {/* Role Switcher for Demo */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={cn(collapsed && 'sr-only')}>
            Demo: Switch Role
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {availableRoles.map((role) => {
                const Icon = roleIcons[role];
                const isActive = role === currentRole;
                return (
                  <SidebarMenuItem key={role}>
                    <SidebarMenuButton
                      onClick={() => setRole(role)}
                      isActive={isActive}
                      tooltip={roleLabels[role]}
                      className={cn(
                        isActive && 'bg-sidebar-accent'
                      )}
                    >
                      <div className={cn(
                        'flex h-5 w-5 items-center justify-center rounded',
                        roleColors[role],
                        'text-white'
                      )}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span>{roleLabels[role]}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <>
                      <div className="flex flex-1 flex-col items-start text-left">
                        <span className="text-sm font-medium truncate max-w-[120px]">
                          {currentUser.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {roleLabels[currentRole]}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
