import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { 
  properties as initialProperties, 
  guests as initialGuests, 
  stays as initialStays, 
  feedback as initialFeedback, 
  upsellOpportunities as initialUpsells,
  alerts as initialAlerts,
  incidents as initialIncidents,
  auditLog as initialAuditLog,
  dashboardKPIs as initialKPIs,
} from '@/data/mockData';
import type { 
  Property, 
  Guest, 
  Stay, 
  Feedback, 
  UpsellOpportunity, 
  Alert, 
  Incident, 
  AuditLogEntry, 
  DashboardKPIs 
} from '@/types';
import { toast } from 'sonner';

export type PrivacyMode = 'pseudonymized' | 'operational';

interface HospitalityDataContextType {
  // Properties
  properties: Property[];
  selectedPropertyId: string; // 'all' or propertyId
  setSelectedPropertyId: (id: string) => void;
  activeProperty: Property | null;

  // Privacy & Governance
  privacyMode: PrivacyMode;
  togglePrivacyMode: () => void;
  inspectIdentityVault: (guestId: string) => Guest | undefined;

  // Reactive Domain Entities
  guests: Guest[];
  stays: Stay[];
  feedback: Feedback[];
  upsellOpportunities: UpsellOpportunity[];
  alerts: Alert[];
  incidents: Incident[];
  auditLog: AuditLogEntry[];
  kpis: DashboardKPIs;

  // Filtered queries based on active property
  filteredStays: Stay[];
  filteredFeedback: Feedback[];
  filteredGuests: Guest[];
  filteredUpsells: UpsellOpportunity[];
  filteredAlerts: Alert[];

  // Mutations
  respondToFeedback: (feedbackId: string, responseText: string, tone?: string) => void;
  escalateFeedback: (feedbackId: string, reason?: string) => void;
  resolveFeedback: (feedbackId: string, resolutionNote?: string) => void;
  updateUpsellStatus: (upsellId: string, status: 'suggested' | 'offered' | 'accepted' | 'declined') => void;
  markAlertRead: (alertId: string) => void;
  simulateIncomingReview: (preset?: 'promoter-riva' | 'acoustic-friction' | 'spa-bliss') => void;
  resetToDefault: () => void;
}

const HospitalityDataContext = createContext<HospitalityDataContextType | undefined>(undefined);

export function HospitalityDataProvider({ children }: { children: React.ReactNode }) {
  const [properties] = useState<Property[]>(initialProperties);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('pseudonymized');

  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [stays, setStays] = useState<Stay[]>(initialStays);
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);
  const [upsells, setUpsells] = useState<UpsellOpportunity[]>(initialUpsells);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(initialAuditLog);

  const activeProperty = useMemo(() => {
    if (selectedPropertyId === 'all') return null;
    return properties.find(p => p.id === selectedPropertyId) || null;
  }, [properties, selectedPropertyId]);

  const togglePrivacyMode = useCallback(() => {
    setPrivacyMode(prev => {
      const nextMode = prev === 'pseudonymized' ? 'operational' : 'pseudonymized';
      toast.info(`Privacy Mode Switched: ${nextMode.toUpperCase()}`, {
        description: nextMode === 'pseudonymized' 
          ? 'Architectural tokenization active. Raw PII masked across all views.' 
          : 'Staff Operational Mode active. Identity Vault access logged to audit trail.',
      });
      return nextMode;
    });
  }, []);

  const inspectIdentityVault = useCallback((guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return undefined;

    // Log vault query to tamper-evident audit ledger
    const newAuditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      userId: 'user-current',
      userName: 'Current Operator',
      action: `Identity Vault Decrypt Request: ${guest.pseudonymizedKey}`,
      entity: 'IdentityVault',
      entityId: guest.vaultHash.substring(0, 16),
      details: `Full profile inspected for ${guest.firstName} ${guest.lastInitial}. Compliance token logged.`,
      timestamp: new Date().toISOString(),
      ipAddress: '10.240.12.77',
    };
    setAuditLog(prev => [newAuditEntry, ...prev]);

    toast.success('Identity Vault Access Granted', {
      description: `Cryptographic proof verified for ${guest.pseudonymizedKey}. Action logged.`,
    });

    return guest;
  }, [guests]);

  // Filtered views
  const filteredFeedback = useMemo(() => {
    if (selectedPropertyId === 'all') return feedback;
    return feedback.filter(f => f.propertyId === selectedPropertyId);
  }, [feedback, selectedPropertyId]);

  const filteredStays = useMemo(() => {
    if (selectedPropertyId === 'all') return stays;
    return stays.filter(s => s.propertyId === selectedPropertyId);
  }, [stays, selectedPropertyId]);

  const filteredGuests = useMemo(() => {
    if (selectedPropertyId === 'all') return guests;
    const guestIdsAtProperty = new Set(filteredStays.map(s => s.guestId));
    return guests.filter(g => guestIdsAtProperty.has(g.id) || g.lastStayPropertyId === selectedPropertyId);
  }, [guests, filteredStays, selectedPropertyId]);

  const filteredUpsells = useMemo(() => {
    if (selectedPropertyId === 'all') return upsells;
    return upsells.filter(u => !u.propertyId || u.propertyId === selectedPropertyId);
  }, [upsells, selectedPropertyId]);

  const filteredAlerts = useMemo(() => {
    return alerts;
  }, [alerts]);

  // Dynamically compute KPIs
  const kpis: DashboardKPIs = useMemo(() => {
    const relevantFeedback = filteredFeedback;
    if (relevantFeedback.length === 0) return initialKPIs;

    const npsRatings = relevantFeedback.filter(f => typeof f.npsScore === 'number');
    const avgNps = npsRatings.length > 0 
      ? Math.round(
          ((npsRatings.filter(f => (f.npsScore ?? 0) >= 9).length - 
            npsRatings.filter(f => (f.npsScore ?? 0) <= 6).length) / npsRatings.length) * 100
        )
      : 84;

    const positiveCount = relevantFeedback.filter(f => f.sentiment === 'positive').length;
    const neutralCount = relevantFeedback.filter(f => f.sentiment === 'neutral').length;
    const negativeCount = relevantFeedback.filter(f => f.sentiment === 'negative').length;
    const totalCount = relevantFeedback.length;

    const unresolved = relevantFeedback.filter(f => f.status === 'new' || f.status === 'in-review').length;
    const pending = relevantFeedback.filter(f => f.status === 'escalated').length;

    return {
      npsScore: Math.max(0, avgNps),
      npsTrend: 5,
      responseRate: 92,
      responseRateTrend: 3,
      reviewVolume: 348,
      reviewVolumeTrend: 16,
      sentimentDistribution: {
        positive: Math.round((positiveCount / totalCount) * 100),
        neutral: Math.round((neutralCount / totalCount) * 100),
        negative: Math.round((negativeCount / totalCount) * 100),
      },
      unresolvedFeedback: unresolved,
      pendingResponses: pending,
    };
  }, [filteredFeedback]);

  // Mutations
  const respondToFeedback = useCallback((feedbackId: string, responseText: string, tone = 'Diplomatic Haute Luxury') => {
    setFeedback(prev => prev.map(f => {
      if (f.id !== feedbackId) return f;
      return {
        ...f,
        status: 'responded',
        responseText,
        respondedAt: new Date().toISOString(),
      };
    }));

    const targetFb = feedback.find(f => f.id === feedbackId);
    const guest = targetFb ? guests.find(g => g.id === targetFb.guestId) : null;

    const newAuditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      userId: 'user-current',
      userName: 'Marco Bianchi (Guest Relations)',
      action: `Dispatched AI response (${tone})`,
      entity: 'Feedback',
      entityId: feedbackId,
      details: `Guest: ${guest?.pseudonymizedKey ?? 'GK-TOKEN'} | Response length: ${responseText.length} chars`,
      timestamp: new Date().toISOString(),
      ipAddress: '10.240.12.84',
    };
    setAuditLog(prev => [newAuditEntry, ...prev]);

    toast.success('Response Dispatched & Logged', {
      description: `Sent via secure Identity Vault proxy. Status updated to Responded.`,
    });
  }, [feedback, guests]);

  const escalateFeedback = useCallback((feedbackId: string, reason = 'Escalated by Guest Relations') => {
    setFeedback(prev => prev.map(f => {
      if (f.id !== feedbackId) return f;
      return {
        ...f,
        status: 'escalated',
      };
    }));

    const targetFb = feedback.find(f => f.id === feedbackId);
    const targetProperty = targetFb ? properties.find(p => p.id === targetFb.propertyId) : null;

    // Create a high priority alert
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      title: `Escalation: Review #${feedbackId.slice(-4).toUpperCase()}`,
      message: `${targetProperty?.name ?? 'Establishment'}: ${targetFb?.summary ?? reason}`,
      severity: 'critical',
      createdAt: new Date().toISOString(),
      read: false,
      actionUrl: '/guest-relations',
    };
    setAlerts(prev => [newAlert, ...prev]);

    // Create an incident
    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      category: 'urgent-feedback',
      title: `Executive Escalation for ${targetProperty?.name ?? 'Property'}`,
      description: targetFb?.fullText || reason,
      severity: 'high',
      status: 'open',
      reportedBy: 'user-2',
      reportedAt: new Date().toISOString(),
    };
    setIncidents(prev => [newIncident, ...prev]);

    // Audit log
    const newAuditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      userId: 'user-current',
      userName: 'Guest Relations Officer',
      action: 'Escalated feedback to General Manager',
      entity: 'Feedback',
      entityId: feedbackId,
      details: reason,
      timestamp: new Date().toISOString(),
    };
    setAuditLog(prev => [newAuditEntry, ...prev]);

    toast.warning('Feedback Escalated to Executive Management', {
      description: 'Incident ticket opened & high-priority alert notified to General Manager.',
    });
  }, [feedback, properties]);

  const resolveFeedback = useCallback((feedbackId: string, resolutionNote = 'Resolved with guest satisfaction') => {
    setFeedback(prev => prev.map(f => {
      if (f.id !== feedbackId) return f;
      return {
        ...f,
        status: 'resolved',
      };
    }));

    const newAuditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      userId: 'user-current',
      userName: 'Alessandro Conti (GM)',
      action: 'Closed and resolved feedback ticket',
      entity: 'Feedback',
      entityId: feedbackId,
      details: resolutionNote,
      timestamp: new Date().toISOString(),
    };
    setAuditLog(prev => [newAuditEntry, ...prev]);

    toast.success('Feedback Marked as Resolved', {
      description: resolutionNote,
    });
  }, []);

  const updateUpsellStatus = useCallback((upsellId: string, status: 'suggested' | 'offered' | 'accepted' | 'declined') => {
    setUpsells(prev => prev.map(u => {
      if (u.id !== upsellId) return u;
      return { ...u, status };
    }));

    toast.info(`Upsell Opportunity Updated`, {
      description: `Status changed to ${status.toUpperCase()}.`,
    });
  }, []);

  const markAlertRead = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id !== alertId) return a;
      return { ...a, read: true };
    }));
  }, []);

  const simulateIncomingReview = useCallback((preset: 'promoter-riva' | 'acoustic-friction' | 'spa-bliss' = 'promoter-riva') => {
    const timestamp = new Date().toISOString();
    const shortDate = timestamp.split('T')[0];

    let newFb: Feedback;
    if (preset === 'acoustic-friction') {
      newFb = {
        id: `fb-live-${Date.now()}`,
        guestId: 'guest-6',
        stayId: 'stay-vde-6',
        propertyId: 'prop-vde',
        source: 'survey',
        date: shortDate,
        rating: 4,
        npsScore: 4,
        sentiment: 'negative',
        urgency: 'high',
        aiConfidence: 0.95,
        themes: ['acoustics', 'quiet-hours', 'morning-gardening', 'historic-pavilion'],
        summary: 'Early terrace acoustic disturbance reported at Villa d\'Este Queen Pavilion.',
        fullText: 'We cherish Villa d\'Este, but early morning maintenance equipment at 07:20 shattered our rest today. The silence of Lake Como must be preserved during morning quiet hours.',
        language: 'en',
        status: 'new',
        categoryRatings: { service: 7, gastronomy: 9, comfort: 5, privacy: 7 },
        aiDrafts: {
          diplomatic: 'Dear Lord Cavendish, On behalf of Villa d\'Este, we extend our most sincere apologies for this unacceptable morning noise disturbance. We have instituted an immediate quiet-hour embargo across all pavilion grounds.',
          warm: 'Dear Lord Cavendish, We are deeply sorry for the early disruption to your morning. Preserving your serene rest is our priority.',
          recovery: 'We apologize wholeheartedly and have credited your profile with personal regards from the General Manager.',
          concise: 'We sincerely apologize for the noise disturbance and have adjusted grounds maintenance schedules immediately.',
        },
      };
    } else if (preset === 'spa-bliss') {
      newFb = {
        id: `fb-live-${Date.now()}`,
        guestId: 'guest-3',
        stayId: 'stay-for-3',
        propertyId: 'prop-forestis',
        source: 'survey',
        date: shortDate,
        rating: 10,
        npsScore: 10,
        sentiment: 'positive',
        urgency: 'low',
        aiConfidence: 0.99,
        themes: ['celtic-sauna', 'alpine-purity', 'silence', 'plant-based-degustation'],
        summary: 'Tiefgehende Erholung im Forestis; meisterhafter Zirben-Aufguss und vollkommene Ruhe.',
        fullText: 'Ein unvergleichliches Refugium. Die Verbindung aus minimalistischer Architektur, reinem Quellwasser und der alpinen Stille auf 1.800 Metern ist unübertroffen.',
        language: 'de',
        status: 'new',
        categoryRatings: { service: 10, gastronomy: 10, comfort: 10, privacy: 10 },
        aiDrafts: {
          diplomatic: 'Sehr geehrter Herr Dr. von Bernstorff, die Direktion des Forestis dankt Ihnen von Herzen für diese erhabene Würdigung unseres alpinen Kraftortes.',
          warm: 'Lieber Herr Dr. von Bernstorff, vielen Dank für diese wunderbaren Worte! Wir freuen uns auf Ihren nächsten Besuch im Wald-Spa.',
          recovery: 'Herzlichen Dank für Ihre Wertschätzung unserer Architektur und Wellness-Rituale.',
          concise: 'Vielen Dank für Ihre herausragende Bewertung. Auf ein baldiges Wiedersehen im Forestis!',
        },
      };
    } else {
      newFb = {
        id: `fb-live-${Date.now()}`,
        guestId: 'guest-1',
        stayId: 'stay-vde-8',
        propertyId: 'prop-vde',
        source: 'direct',
        date: shortDate,
        rating: 10,
        npsScore: 10,
        sentiment: 'positive',
        urgency: 'low',
        aiConfidence: 0.98,
        themes: ['private-riva', 'bellini-sunset', 'aristocratic-service', 'lake-como'],
        summary: 'Magica escursione serale in Riva sul lago; servizio di bordo insuperabile.',
        fullText: 'La navigazione al tramonto fino a Bellagio con il motoscafo Riva privato è stata un sogno. Il personale ha preparato Bellini freschi e canapè caldi a bordo. Villa d\'Este continua a incarnare l\'eccellenza assoluta.',
        language: 'it',
        status: 'new',
        categoryRatings: { service: 10, gastronomy: 10, comfort: 10, privacy: 10 },
        aiDrafts: {
          diplomatic: 'Illustrissima Contessa Morosini, La ringraziamo sentitamente per aver condiviso l\'incanto della Sua navigazione serale sul nostro Riva. È sempre un privilegio immenso accoglierLa.',
          warm: 'Cara Contessa, che gioia sapere che il tramonto sul lago e i nostri Bellini abbiano reso indimenticabile la serata! A prestissimo.',
          recovery: 'La ringraziamo per aver confermato l\'eccellenza del nostro servizio motoscafi privati.',
          concise: 'Grazie di cuore per le splendide parole e per la Sua costante presenza a Villa d\'Este.',
        },
      };
    }

    setFeedback(prev => [newFb, ...prev]);

    // Append audit log
    const auditItem: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      userId: 'system-pms-sync',
      userName: 'Opera Cloud PMS Webhook (Simulated)',
      action: `Received Micro-Survey Event #${newFb.id.slice(-6)}`,
      entity: 'Feedback',
      entityId: newFb.id,
      details: `Sentiment: ${newFb.sentiment.toUpperCase()} (NPS ${newFb.npsScore}/10) | Property: ${newFb.propertyId}`,
      timestamp: timestamp,
      ipAddress: '192.168.1.100',
    };
    setAuditLog(prev => [auditItem, ...prev]);

    toast.success(`New Micro-Survey Dispatched to Inbox`, {
      description: `${newFb.summary} (${newFb.sentiment.toUpperCase()}, NPS: ${newFb.npsScore}/10)`,
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setFeedback(initialFeedback);
    setStays(initialStays);
    setGuests(initialGuests);
    setUpsells(initialUpsells);
    setAlerts(initialAlerts);
    setIncidents(initialIncidents);
    setAuditLog(initialAuditLog);
    setSelectedPropertyId('all');
    setPrivacyMode('pseudonymized');
    toast.info('Demo State Reset to Default');
  }, []);

  return (
    <HospitalityDataContext.Provider
      value={{
        properties,
        selectedPropertyId,
        setSelectedPropertyId,
        activeProperty,
        privacyMode,
        togglePrivacyMode,
        inspectIdentityVault,
        guests,
        stays,
        feedback,
        upsellOpportunities: upsells,
        alerts,
        incidents,
        auditLog,
        kpis,
        filteredStays,
        filteredFeedback,
        filteredGuests,
        filteredUpsells,
        filteredAlerts,
        respondToFeedback,
        escalateFeedback,
        resolveFeedback,
        updateUpsellStatus,
        markAlertRead,
        simulateIncomingReview,
        resetToDefault,
      }}
    >
      {children}
    </HospitalityDataContext.Provider>
  );
}

export function useHospitalityData() {
  const context = useContext(HospitalityDataContext);
  if (!context) {
    throw new Error('useHospitalityData must be used within a HospitalityDataProvider');
  }
  return context;
}
