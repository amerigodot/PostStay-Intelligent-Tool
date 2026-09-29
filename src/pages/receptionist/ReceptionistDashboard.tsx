import { useState } from 'react';
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
} from 'lucide-react';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { SentimentBadge } from '@/components/shared/SentimentBadge';
import { NpsScoreBadge } from '@/components/shared/NpsScoreBadge';
import { GuestDossierDialog } from '@/components/shared/GuestDossierDialog';
import type { Guest } from '@/types';
import { useLocation } from 'react-router-dom';

export default function ReceptionistDashboard() {
  const { 
    filteredGuests, 
    filteredStays, 
    filteredUpsells, 
    properties, 
    activeProperty,
    privacyMode,
    updateUpsellStatus,
  } = useHospitalityData();

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuestForDossier, setSelectedGuestForDossier] = useState<Guest | null>(null);

  // Tab state derived from URL route
  const defaultTab = location.pathname.includes('/arrivals') 
    ? 'arrivals' 
    : location.pathname.includes('/upsell') 
    ? 'upsell' 
    : 'in-house';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const currentStays = filteredStays.filter(s => s.status === 'checked-in');
  const upcomingStays = filteredStays.filter(s => s.status === 'upcoming');
  const recentDepartures = filteredStays.filter(s => s.status === 'checked-out');
  const vipGuests = filteredGuests.filter(g => (g.vipTier && g.vipTier !== 'First-Time Guest') || g.lifetimeValue > 15000);

  const filteredGuestList = filteredGuests.filter(guest => {
    const searchLower = searchQuery.toLowerCase();
    return (
      guest.firstName.toLowerCase().includes(searchLower) ||
      guest.lastInitial.toLowerCase().includes(searchLower) ||
      guest.pseudonymizedKey.toLowerCase().includes(searchLower) ||
      guest.preferences.some(p => p.toLowerCase().includes(searchLower))
    );
  });

  const getPropertyName = (propId: string) => {
    return properties.find(p => p.id === propId)?.name || 'Distinguished Estate';
  };

  return (
    <MainLayout 
      title="Front Desk & Daily Guest Concierge" 
      breadcrumbs={[
        { label: 'Receptionist', href: '/receptionist' },
        { label: activeTab === 'arrivals' ? 'Arrivals' : activeTab === 'upsell' ? 'Upsells' : 'In-House' }
      ]}
    >
      {/* High-Contrast Metrics Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              In-House Patrons
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">{currentStays.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              {activeProperty ? `at ${activeProperty.name}` : 'across portfolio'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Expected Arrivals
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-emerald-800 dark:text-emerald-400">{upcomingStays.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">VIP preparations complete</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Check-outs
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">{recentDepartures.length}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Micro-surveys dispatched (T+2h)</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              VIP Tier Patrons
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-amber-800 dark:text-amber-400">
              {vipGuests.length}
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Heritage patrons & ambassadors</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs and Content */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-serif font-bold text-foreground">Front Desk Guest Intelligence</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
                Tokenized guest history, past sentiments, and predictive upsell opportunities
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guest, key, preference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 text-xs h-9 bg-card border-border text-foreground font-medium placeholder:text-muted-foreground shadow-2xs"
              />
            </div>
          </div>

          <div className="pt-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="h-9 bg-muted border border-border p-1">
                <TabsTrigger value="in-house" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs">
                  In-House Guests ({currentStays.length})
                </TabsTrigger>
                <TabsTrigger value="arrivals" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs">
                  Arrivals & Departures ({upcomingStays.length + recentDepartures.length})
                </TabsTrigger>
                <TabsTrigger value="all-guests" className="text-xs px-3 font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs">
                  Patron Directory ({filteredGuestList.length})
                </TabsTrigger>
                <TabsTrigger value="upsell" className="text-xs px-3 font-semibold gap-1.5 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Upsell Prompts ({filteredUpsells.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* TAB 1: In-House Guests */}
          {activeTab === 'in-house' && (
            <div className="space-y-3">
              {currentStays.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm font-medium">
                  No currently checked-in guests matching the property filter.
                </div>
              ) : (
                currentStays.map(stay => {
                  const guest = filteredGuests.find(g => g.id === stay.guestId);
                  if (!guest) return null;
                  const isMasked = privacyMode === 'pseudonymized';

                  return (
                    <div key={stay.id} className="p-4 rounded-lg border border-border bg-card hover:border-foreground/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-base text-foreground">
                            {isMasked ? (guest.fullNameMasked || `${guest.firstName} ${guest.lastInitial}.`) : `${guest.title ? guest.title + ' ' : ''}${guest.firstName} ${guest.lastInitial}.`}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                            {guest.pseudonymizedKey}
                          </span>
                          {guest.vipTier && (
                            <Badge variant="outline" className="border-amber-600/50 text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-xs font-bold">
                              <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                              {guest.vipTier}
                            </Badge>
                          )}
                          <SentimentBadge sentiment={guest.sentimentTrend} showLabel />
                          {guest.npsScore && <NpsScoreBadge score={guest.npsScore} />}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span className="font-bold text-foreground">{stay.roomType} • {stay.roomNumber}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {stay.checkIn} → {stay.checkOut}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-muted-foreground">{guest.totalStays} Stays (LTV: <strong className="text-foreground">€{guest.lifetimeValue.toLocaleString()}</strong>)</span>
                        </div>

                        {stay.notes && (
                          <p className="text-xs italic text-foreground/90 bg-muted/40 p-2.5 rounded border border-border/60">
                            "{stay.notes}"
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {guest.preferences.map(pref => (
                            <Badge key={pref} variant="secondary" className="text-[11px] capitalize font-medium border border-border/80">
                              {pref.replace(/-/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setSelectedGuestForDossier(guest)}
                          className="gap-1.5 text-xs font-semibold border-border bg-card text-foreground hover:bg-muted shadow-2xs"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          View Dossier
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: Arrivals & Departures */}
          {activeTab === 'arrivals' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                  Upcoming Check-Ins
                </h4>
                <div className="space-y-3">
                  {upcomingStays.map(stay => {
                    const guest = filteredGuests.find(g => g.id === stay.guestId);
                    if (!guest) return null;
                    return (
                      <div key={stay.id} className="p-3.5 rounded-lg border border-emerald-600/40 bg-emerald-50/20 dark:bg-emerald-950/10 flex items-center justify-between shadow-2xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">
                              {guest.title ? `${guest.title} ` : ''}{guest.firstName} {guest.lastInitial}.
                            </span>
                            <span className="text-xs font-mono font-semibold text-muted-foreground">({guest.pseudonymizedKey})</span>
                            <Badge variant="outline" className="text-xs font-semibold border-border">{stay.roomType}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                            <span>Check-in: <strong className="text-foreground">{stay.checkIn}</strong></span>
                            <span>•</span>
                            <span>Channel: <strong className="text-foreground">{stay.bookingChannel}</strong></span>
                            {stay.notes && <span>• Note: {stay.notes}</span>}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setSelectedGuestForDossier(guest)} className="text-xs font-semibold border-border shadow-2xs">
                          Review Profile
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <ArrowDownRight className="h-4 w-4 text-sky-600" />
                  Recent Check-Outs (Micro-Survey In-Flight)
                </h4>
                <div className="space-y-3">
                  {recentDepartures.map(stay => {
                    const guest = filteredGuests.find(g => g.id === stay.guestId);
                    if (!guest) return null;
                    return (
                      <div key={stay.id} className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between shadow-2xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">
                              {guest.firstName} {guest.lastInitial}.
                            </span>
                            <span className="text-xs font-mono font-semibold text-muted-foreground">({guest.pseudonymizedKey})</span>
                            <Badge variant="secondary" className="text-xs font-semibold">{stay.roomNumber}</Badge>
                            <SentimentBadge sentiment={guest.sentimentTrend} showLabel />
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">
                            Departed: <strong className="text-foreground">{stay.checkOut}</strong> • Spend: <strong className="text-foreground">€{stay.totalSpend.toLocaleString()}</strong>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedGuestForDossier(guest)} className="text-xs font-semibold">
                          Timeline
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: All Guests Directory */}
          {activeTab === 'all-guests' && (
            <div className="space-y-3">
              {filteredGuestList.map(guest => {
                const isMasked = privacyMode === 'pseudonymized';
                return (
                  <div key={guest.id} className="p-3.5 rounded-lg border border-border bg-card flex items-center justify-between gap-4 shadow-2xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {isMasked ? (guest.fullNameMasked || `${guest.firstName} ${guest.lastInitial}.`) : `${guest.title ? guest.title + ' ' : ''}${guest.firstName} ${guest.lastInitial}.`}
                        </span>
                        <span className="text-xs font-mono font-semibold text-muted-foreground">({guest.pseudonymizedKey})</span>
                        {guest.vipTier && (
                          <Badge variant="outline" className="text-xs font-bold border-amber-600/50 text-amber-800 dark:text-amber-300">
                            {guest.vipTier}
                          </Badge>
                        )}
                        <SentimentBadge sentiment={guest.sentimentTrend} showLabel />
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                        <span>{guest.nationality} • {guest.language.toUpperCase()}</span>
                        <span>•</span>
                        <span>{guest.totalStays} Stays</span>
                        <span>•</span>
                        <span className="font-bold text-foreground">€{guest.lifetimeValue.toLocaleString()} Lifetime Spend</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelectedGuestForDossier(guest)} className="text-xs font-semibold border-border shadow-2xs">
                      Inspect Dossier
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: Upsell Prompts */}
          {activeTab === 'upsell' && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredUpsells.map(upsell => {
                  const guest = filteredGuests.find(g => g.id === upsell.guestId);

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
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-[11px] capitalize font-bold border-primary text-primary">
                            {upsell.type}
                          </Badge>
                          <span className="text-xs font-mono font-bold text-muted-foreground">
                            {Math.round(upsell.confidence * 100)}% AI Confidence
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-base text-foreground mb-1">
                          {upsell.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-3">
                          {upsell.description}
                        </p>

                        <div className="text-xs text-foreground bg-muted/50 p-2.5 rounded-md border border-border/60 mb-3">
                          <span className="font-bold text-foreground">Target Patron:</span> {guest?.title ? guest.title + ' ' : ''}{guest?.firstName} {guest?.lastInitial}. ({guest?.pseudonymizedKey})
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            Triggered by: {upsell.basedOn}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/80 pt-3">
                        <div className="text-sm font-bold text-foreground">
                          {upsell.price ? `€${upsell.price.toLocaleString()}` : 'Complimentary Upgrade'}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {upsell.status === 'suggested' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateUpsellStatus(upsell.id, 'offered')}
                              className="text-xs h-8 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs gap-1"
                            >
                              <Sparkles className="h-3 w-3" />
                              Offer to Guest
                            </Button>
                          )}
                          {upsell.status === 'offered' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => updateUpsellStatus(upsell.id, 'accepted')}
                                className="text-xs h-8 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white gap-1 shadow-2xs"
                              >
                                <Check className="h-3.5 w-3.5" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateUpsellStatus(upsell.id, 'declined')}
                                className="text-xs h-8 font-semibold border-border shadow-2xs"
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          {upsell.status === 'accepted' && (
                            <Badge className="bg-emerald-700 text-white font-bold gap-1 py-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Confirmed & Billed
                            </Badge>
                          )}
                          {upsell.status === 'declined' && (
                            <Badge variant="secondary" className="font-semibold">Declined</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
