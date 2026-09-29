// User Roles
export type UserRole = 'receptionist' | 'guest-relations' | 'marketing' | 'manager' | 'admin';

export const roleLabels: Record<UserRole, string> = {
  receptionist: 'Receptionist Console',
  'guest-relations': 'Guest Relations Officer',
  marketing: 'Marketing & Loyalty Director',
  manager: 'General Manager (KPIs)',
  admin: 'Compliance & System Admin',
};

export const availableRoles: UserRole[] = ['receptionist', 'guest-relations', 'marketing', 'manager', 'admin'];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  propertyAccess?: string[];
}

// Distinguished Properties
export interface Property {
  id: string;
  name: string;
  tagline: string;
  type: 'palace' | 'retreat' | 'resort' | 'heritage' | 'boutique';
  location: string;
  region: string;
  stars: number;
  roomCount: number;
  averageRate: number;
  npsBenchmark: number;
  currency: string;
}

// Guests
export interface Guest {
  id: string;
  pseudonymizedKey: string;
  vaultHash: string;
  firstName: string;
  lastInitial: string;
  fullNameMasked?: string;
  title?: string;
  email?: string;
  phone?: string;
  nationality: string;
  language: 'it' | 'en' | 'de' | 'fr';
  vipTier?: 'Heritage Patron' | 'Ambassador' | 'Distinguished Member' | 'First-Time Guest';
  totalStays: number;
  lifetimeValue: number;
  npsScore?: number;
  sentimentTrend: 'positive' | 'neutral' | 'negative';
  preferences: string[];
  dietaryNotes?: string[];
  consentStatus: ConsentStatus;
  lastStayPropertyId?: string;
}

export interface ConsentStatus {
  marketing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  conciergeProfiling: boolean;
  lastUpdated: string;
  ledgerProof?: string;
}

// Stays
export interface Stay {
  id: string;
  guestId: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  roomNumber: string;
  bookingChannel: 'direct' | 'the-leading-hotels' | 'virtuoso' | 'booking.com' | 'concierge-private' | 'expedia' | 'airbnb' | 'phone';
  totalSpend: number;
  status: 'upcoming' | 'checked-in' | 'checked-out';
  notes?: string;
}

// Feedback
export type SentimentScore = 'positive' | 'neutral' | 'negative';
export type FeedbackSource = 'survey' | 'google' | 'tripadvisor' | 'booking.com' | 'direct' | 'guest-book';
export type FeedbackStatus = 'new' | 'in-review' | 'responded' | 'escalated' | 'resolved';
export type FeedbackUrgency = 'low' | 'medium' | 'high' | 'critical';

export interface FeedbackAiDrafts {
  diplomatic: string;
  warm: string;
  recovery: string;
  concise: string;
}

export interface Feedback {
  id: string;
  guestId: string;
  stayId: string;
  propertyId: string;
  source: FeedbackSource;
  date: string;
  rating?: number;
  npsScore?: number;
  sentiment: SentimentScore;
  urgency: FeedbackUrgency;
  aiConfidence: number;
  themes: string[];
  summary: string;
  fullText?: string;
  language: 'it' | 'en' | 'de' | 'fr';
  status: FeedbackStatus;
  assignedTo?: string;
  responseText?: string;
  respondedAt?: string;
  aiDrafts?: FeedbackAiDrafts;
  categoryRatings?: {
    service: number;
    gastronomy: number;
    comfort: number;
    privacy: number;
  };
}

// Upsell Opportunities
export interface UpsellOpportunity {
  id: string;
  guestId: string;
  stayId?: string;
  propertyId?: string;
  type: 'spa' | 'dining' | 'upgrade' | 'experience' | 'return-booking';
  title: string;
  description: string;
  price?: number;
  confidence: number;
  basedOn: string;
  status: 'suggested' | 'offered' | 'accepted' | 'declined';
}

// Campaigns (Marketing)
export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  segmentCriteria: SegmentCriteria;
  scheduledAt?: string;
  sentAt?: string;
  metrics?: CampaignMetrics;
}

export interface SegmentCriteria {
  sentiments?: SentimentScore[];
  minNps?: number;
  maxNps?: number;
  channels?: string[];
  stayRecency?: 'last-30' | 'last-90' | 'last-180' | 'last-365';
  preferences?: string[];
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
}

// Dashboard KPIs
export interface DashboardKPIs {
  npsScore: number;
  npsTrend: number;
  responseRate: number;
  responseRateTrend: number;
  reviewVolume: number;
  reviewVolumeTrend: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  unresolvedFeedback: number;
  pendingResponses: number;
}

// Alerts & Incidents
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentCategory = 'data-breach' | 'ai-error' | 'urgent-feedback' | 'system' | 'compliance';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export interface Incident {
  id: string;
  category: IncidentCategory;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: 'open' | 'investigating' | 'resolved';
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

// Audit Log
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}
