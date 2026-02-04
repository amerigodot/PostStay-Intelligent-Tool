import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, ArrowUpRight, ArrowDownRight, Clock, Sparkles } from 'lucide-react';
import { guests, stays, getGuestById, properties } from '@/data/mockData';
import { GuestCard } from '@/components/guests/GuestCard';
import { useState } from 'react';

export default function ReceptionistDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentStays = stays.filter(s => s.status === 'checked-in');
  const upcomingStays = stays.filter(s => s.status === 'upcoming');
  const recentDepartures = stays.filter(s => s.status === 'checked-out');
  const property = properties[0];

  const filteredGuests = guests.filter(guest => {
    const searchLower = searchQuery.toLowerCase();
    return (
      guest.firstName.toLowerCase().includes(searchLower) ||
      guest.lastInitial.toLowerCase().includes(searchLower) ||
      guest.pseudonymizedKey.toLowerCase().includes(searchLower)
    );
  });

  return (
    <MainLayout 
      title="Guest List" 
      breadcrumbs={[{ label: 'Guests' }]}
    >
      {/* Stats Row */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Guests
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStays.length}</div>
            <p className="text-xs text-muted-foreground">at {property.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Arrivals Today
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingStays.length}</div>
            <p className="text-xs text-muted-foreground">expected check-ins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Departures Today
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentDepartures.length}</div>
            <p className="text-xs text-muted-foreground">check-outs completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              VIP Guests
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {guests.filter(g => g.lifetimeValue > 3000).length}
            </div>
            <p className="text-xs text-muted-foreground">high-value guests today</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Guest Directory</CardTitle>
              <CardDescription>
                Manage current, arriving, and departed guests
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guests..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="current" className="gap-2">
                <Clock className="h-4 w-4" />
                Current ({currentStays.length})
              </TabsTrigger>
              <TabsTrigger value="arriving" className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Arriving ({upcomingStays.length})
              </TabsTrigger>
              <TabsTrigger value="departed" className="gap-2">
                <ArrowDownRight className="h-4 w-4" />
                Departed ({recentDepartures.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              {currentStays.map(stay => {
                const guest = getGuestById(stay.guestId);
                if (!guest) return null;
                if (searchQuery && !filteredGuests.find(g => g.id === guest.id)) return null;

                return (
                  <GuestCard key={stay.id} guest={guest} stay={stay} />
                );
              })}
            </TabsContent>

            <TabsContent value="arriving" className="space-y-4">
              {upcomingStays.map(stay => {
                const guest = getGuestById(stay.guestId);
                if (!guest) return null;
                if (searchQuery && !filteredGuests.find(g => g.id === guest.id)) return null;

                return (
                  <GuestCard key={stay.id} guest={guest} stay={stay} />
                );
              })}
            </TabsContent>

            <TabsContent value="departed" className="space-y-4">
              {recentDepartures.map(stay => {
                const guest = getGuestById(stay.guestId);
                if (!guest) return null;
                if (searchQuery && !filteredGuests.find(g => g.id === guest.id)) return null;

                return (
                  <GuestCard key={stay.id} guest={guest} stay={stay} />
                );
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

// GuestCard component extracted to src/components/guests/GuestCard.tsx
// for better separation of concerns and reusability
