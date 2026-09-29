import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Calendar, 
  Star, 
  HeartHandshake, 
  Utensils, 
  KeyRound, 
  History,
  Building2,
  FileCheck2,
} from 'lucide-react';
import type { Guest } from '@/types';
import { useHospitalityData } from '@/contexts/HospitalityDataContext';
import { SentimentBadge } from './SentimentBadge';
import { NpsScoreBadge } from './NpsScoreBadge';

interface GuestDossierDialogProps {
  guest: Guest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestDossierDialog({ guest, open, onOpenChange }: GuestDossierDialogProps) {
  const { privacyMode, inspectIdentityVault, stays, properties } = useHospitalityData();
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  if (!guest) return null;

  const isMasked = privacyMode === 'pseudonymized' && !vaultUnlocked;
  const guestStays = stays.filter(s => s.guestId === guest.id);

  const handleUnlockVault = () => {
    inspectIdentityVault(guest.id);
    setVaultUnlocked(true);
  };

  const getPropertyName = (propId: string) => {
    return properties.find(p => p.id === propId)?.name || 'Distinguished Property';
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setVaultUnlocked(false);
      onOpenChange(val);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground flex items-center gap-1">
                  <KeyRound className="h-3 w-3 text-primary" />
                  {guest.pseudonymizedKey}
                </span>
                {guest.vipTier && (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20">
                    <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                    {guest.vipTier}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {guest.nationality} • {guest.language.toUpperCase()}
                </Badge>
              </div>

              <DialogTitle className="text-2xl font-serif mt-2">
                {isMasked 
                  ? (guest.fullNameMasked || `${guest.title ? guest.title + ' ' : ''}${guest.firstName} ${guest.lastInitial}.`)
                  : `${guest.title ? guest.title + ' ' : ''}${guest.firstName} ${guest.lastInitial}. (${guest.email || 'Email Vault Encrypted'})`}
              </DialogTitle>
              <DialogDescription className="text-xs mt-1 text-muted-foreground">
                Zero-Knowledge Pseudonymized Profile • Cryptographic ID: {guest.vaultHash.substring(0, 18)}...
              </DialogDescription>
            </div>

            <div className="text-right">
              <div className="text-xs text-muted-foreground">Lifetime Value</div>
              <div className="text-lg font-bold text-primary">€{guest.lifetimeValue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{guest.totalStays} Stays</div>
            </div>
          </div>
        </DialogHeader>

        {/* Vault Decrypt Action Banner */}
        <div className="rounded-lg border bg-muted/40 p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {vaultUnlocked ? (
              <Unlock className="h-4 w-4 text-amber-600" />
            ) : (
              <Lock className="h-4 w-4 text-emerald-600" />
            )}
            <div>
              <span className="font-semibold">
                {vaultUnlocked ? 'Identity Vault Unlocked' : 'Architectural Pseudonymization Active'}
              </span>
              <p className="text-muted-foreground">
                {vaultUnlocked 
                  ? 'Access logged to immutable compliance audit ledger.' 
                  : 'Direct PII is sequestered in the backend Identity Vault.'}
              </p>
            </div>
          </div>
          {!vaultUnlocked && (
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={handleUnlockVault}>
              <ShieldCheck className="h-3 w-3 text-primary" />
              Audit Query Decrypt
            </Button>
          )}
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="preferences">Preferences & VIP</TabsTrigger>
            <TabsTrigger value="stays">Stay Timeline ({guestStays.length})</TabsTrigger>
            <TabsTrigger value="consent">GDPR Governance</TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <HeartHandshake className="h-3.5 w-3.5 text-primary" />
                Expressed Patron Preferences
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {guest.preferences.map(pref => (
                  <Badge key={pref} variant="secondary" className="capitalize text-xs font-normal">
                    {pref.replace(/-/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {guest.dietaryNotes && guest.dietaryNotes.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <Utensils className="h-3.5 w-3.5 text-primary" />
                  Dietary & Sommelier Directives
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {guest.dietaryNotes.map(note => (
                    <Badge key={note} variant="outline" className="border-emerald-600/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 text-xs">
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Sentiment Profile</div>
                <div className="flex items-center gap-2">
                  <SentimentBadge sentiment={guest.sentimentTrend} showLabel />
                  {guest.npsScore && <NpsScoreBadge score={guest.npsScore} />}
                </div>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="text-xs text-muted-foreground mb-1">Last Visited Property</div>
                <div className="text-sm font-medium flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {guest.lastStayPropertyId ? getPropertyName(guest.lastStayPropertyId) : 'Villa d\'Este'}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Stays History */}
          <TabsContent value="stays" className="space-y-3">
            {guestStays.map(stay => (
              <div key={stay.id} className="p-3 rounded-lg border bg-card flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    {getPropertyName(stay.propertyId)}
                  </div>
                  <Badge variant={stay.status === 'checked-in' ? 'default' : 'outline'} className="capitalize">
                    {stay.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {stay.checkIn} → {stay.checkOut}
                  </span>
                  <span>{stay.roomType} • {stay.roomNumber}</span>
                  <span className="font-semibold text-foreground">€{stay.totalSpend.toLocaleString()}</span>
                </div>
                {stay.notes && (
                  <p className="text-muted-foreground italic bg-muted/30 p-1.5 rounded mt-1">
                    "{stay.notes}"
                  </p>
                )}
              </div>
            ))}
          </TabsContent>

          {/* GDPR Governance */}
          <TabsContent value="consent" className="space-y-3">
            <div className="rounded-lg border p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="font-medium flex items-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-emerald-600" />
                  GDPR Article 6 & 9 Consent Matrix
                </span>
                <span className="text-muted-foreground font-mono">
                  Updated: {new Date(guest.consentStatus.lastUpdated).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Direct Concierge Profiling:</span>
                  <Badge variant={guest.consentStatus.conciergeProfiling ? 'default' : 'secondary'}>
                    {guest.consentStatus.conciergeProfiling ? 'Granted' : 'Revoked'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Bespoke Marketing Offers:</span>
                  <Badge variant={guest.consentStatus.marketing ? 'default' : 'secondary'}>
                    {guest.consentStatus.marketing ? 'Granted' : 'Revoked'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Micro-Survey Analytics:</span>
                  <Badge variant={guest.consentStatus.analytics ? 'default' : 'secondary'}>
                    {guest.consentStatus.analytics ? 'Granted' : 'Revoked'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Third-Party Partner Transfer:</span>
                  <Badge variant={guest.consentStatus.thirdParty ? 'default' : 'secondary'}>
                    {guest.consentStatus.thirdParty ? 'Granted' : 'Strictly Prohibited'}
                  </Badge>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                <span>Vault Ledger Proof:</span>
                <span>{guest.consentStatus.ledgerProof || '0x4f12ab...99e'}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
