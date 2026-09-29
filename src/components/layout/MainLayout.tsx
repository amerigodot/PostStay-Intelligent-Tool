import { useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useRole } from '@/contexts/RoleContext';
import { roleLabels, UserRole } from '@/types';
import { Separator } from '@/components/ui/separator';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Sparkles, 
  Lock, 
  Unlock, 
  Radio, 
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { EstablishmentSelector } from '@/components/shared/EstablishmentSelector';
import { RoleSelector } from '@/components/shared/RoleSelector';
import { PrivacyArchitectureModal } from '@/components/shared/PrivacyArchitectureModal';
import { SimulateReviewDialog } from '@/components/shared/SimulateReviewDialog';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

const roleRouteMap: Record<UserRole, string> = {
  receptionist: '/receptionist',
  'guest-relations': '/guest-relations',
  marketing: '/marketing',
  manager: '/manager',
  admin: '/admin',
};

export function MainLayout({ children, title, breadcrumbs }: MainLayoutProps) {
  const { currentRole } = useRole();
  const { 
    privacyMode, 
    togglePrivacyMode, 
    alerts, 
    markAlertRead, 
    activeProperty,
    resetToDefault,
  } = useHospitalityData();

  const [archModalOpen, setArchModalOpen] = useState(false);
  const [simulateOpen, setSimulateOpen] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.read);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans antialiased text-foreground">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          {/* Header Bar with High Contrast & Unified Navigation */}
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card/95 backdrop-blur px-3 md:px-4 z-10 shadow-2xs">
            {/* Left Context Controls */}
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger className="h-8 w-8 text-foreground hover:bg-muted" />
              <Separator orientation="vertical" className="h-5 bg-border hidden sm:block" />
              
              {/* Primary Selectors: Estate & Role */}
              <EstablishmentSelector />
              <RoleSelector />

              <Separator orientation="vertical" className="h-5 bg-border hidden lg:block" />

              {/* Breadcrumbs for secondary location awareness */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="hidden xl:block">
                  <Breadcrumb>
                    <BreadcrumbList className="text-xs font-medium text-muted-foreground">
                      <BreadcrumbItem>
                        <BreadcrumbLink 
                          href={roleRouteMap[currentRole]}
                          className="hover:text-foreground transition-colors"
                        >
                          {roleLabels[currentRole]}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {breadcrumbs.map((crumb, index) => (
                        <span key={crumb.label} className="contents">
                          <BreadcrumbSeparator className="text-muted-foreground" />
                          <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                              <BreadcrumbPage className="font-semibold text-foreground">
                                {crumb.label}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink 
                                href={crumb.href} 
                                className="hover:text-foreground transition-colors"
                              >
                                {crumb.label}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </span>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              )}
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              {/* Privacy Shield Toggle - High Contrast Status */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={togglePrivacyMode}
                    className={`h-9 gap-1.5 text-xs font-semibold shadow-xs transition-all ${
                      privacyMode === 'pseudonymized' 
                        ? 'border-emerald-700 text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60' 
                        : 'border-amber-700 text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60'
                    }`}
                  >
                    {privacyMode === 'pseudonymized' ? (
                      <Lock className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      <Unlock className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                    )}
                    <span className="hidden sm:inline">
                      {privacyMode === 'pseudonymized' ? 'Vault Shield: Active' : 'Staff Mode: Unmasked'}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs max-w-xs p-2">
                  {privacyMode === 'pseudonymized'
                    ? 'Identity Vault Active: Guest PII is strictly pseudonymized into tokenized keys (GK-...). Click to toggle staff operational view.'
                    : 'Staff Operational Mode Active: PII visible with audit log recording. Click to restore Zero-PII shield.'}
                </TooltipContent>
              </Tooltip>

              {/* Simulate Review Event - High Contrast Primary Action */}
              <Button 
                size="sm" 
                onClick={() => setSimulateOpen(true)}
                className="h-9 gap-1.5 text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
              >
                <Radio className="h-3.5 w-3.5 text-primary-foreground animate-pulse" />
                <span className="hidden sm:inline">Simulate Event</span>
              </Button>

              {/* Privacy Architecture Visualizer */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setArchModalOpen(true)}
                className="h-9 gap-1.5 text-xs font-semibold border-border bg-card text-foreground shadow-xs hover:bg-muted"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="hidden md:inline">Architecture</span>
              </Button>

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 relative border-border bg-card text-foreground hover:bg-muted shadow-xs"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadAlerts.length > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-xs">
                        {unreadAlerts.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 shadow-lg border-border">
                  <div className="p-3 border-b border-border flex items-center justify-between bg-muted/40">
                    <span className="font-semibold text-xs text-foreground">Operational Alerts & Anomalies</span>
                    <Badge variant="outline" className="text-[10px] font-bold border-destructive/40 text-destructive bg-destructive/10">
                      {unreadAlerts.length} unread
                    </Badge>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-border">
                    {alerts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">No alerts active.</div>
                    ) : (
                      alerts.map(a => (
                        <div 
                          key={a.id} 
                          onClick={() => markAlertRead(a.id)}
                          className={`p-3 text-xs cursor-pointer transition-colors ${
                            a.read ? 'opacity-65 bg-background' : 'bg-muted/30 font-medium'
                          } hover:bg-muted/70`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={a.severity === 'critical' ? 'text-destructive font-bold' : 'text-foreground font-semibold'}>
                              {a.title}
                            </span>
                            <Badge 
                              variant={a.severity === 'critical' ? 'destructive' : 'secondary'} 
                              className="text-[9px] uppercase font-bold"
                            >
                              {a.severity}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {a.message}
                          </p>
                          <span className="text-[10px] text-muted-foreground mt-1 font-mono block">
                            {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset Demo State Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={resetToDefault} 
                    className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Reset Demo State
                </TooltipContent>
              </Tooltip>
            </div>
          </header>

          {/* Active Property Banner */}
          {activeProperty && (
            <div className="bg-muted/50 border-b border-border px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm text-foreground">
                  {activeProperty.name}
                </span>
                <span className="text-muted-foreground hidden md:inline">—</span>
                <span className="text-muted-foreground font-normal hidden md:inline">
                  {activeProperty.tagline}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                <span>NPS Benchmark: <strong className="text-foreground">{activeProperty.npsBenchmark}</strong></span>
                <span>•</span>
                <span>Capacity: <strong className="text-foreground">{activeProperty.roomCount} Keys</strong></span>
              </div>
            </div>
          )}

          {/* Main Dashboard Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
            {title && (
              <div className="mb-6 flex flex-col gap-1 border-b border-border/60 pb-3">
                <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">{title}</h1>
              </div>
            )}
            {children}
          </main>
        </SidebarInset>
      </div>

      {/* Modals */}
      <PrivacyArchitectureModal open={archModalOpen} onOpenChange={setArchModalOpen} />
      <SimulateReviewDialog open={simulateOpen} onOpenChange={setSimulateOpen} />
    </SidebarProvider>
  );
}
