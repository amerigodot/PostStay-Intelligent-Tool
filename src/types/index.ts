// User Roles
export type UserRole = 'receptionist' | 'guest-relations' | 'marketing' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Properties
export interface Property {
  id: string;
  name: string;
  type: 'hotel' | 'bnb' | 'resort';
  location: string;
  region: string;
  stars?: number;
  roomCount: number;
}

// Guests
export interface Guest {
  id: string;
  pseudonymizedKey: string;
  firstName: string;
  lastInitial: string;
  email?: string;
  phone?: string;
  nationality: string;
  language: 'it' | 'en' | 'de' | 'fr';
  totalStays: number;
  lifetimeValue: number;
  npsScore?: number;
  sentimentTrend: 'positive' | 'neutral' | 'negative';
  preferences: string[];
  consentStatus: ConsentStatus;
}

export interface ConsentStatus {
  marketing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  lastUpdated: string;
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
  bookingChannel: 'direct' | 'booking.com' | 'expedia' | 'airbnb' | 'phone';
  totalSpend: number;
  status: 'upcoming' | 'checked-in' | 'checked-out';
}

// Feedback
export type SentimentScore = 'positive' | 'neutral' | 'negative';
export type FeedbackSource = 'survey' | 'google' | 'tripadvisor' | 'booking.com' | 'direct';
export type FeedbackStatus = 'new' | 'in-review' | 'responded' | 'escalated' | 'resolved';

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
  themes: string[];
  summary: string;
  fullText?: string;
  language: 'it' | 'en';
  status: FeedbackStatus;
  assignedTo?: string;
  responseText?: string;
  respondedAt?: string;
}

// Upsell Opportunities
export interface UpsellOpportunity {
  id: string;
  guestId: string;
  stayId?: string;
  type: 'spa' | 'dining' | 'upgrade' | 'experience' | 'return-booking';
  title: string;
  description: string;
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
