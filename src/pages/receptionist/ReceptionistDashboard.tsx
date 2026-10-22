import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  Calendar, 
  Star, 
  Check, 
  UserCheck, 
  CheckCircle2,
  Clock,
  Hotel,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { SentimentBadge } from '@/components/shared/SentimentBadge';
import { NpsScoreBadge } from '@/components/shared/NpsScoreBadge';
import { GuestDossierDialog } from '@/components/shared/GuestDossierDialog';
import type { Guest, Stay, UpsellOpportunity, Feedback } from '@/types';
import { useLocation } from 'react-router-dom';

type OperationalTab = 'checkouts' | 'in-house' | 'checkin-upsell' | 'directory';

export default function ReceptionistDashboard() {
  const { 
    filteredGuests, 
    filteredStays, 
    filteredUpsells, 
    filteredFeedback,
    properties, 
    activeProperty,
    privacyMode,
    updateUpsellStatus,
  } = useHospitalityData();

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuestForDossier, setSelectedGuestForDossier] = useState<Guest | null>(null);

  // Derive initial tab from URL route according to the operational usage pattern
  const defaultTab = useMemo<OperationalTab>(() => {
    if (location.pathname.includes('/in-house')) return 'in-house';
    if (location.pathname.includes('/arrivals') || location.pathname.includes('/upsell')) return 'checkin-upsell';
    if (location.pathname.includes('/checkouts')) return 'checkouts';
    return 'checkouts'; // Default to Step 1: Check-Out Notices
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState<OperationalTab>(defaultTab);

  // Operational Stays Breakdown
  const recentDepartures = useMemo(() => 
    filteredStays.filter(s => s.status === 'checked-out'),
    [filteredStays]
  );
  const currentStays = useMemo(() => 
    filteredStays.filter(s => s.status === 'checked-in'),
    [filteredStays]
  );
  const upcomingStays = useMemo(() => 
    filteredStays.filter(s => s.status === 'upcoming'),
    [filteredStays]
  );
  const activeUpsells = useMemo(() => 
    filteredUpsells.filter(u => u.status === 'suggested' || u.status === 'offered'),
    [filteredUpsells]
  );

  // Filtered Guest List for Search & Directory
  const filteredGuestList = useMemo(() => {
    if (!searchQuery.trim()) return filteredGuests;
    const searchLower = searchQuery.toLowerCase();
    return filteredGuests.filter(guest => {
      return (
        guest.firstName.toLowerCase().includes(searchLower) ||
        guest.lastInitial.toLowerCase().includes(searchLower) ||
        guest.pseudonymizedKey.toLowerCase().includes(searchLower) ||
        (guest.fullNameMasked && guest.fullNameMasked.toLowerCase().includes(searchLower)) ||
        guest.preferences.some(p => p.toLowerCase().includes(searchLower))
      );
    });
  }, [filteredGuests, searchQuery]);

  // Helper to retrieve feedback for a guest/stay
  const getFeedbackForStay = (guestId: string, stayId: string): Feedback | undefined => {
    return filteredFeedback.find(f => f.stayId === stayId || f.guestId === guestId);
  };

  // Helper to format guest display name
  const renderGuestName = (guest: Guest) => {
    const isMasked = privacyMode === 'pseudonymized';
    if (isMasked) {
      return guest.fullNameMasked || `${guest.firstName} ${guest.lastInitial}.`;
    }
    return `${guest.title ? guest.title + ' ' : ''}${guest.firstName} ${guest.lastInitial}.`;
  };

  return (
    <MainLayout 
      title="Front Desk & Daily Guest Concierge" 
      breadcrumbs={[
        { label: 'Receptionist', href: '/receptionist' },
        { 
          label: activeTab === 'checkouts' 
            ? '1. Check-Out Notices' 
            : activeTab === 'in-house' 
            ? '2. In-House Status' 
            : activeTab === 'checkin-upsell' 
            ? '3. Check-In & Upsells' 
            : 'Patron Directory' 
        }
      ]}
    >
      {/* ========================================================================= */}
      {/* 1. HIGH-CONTRAST METRICS BAR (Sequential Operational Progression)         */}
      {/* ========================================================================= */}
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Check-Out Notices */}
        <Card 
          onClick={() => setActiveTab('checkouts')}
          className={`cursor-pointer transition-all border shadow-xs hover:shadow-sm ${
            activeTab === 'checkouts' ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/40 dark:bg-sky-950/20' : 'border-border bg-card hover:border-foreground/30'
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
              1. Check-Outs
            </CardTitle>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground leading-tight">{recentDepartures.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1 truncate">
              T+2h survey pipeline
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: In-House Status */}
        <Card 
          onClick={() => setActiveTab('in-house')}
          className={`cursor-pointer transition-all border shadow-xs hover:shadow-sm ${
            activeTab === 'in-house' ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border bg-card hover:border-foreground/30'
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
              2. In-House
            </CardTitle>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Hotel className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground leading-tight">{currentStays.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1 truncate">
              {activeProperty ? activeProperty.name : 'Active portfolio suites'}
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Expected Check-Ins */}
        <Card 
          onClick={() => setActiveTab('checkin-upsell')}
          className={`cursor-pointer transition-all border shadow-xs hover:shadow-sm ${
            activeTab === 'checkin-upsell' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20' : 'border-border bg-card hover:border-foreground/30'
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
              3. Arrivals
            </CardTitle>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-800 dark:text-emerald-400 leading-tight">
              {upcomingStays.length}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1 truncate">
              Arrival prep complete
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Upsell Suggestions */}
        <Card 
          onClick={() => setActiveTab('checkin-upsell')}
          className={`cursor-pointer transition-all border shadow-xs hover:shadow-sm ${
            activeTab === 'checkin-upsell' ? 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/40 dark:bg-amber-950/20' : 'border-border bg-card hover:border-foreground/30'
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
              4. Upsell Queue
            </CardTitle>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-800 dark:text-amber-400 leading-tight">
              {activeUpsells.length}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1 truncate">
              Active AI opportunities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 2. OPERATIONAL WORKFLOW TABS & SEARCH CONTAINER                            */}
      {/* ========================================================================= */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-serif font-bold text-foreground">
                Front Desk Daily Operations
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
                Structured workflow: Check-out feedback collection → In-house resident care → Arrival check-in & AI upsells
              </CardDescription>
            </div>

            {/* Global Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guest, token key, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 bg-card border-border text-foreground font-medium placeholder:text-muted-foreground shadow-2xs"
              />
            </div>
          </div>

          {/* Sequential Usage Pattern Navigation */}
          <div className="pt-4">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as OperationalTab)} className="w-full">
              <TabsList className="h-auto min-h-10 bg-muted border border-border p-1 w-full flex flex-wrap sm:flex-nowrap gap-1.5">
                <TabsTrigger 
                  value="checkouts" 
                  className="flex-1 py-2 px-2.5 sm:px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ArrowDownRight className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>1. Check-Outs</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-muted-foreground/15">
                    {recentDepartures.length}
                  </span>
                </TabsTrigger>

                <TabsTrigger 
                  value="in-house" 
                  className="flex-1 py-2 px-2.5 sm:px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Hotel className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>2. In-House</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-muted-foreground/15">
                    {currentStays.length}
                  </span>
                </TabsTrigger>

                <TabsTrigger 
                  value="checkin-upsell" 
                  className="flex-1 py-2 px-2.5 sm:px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>3. Check-In & Upsell</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    {upcomingStays.length} • {activeUpsells.length}
                  </span>
                </TabsTrigger>

                <TabsTrigger 
                  value="directory" 
                  className="flex-1 py-2 px-2.5 sm:px-3 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>Directory</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-muted-foreground/15">
                    {filteredGuestList.length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          {/* ======================================================================= */}
          {/* STEP 1: CHECK-OUT NOTICES (Post-Stay Survey Dispatches & Feedback)       */}
          {/* ======================================================================= */}
          {activeTab === 'checkouts' && (
            <div className="space-y-4">
              {/* Context Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-sky-300/60 dark:border-sky-800/60 bg-sky-50/50 dark:bg-sky-950/20 text-xs">
                <div className="flex items-center gap-2 text-sky-950 dark:text-sky-200 font-medium">
                  <Clock className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><strong>PostStay Intelligence Pipeline:</strong> PMS checkout events automatically schedule encrypted micro-surveys (T+2h) with Zero PII exposure to AI models.</span>
                </div>
                <Badge variant="outline" className="border-sky-400 dark:border-sky-700 text-sky-800 dark:text-sky-300 font-mono text-[11px] shrink-0 self-start sm:self-auto">
                  T+2h Survey Interval
                </Badge>
              </div>

              {recentDepartures.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm font-medium">
                  No recent check-outs matching the current property filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDepartures.map(stay => {
                    const guest = filteredGuests.find(g => g.id === stay.guestId);
                    if (!guest) return null;
                    const fb = getFeedbackForStay(guest.id, stay.id);

                    return (
                      <div 
                        key={stay.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:border-foreground/40 transition-all shadow-xs hover:shadow-sm"
                      >
                        {/* Left Metadata Block */}
                        <div className="min-w-0 flex-1 space-y-2">
                          {/* Row 1: Identity & Departure Info */}
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span className="font-bold text-sm text-foreground shrink-0">
                              {renderGuestName(guest)}
                            </span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border shrink-0">
                              {guest.pseudonymizedKey}
                            </span>
                            <Badge variant="outline" className="text-xs font-semibold border-border shrink-0">
                              {stay.roomType} • {stay.roomNumber}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-medium shrink-0">
                              Departed: <strong className="text-foreground">{stay.checkOut}</strong>
                            </span>
                            <span className="text-xs font-bold text-foreground shrink-0">
                              €{stay.totalSpend.toLocaleString()} Folio
                            </span>
                          </div>

                          {/* Row 2: Post-Stay Micro-Survey & Sentiment Status */}
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-0.5">
                            {fb ? (
                              <>
                                <Badge className="bg-emerald-700 dark:bg-emerald-600 text-white font-semibold text-xs gap-1.5 shadow-xs shrink-0">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Feedback Captured
                                </Badge>
                                {fb.nps !== undefined && <NpsScoreBadge score={fb.nps} showLabel size="sm" />}
                                <SentimentBadge sentiment={fb.sentiment} showLabel size="sm" />
                                {fb.comment && (
                                  <span className="text-xs text-foreground/85 italic truncate max-w-full sm:max-w-md bg-muted/40 px-2 py-0.5 rounded border border-border">
                                    "{fb.comment}"
                                  </span>
                                )}
                              </>
                            ) : (
                              <Badge variant="outline" className="border-sky-500/70 text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/30 text-xs font-semibold gap-1.5 shrink-0">
                                <Clock className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
                                Micro-Survey Dispatched (T+2h) • Awaiting Response
                              </Badge>
                            )}
                          </div>

                          {/* Row 3: Staff/Stay Notes */}
                          {stay.notes && (
                            <p className="text-xs text-foreground/85 bg-muted/30 p-2 rounded border border-border italic">
                              "{stay.notes}"
                            </p>
                          )}
                        </div>

                        {/* Right Action Rail (Strictly Aligned) */}
                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pt-2 sm:pt-0">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setSelectedGuestForDossier(guest)}
                            className="h-8 px-3 text-xs font-semibold border border-border bg-card text-foreground hover:bg-muted hover:border-foreground/40 active:scale-[0.98] shadow-xs gap-1.5 transition-all shrink-0"
                          >
                            <UserCheck className="h-3.5 w-3.5 text-primary" />
                            View Dossier
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================================= */}
          {/* STEP 2: IN-HOUSE STATUS (Resident Care & Preferences)                   */}
          {/* ======================================================================= */}
          {activeTab === 'in-house' && (
            <div className="space-y-4">
              {/* Context Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-primary/30 bg-primary/5 text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Hotel className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Resident Patron Operations:</strong> Live monitoring of checked-in patrons, personalized concierge preferences, and quiet-hour governance.</span>
                </div>
                <span className="text-xs font-bold text-primary font-mono shrink-0">
                  {currentStays.length} Active Suites
                </span>
              </div>

              {currentStays.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm font-medium">
                  No currently checked-in guests matching the active property filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {currentStays.map(stay => {
                    const guest = filteredGuests.find(g => g.id === stay.guestId);
                    if (!guest) return null;

                    return (
                      <div 
                        key={stay.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:border-foreground/40 transition-all shadow-xs hover:shadow-sm"
                      >
                        {/* Left Metadata Block */}
                        <div className="min-w-0 flex-1 space-y-2">
                          {/* Row 1: Identity & Key Badges */}
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <span className="font-bold text-base text-foreground shrink-0">
                              {renderGuestName(guest)}
                            </span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border shrink-0">
                              {guest.pseudonymizedKey}
                            </span>
                            <Badge variant="outline" className="border-primary/50 text-primary font-bold text-xs bg-card shrink-0">
                              {stay.roomType} • {stay.roomNumber}
                            </Badge>
                            {guest.vipTier && (
                              <Badge variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-xs font-bold gap-1 shrink-0">
                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                {guest.vipTier}
                              </Badge>
                            )}
                            <SentimentBadge sentiment={guest.sentimentTrend} showLabel size="sm" />
                            {guest.npsScore !== undefined && <NpsScoreBadge score={guest.npsScore} size="sm" />}
                          </div>

                          {/* Row 2: Stay Duration & Preferences */}
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1 font-semibold text-foreground shrink-0">
                              <Calendar className="h-3.5 w-3.5 text-primary" />
                              {stay.checkIn} → {stay.checkOut}
                            </span>
                            <span>•</span>
                            <span className="shrink-0">
                              {guest.totalStays} Stays (LTV: <strong className="text-foreground">€{guest.lifetimeValue.toLocaleString()}</strong>)
                            </span>
                            {guest.preferences.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1 flex-wrap">
                                  {guest.preferences.slice(0, 3).map(pref => (
                                    <Badge key={pref} variant="secondary" className="text-[11px] capitalize font-medium border border-border">
                                      {pref.replace(/-/g, ' ')}
                                    </Badge>
                                  ))}
                                  {guest.preferences.length > 3 && (
                                    <span className="text-[11px] font-semibold text-muted-foreground">
                                      +{guest.preferences.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Row 3: Concierge In-House Notes */}
                          {stay.notes && (
                            <p className="text-xs text-foreground/90 bg-muted/40 p-2.5 rounded border border-border italic">
                              "{stay.notes}"
                            </p>
                          )}
                        </div>

                        {/* Right Action Rail (Strictly Aligned) */}
                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pt-2 sm:pt-0">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setSelectedGuestForDossier(guest)}
                            className="h-8 px-3 text-xs font-semibold border border-border bg-card text-foreground hover:bg-muted hover:border-foreground/40 active:scale-[0.98] shadow-xs gap-1.5 transition-all shrink-0"
                          >
                            <UserCheck className="h-3.5 w-3.5 text-primary" />
                            View Dossier
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================================= */}
          {/* STEP 3: CHECK-IN & UPSELL SUGGESTIONS (Arrivals & Revenue Intelligence) */}
          {/* ======================================================================= */}
          {activeTab === 'checkin-upsell' && (
            <div className="space-y-6">
              {/* Context Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-amber-300/60 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
                <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-medium">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span><strong>Arrival & Predictive Upsell Synchronization:</strong> Review arriving patron logistics and present calibrated, high-affinity AI upgrades at check-in.</span>
                </div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 font-mono shrink-0">
                  {upcomingStays.length} Expected Arrivals
                </span>
              </div>

              {/* Section 1: Upcoming Check-Ins with Integrated Upsells */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  Upcoming Check-Ins & Assigned Upgrades
                </h4>

                {upcomingStays.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm font-medium border rounded-lg bg-card">
                    No upcoming check-ins found for the selected property filter.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingStays.map(stay => {
                      const guest = filteredGuests.find(g => g.id === stay.guestId);
                      if (!guest) return null;

                      // Find matching upsell for this guest/stay
                      const upsell = filteredUpsells.find(u => u.stayId === stay.id || u.guestId === guest.id);

                      return (
                        <div 
                          key={stay.id} 
                          className="p-4 rounded-lg border-2 border-emerald-600/40 bg-emerald-50/15 dark:bg-emerald-950/10 shadow-xs space-y-3"
                        >
                          {/* Arrival Top Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                              <span className="font-bold text-base text-foreground shrink-0">
                                {renderGuestName(guest)}
                              </span>
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border shrink-0">
                                {guest.pseudonymizedKey}
                              </span>
                              <Badge variant="outline" className="text-xs font-semibold border-border shrink-0">
                                {stay.roomType} • {stay.roomNumber}
                              </Badge>
                              {guest.vipTier && (
                                <Badge variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-xs font-bold gap-1 shrink-0">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  {guest.vipTier}
                                </Badge>
                              )}
                            </div>

                            {/* Aligned Arrival Action Button */}
                            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setSelectedGuestForDossier(guest)}
                                className="h-8 px-3 text-xs font-semibold border border-border bg-card text-foreground hover:bg-muted hover:border-foreground/40 active:scale-[0.98] shadow-xs gap-1.5 transition-all shrink-0"
                              >
                                <UserCheck className="h-3.5 w-3.5 text-primary" />
                                Arrival Dossier
                              </Button>
                            </div>
                          </div>

                          {/* Logistics Sub-row */}
                          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 font-medium">
                            <span>Check-in Date: <strong className="text-foreground">{stay.checkIn}</strong></span>
                            <span>•</span>
                            <span>Booking Channel: <strong className="text-foreground">{stay.bookingChannel}</strong></span>
                            <span>•</span>
                            <span>Estimated Stay Spend: <strong className="text-foreground">€{stay.totalSpend.toLocaleString()}</strong></span>
                          </div>

                          {/* Arrival Notes */}
                          {stay.notes && (
                            <p className="text-xs text-foreground/90 bg-card p-2.5 rounded border border-border italic">
                              "{stay.notes}"
                            </p>
                          )}

                          {/* DIRECT AI UPSELL ATTACHMENT */}
                          {upsell ? (
                            <div className="mt-3 p-4 rounded-lg border-2 border-primary/40 bg-card shadow-xs space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="border-primary/60 text-primary font-bold text-xs gap-1 bg-primary/5 shrink-0">
                                    <Sparkles className="h-3 w-3" />
                                    AI Upsell: {upsell.type.toUpperCase()}
                                  </Badge>
                                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                                    {Math.round(upsell.confidence * 100)}% AI Match Confidence
                                  </span>
                                </div>
                                <span className="text-sm font-bold text-foreground shrink-0">
                                  {upsell.price ? `€${upsell.price.toLocaleString()}` : 'Complimentary Upgrade'}
                                </span>
                              </div>

                              <h5 className="font-serif font-bold text-sm text-foreground leading-snug">
                                {upsell.title}
                              </h5>
                              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                {upsell.description}
                              </p>
                              <div className="text-[11px] text-muted-foreground font-medium">
                                Triggered by: <span className="text-foreground font-semibold">{upsell.basedOn}</span>
                              </div>

                              {/* Aligned Upsell Action Row */}
                              <div className="flex items-center justify-end gap-2 border-t border-border pt-3 mt-3">
                                {upsell.status === 'suggested' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateUpsellStatus(upsell.id, 'offered')}
                                    className="h-8 px-3 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] shadow-xs"
                                  >
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Offer to Patron
                                  </Button>
                                )}
                                {upsell.status === 'offered' && (
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => updateUpsellStatus(upsell.id, 'accepted')}
                                      className="h-8 px-3 text-xs font-semibold gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white active:scale-[0.98] shadow-xs"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      Accept & Book
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => updateUpsellStatus(upsell.id, 'declined')}
                                      className="h-8 px-3 text-xs font-semibold border border-border bg-card text-foreground hover:bg-muted active:scale-[0.98] shadow-xs"
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                )}
                                {upsell.status === 'accepted' && (
                                  <Badge className="bg-emerald-700 text-white font-bold gap-1 py-1 px-3 text-xs">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Accepted & Billed
                                  </Badge>
                                )}
                                {upsell.status === 'declined' && (
                                  <Badge variant="secondary" className="font-semibold text-xs py-1 px-3 border border-border">
                                    Declined by Patron
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-md p-2.5 font-medium">
                              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span>Preferences verified • Room inspected and standard welcome protocol pre-set.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 2: Additional Active Portfolio Upsells */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Additional In-House & Special Experience Upsell Queue
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  {filteredUpsells.map(upsell => {
                    const guest = filteredGuests.find(g => g.id === upsell.guestId);
                    if (!guest) return null;

                    return (
                      <div 
                        key={upsell.id} 
                        className={`p-4 rounded-lg border transition-all flex flex-col justify-between shadow-2xs ${
                          upsell.status === 'accepted'
                            ? 'border-emerald-600/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                            : upsell.status === 'offered'
                            ? 'border-sky-600/60 bg-sky-50/30 dark:bg-sky-950/20'
                            : 'border-border bg-card'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="outline" className="text-[11px] capitalize font-bold border-primary text-primary">
                              {upsell.type}
                            </Badge>
                            <span className="text-xs font-mono font-bold text-muted-foreground">
                              {Math.round(upsell.confidence * 100)}% Match
                            </span>
                          </div>

                          <h5 className="font-serif font-bold text-base text-foreground leading-snug">
                            {upsell.title}
                          </h5>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            {upsell.description}
                          </p>

                          <div className="text-xs text-foreground bg-muted/40 p-2.5 rounded-md border border-border/60">
                            <span className="font-bold text-foreground">Target Patron:</span> {renderGuestName(guest)} ({guest.pseudonymizedKey})
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              Trigger: {upsell.basedOn}
                            </div>
                          </div>
                        </div>

                        {/* Fixed Height Aligned Action Footer */}
                        <div className="flex items-center justify-between border-t border-border/80 pt-3 mt-4">
                          <div className="text-sm font-bold text-foreground">
                            {upsell.price ? `€${upsell.price.toLocaleString()}` : 'Complimentary Upgrade'}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {upsell.status === 'suggested' && (
                              <Button 
                                size="sm" 
                                onClick={() => updateUpsellStatus(upsell.id, 'offered')}
                                className="h-8 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs gap-1"
                              >
                                <Sparkles className="h-3 w-3" />
                                Offer
                              </Button>
                            )}
                            {upsell.status === 'offered' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => updateUpsellStatus(upsell.id, 'accepted')}
                                  className="h-8 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white gap-1 shadow-2xs"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateUpsellStatus(upsell.id, 'declined')}
                                  className="h-8 text-xs font-semibold border-border shadow-2xs"
                                >
                                  Decline
                                </Button>
                              </>
                            )}
                            {upsell.status === 'accepted' && (
                              <Badge className="bg-emerald-700 text-white font-bold gap-1 py-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Confirmed
                              </Badge>
                            )}
                            {upsell.status === 'declined' && (
                              <Badge variant="secondary" className="font-semibold text-xs">Declined</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* STEP 4: PATRON DIRECTORY (Master Guest Roster)                          */}
          {/* ======================================================================= */}
          {activeTab === 'directory' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-border bg-muted/20 text-xs text-muted-foreground flex items-center justify-between">
                <span>Showing <strong>{filteredGuestList.length}</strong> registered luxury patrons across the active portfolio filter.</span>
                <span className="font-mono text-[11px] font-semibold text-foreground">
                  Vault Privacy: {privacyMode === 'pseudonymized' ? 'Tokenized Shield' : 'Operational Staff'}
                </span>
              </div>

              {filteredGuestList.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm font-medium">
                  No patrons match your search query "{searchQuery}".
                </div>
              ) : (
                filteredGuestList.map(guest => {
                  return (
                    <div 
                      key={guest.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:border-foreground/40 transition-all shadow-xs hover:shadow-sm"
                    >
                      {/* Left Metadata Block */}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <span className="font-bold text-sm text-foreground shrink-0">
                            {renderGuestName(guest)}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border shrink-0">
                            {guest.pseudonymizedKey}
                          </span>
                          {guest.vipTier && (
                            <Badge variant="outline" className="text-xs font-bold border-amber-600/50 text-amber-800 dark:text-amber-300 gap-1 bg-amber-50/50 dark:bg-amber-950/20 shrink-0">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                              {guest.vipTier}
                            </Badge>
                          )}
                          <SentimentBadge sentiment={guest.sentimentTrend} showLabel size="sm" />
                          {guest.npsScore !== undefined && <NpsScoreBadge score={guest.npsScore} size="sm" />}
                        </div>

                        <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2.5 gap-y-1 font-medium">
                          <span className="shrink-0">{guest.nationality} • {guest.language.toUpperCase()}</span>
                          <span>•</span>
                          <span className="shrink-0">{guest.totalStays} Stays</span>
                          <span>•</span>
                          <span className="font-bold text-foreground shrink-0">
                            €{guest.lifetimeValue.toLocaleString()} Lifetime Spend
                          </span>
                        </div>
                      </div>

                      {/* Right Action Rail (Strictly Aligned) */}
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center pt-2 sm:pt-0">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setSelectedGuestForDossier(guest)}
                          className="h-8 px-3 text-xs font-semibold border border-border bg-card text-foreground hover:bg-muted hover:border-foreground/40 active:scale-[0.98] shadow-xs gap-1.5 transition-all shrink-0"
                        >
                          <UserCheck className="h-3.5 w-3.5 text-primary" />
                          Inspect Dossier
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guest Dossier Dialog */}
      <GuestDossierDialog
        guest={selectedGuestForDossier}
        open={!!selectedGuestForDossier}
        onOpenChange={(open) => {
          if (!open) setSelectedGuestForDossier(null);
        }}
      />
    </MainLayout>
  );
}
