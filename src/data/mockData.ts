import type {
  Property,
  Guest,
  Stay,
  Feedback,
  UpsellOpportunity,
  Campaign,
  DashboardKPIs,
  Alert,
  Incident,
  AuditLogEntry,
  User,
} from '@/types';

// Properties
export const properties: Property[] = [
  {
    id: 'prop-1',
    name: 'Hotel Bellavista',
    type: 'hotel',
    location: 'Lago di Garda',
    region: 'Veneto',
    stars: 4,
    roomCount: 45,
  },
  {
    id: 'prop-2',
    name: 'Pensione Il Giardino',
    type: 'bnb',
    location: 'Firenze',
    region: 'Toscana',
    roomCount: 12,
  },
  {
    id: 'prop-3',
    name: 'Resort Mare Azzurro',
    type: 'resort',
    location: 'Costa Smeralda',
    region: 'Sardegna',
    stars: 5,
    roomCount: 80,
  },
  {
    id: 'prop-4',
    name: 'Albergo Dolce Vita',
    type: 'hotel',
    location: 'Amalfi',
    region: 'Campania',
    stars: 4,
    roomCount: 28,
  },
];

// Mock Users
export const users: User[] = [
  { id: 'user-1', name: 'Giulia Rossi', email: 'g.rossi@bellavista.it', role: 'receptionist' },
  { id: 'user-2', name: 'Marco Bianchi', email: 'm.bianchi@bellavista.it', role: 'guest-relations' },
  { id: 'user-3', name: 'Francesca Verdi', email: 'f.verdi@bellavista.it', role: 'marketing' },
  { id: 'user-4', name: 'Alessandro Conti', email: 'a.conti@bellavista.it', role: 'manager' },
  { id: 'user-5', name: 'Roberto Esposito', email: 'r.esposito@bellavista.it', role: 'admin' },
];

// Guests
export const guests: Guest[] = [
  {
    id: 'guest-1',
    pseudonymizedKey: 'GK-7F3A9B',
    firstName: 'Marco',
    lastInitial: 'R',
    email: 'marco.r@email.com',
    nationality: 'IT',
    language: 'it',
    totalStays: 4,
    lifetimeValue: 3200,
    npsScore: 9,
    sentimentTrend: 'positive',
    preferences: ['spa', 'late-checkout', 'lake-view'],
    consentStatus: { marketing: true, analytics: true, thirdParty: false, lastUpdated: '2024-11-15' },
  },
  {
    id: 'guest-2',
    pseudonymizedKey: 'GK-2E8C4D',
    firstName: 'Sophie',
    lastInitial: 'M',
    email: 'sophie.m@email.de',
    nationality: 'DE',
    language: 'de',
    totalStays: 2,
    lifetimeValue: 1800,
    npsScore: 7,
    sentimentTrend: 'neutral',
    preferences: ['hiking', 'breakfast-in-room', 'quiet-room'],
    consentStatus: { marketing: false, analytics: true, thirdParty: false, lastUpdated: '2024-10-20' },
  },
  {
    id: 'guest-3',
    pseudonymizedKey: 'GK-5B1D7F',
    firstName: 'James',
    lastInitial: 'W',
    email: 'james.w@email.co.uk',
    nationality: 'GB',
    language: 'en',
    totalStays: 1,
    lifetimeValue: 890,
    npsScore: 4,
    sentimentTrend: 'negative',
    preferences: ['early-checkin'],
    consentStatus: { marketing: true, analytics: true, thirdParty: true, lastUpdated: '2024-12-01' },
  },
  {
    id: 'guest-4',
    pseudonymizedKey: 'GK-9A2E6C',
    firstName: 'Elena',
    lastInitial: 'B',
    email: 'elena.b@email.it',
    nationality: 'IT',
    language: 'it',
    totalStays: 7,
    lifetimeValue: 5600,
    npsScore: 10,
    sentimentTrend: 'positive',
    preferences: ['spa', 'fine-dining', 'suite', 'champagne'],
    consentStatus: { marketing: true, analytics: true, thirdParty: true, lastUpdated: '2024-11-28' },
  },
  {
    id: 'guest-5',
    pseudonymizedKey: 'GK-3F7B8A',
    firstName: 'Pierre',
    lastInitial: 'D',
    email: 'pierre.d@email.fr',
    nationality: 'FR',
    language: 'fr',
    totalStays: 3,
    lifetimeValue: 2100,
    npsScore: 8,
    sentimentTrend: 'positive',
    preferences: ['wine-tasting', 'pool', 'late-dinner'],
    consentStatus: { marketing: true, analytics: false, thirdParty: false, lastUpdated: '2024-09-15' },
  },
  {
    id: 'guest-6',
    pseudonymizedKey: 'GK-1C4D9E',
    firstName: 'Anna',
    lastInitial: 'K',
    nationality: 'AT',
    language: 'de',
    totalStays: 2,
    lifetimeValue: 1400,
    npsScore: 6,
    sentimentTrend: 'neutral',
    preferences: ['cycling', 'organic-breakfast'],
    consentStatus: { marketing: false, analytics: true, thirdParty: false, lastUpdated: '2024-10-05' },
  },
  {
    id: 'guest-7',
    pseudonymizedKey: 'GK-8E2A5B',
    firstName: 'Luca',
    lastInitial: 'F',
    email: 'luca.f@email.it',
    nationality: 'IT',
    language: 'it',
    totalStays: 5,
    lifetimeValue: 4200,
    npsScore: 9,
    sentimentTrend: 'positive',
    preferences: ['business-center', 'express-checkout', 'gym'],
    consentStatus: { marketing: true, analytics: true, thirdParty: false, lastUpdated: '2024-12-10' },
  },
  {
    id: 'guest-8',
    pseudonymizedKey: 'GK-6D9F2C',
    firstName: 'Maria',
    lastInitial: 'S',
    nationality: 'ES',
    language: 'en',
    totalStays: 1,
    lifetimeValue: 650,
    npsScore: 3,
    sentimentTrend: 'negative',
    preferences: [],
    consentStatus: { marketing: false, analytics: false, thirdParty: false, lastUpdated: '2024-11-22' },
  },
  // New guest with no feedback history - demonstrates "Not enough data" fallback
  {
    id: 'guest-9',
    pseudonymizedKey: 'GK-4H8J3K',
    firstName: 'Thomas',
    lastInitial: 'H',
    email: 'thomas.h@email.nl',
    nationality: 'NL',
    language: 'en',
    totalStays: 1,
    lifetimeValue: 420,
    // No NPS score - first stay, no feedback yet
    sentimentTrend: 'neutral',
    preferences: ['early-checkin'],
    consentStatus: { marketing: true, analytics: true, thirdParty: false, lastUpdated: '2025-02-03' },
  },
  // Another new guest - arriving, no prior history
  {
    id: 'guest-10',
    pseudonymizedKey: 'GK-7L2M9N',
    firstName: 'Chiara',
    lastInitial: 'P',
    nationality: 'IT',
    language: 'it',
    totalStays: 1,
    lifetimeValue: 380,
    sentimentTrend: 'neutral',
    preferences: [],
    consentStatus: { marketing: false, analytics: true, thirdParty: false, lastUpdated: '2025-02-04' },
  },
];

// Stays
export const stays: Stay[] = [
  {
    id: 'stay-1',
    guestId: 'guest-1',
    propertyId: 'prop-1',
    checkIn: '2025-02-01',
    checkOut: '2025-02-05',
    roomType: 'Superior Lake View',
    roomNumber: '301',
    bookingChannel: 'direct',
    totalSpend: 920,
    status: 'checked-in',
  },
  {
    id: 'stay-2',
    guestId: 'guest-2',
    propertyId: 'prop-1',
    checkIn: '2025-02-02',
    checkOut: '2025-02-06',
    roomType: 'Standard Double',
    roomNumber: '205',
    bookingChannel: 'booking.com',
    totalSpend: 540,
    status: 'checked-in',
  },
  {
    id: 'stay-3',
    guestId: 'guest-3',
    propertyId: 'prop-1',
    checkIn: '2025-01-28',
    checkOut: '2025-02-01',
    roomType: 'Standard Single',
    roomNumber: '102',
    bookingChannel: 'expedia',
    totalSpend: 380,
    status: 'checked-out',
  },
  {
    id: 'stay-4',
    guestId: 'guest-4',
    propertyId: 'prop-1',
    checkIn: '2025-02-03',
    checkOut: '2025-02-08',
    roomType: 'Junior Suite',
    roomNumber: '401',
    bookingChannel: 'direct',
    totalSpend: 1450,
    status: 'checked-in',
  },
  {
    id: 'stay-5',
    guestId: 'guest-5',
    propertyId: 'prop-1',
    checkIn: '2025-02-04',
    checkOut: '2025-02-07',
    roomType: 'Deluxe Double',
    roomNumber: '308',
    bookingChannel: 'direct',
    totalSpend: 780,
    status: 'upcoming',
  },
  {
    id: 'stay-6',
    guestId: 'guest-6',
    propertyId: 'prop-1',
    checkIn: '2025-01-25',
    checkOut: '2025-01-29',
    roomType: 'Standard Double',
    roomNumber: '210',
    bookingChannel: 'booking.com',
    totalSpend: 520,
    status: 'checked-out',
  },
  {
    id: 'stay-7',
    guestId: 'guest-7',
    propertyId: 'prop-1',
    checkIn: '2025-02-01',
    checkOut: '2025-02-03',
    roomType: 'Business Suite',
    roomNumber: '502',
    bookingChannel: 'direct',
    totalSpend: 680,
    status: 'checked-out',
  },
  {
    id: 'stay-8',
    guestId: 'guest-8',
    propertyId: 'prop-1',
    checkIn: '2025-01-20',
    checkOut: '2025-01-22',
    roomType: 'Standard Single',
    roomNumber: '105',
    bookingChannel: 'airbnb',
    totalSpend: 280,
    status: 'checked-out',
  },
  // New guests with no feedback - will show "Not enough data"
  {
    id: 'stay-9',
    guestId: 'guest-9',
    propertyId: 'prop-1',
    checkIn: '2025-02-04',
    checkOut: '2025-02-06',
    roomType: 'Standard Double',
    roomNumber: '215',
    bookingChannel: 'booking.com',
    totalSpend: 420,
    status: 'upcoming',
  },
  {
    id: 'stay-10',
    guestId: 'guest-10',
    propertyId: 'prop-1',
    checkIn: '2025-02-05',
    checkOut: '2025-02-07',
    roomType: 'Standard Single',
    roomNumber: '108',
    bookingChannel: 'direct',
    totalSpend: 380,
    status: 'upcoming',
  },
];

// Feedback
export const feedback: Feedback[] = [
  {
    id: 'fb-1',
    guestId: 'guest-1',
    stayId: 'stay-1',
    propertyId: 'prop-1',
    source: 'survey',
    date: '2025-01-30',
    rating: 9,
    npsScore: 9,
    sentiment: 'positive',
    themes: ['staff', 'location', 'cleanliness'],
    summary: 'Eccellente servizio, personale molto cordiale. Vista lago stupenda.',
    fullText: 'Ho soggiornato per la quarta volta e come sempre il servizio è stato impeccabile. Il personale alla reception è sempre disponibile e cordiale. La pulizia delle camere è ottima e la vista sul lago è semplicemente stupenda. Consiglio vivamente!',
    language: 'it',
    status: 'responded',
    responseText: 'Grazie mille Marco! Siamo felici di averti ospitato ancora una volta.',
    respondedAt: '2025-01-31',
  },
  {
    id: 'fb-2',
    guestId: 'guest-3',
    stayId: 'stay-3',
    propertyId: 'prop-1',
    source: 'tripadvisor',
    date: '2025-02-01',
    rating: 2,
    npsScore: 4,
    sentiment: 'negative',
    themes: ['noise', 'room-condition', 'value'],
    summary: 'Room was noisy, outdated furnishings. Not worth the price.',
    fullText: 'Very disappointed with my stay. The room was directly above the restaurant and we could hear everything until late. The furniture looks tired and dated. For the price we paid, I expected much better. WiFi was also unreliable.',
    language: 'en',
    status: 'in-review',
    assignedTo: 'user-2',
  },
  {
    id: 'fb-3',
    guestId: 'guest-4',
    stayId: 'stay-4',
    propertyId: 'prop-1',
    source: 'google',
    date: '2025-02-02',
    rating: 10,
    npsScore: 10,
    sentiment: 'positive',
    themes: ['spa', 'dining', 'service', 'room'],
    summary: 'Perfetto! La spa è fantastica, ristorante eccellente.',
    language: 'it',
    status: 'new',
  },
  {
    id: 'fb-4',
    guestId: 'guest-6',
    stayId: 'stay-6',
    propertyId: 'prop-1',
    source: 'booking.com',
    date: '2025-01-30',
    rating: 7,
    npsScore: 6,
    sentiment: 'neutral',
    themes: ['breakfast', 'location'],
    summary: 'Good location, breakfast could be more varied. Overall pleasant.',
    language: 'en',
    status: 'responded',
    responseText: 'Thank you for your feedback! We are working on expanding our breakfast options.',
    respondedAt: '2025-01-31',
  },
  {
    id: 'fb-5',
    guestId: 'guest-8',
    stayId: 'stay-8',
    propertyId: 'prop-1',
    source: 'survey',
    date: '2025-01-23',
    rating: 3,
    npsScore: 3,
    sentiment: 'negative',
    themes: ['check-in', 'communication', 'cleanliness'],
    summary: 'Check-in chaos, room not ready, bathroom not properly cleaned.',
    fullText: 'Arrived at 3pm as agreed but room was not ready until 5pm. No apology or explanation. When we finally got in, the bathroom had not been properly cleaned. Very frustrating experience.',
    language: 'en',
    status: 'escalated',
    assignedTo: 'user-4',
  },
];

// Upsell Opportunities
export const upsellOpportunities: UpsellOpportunity[] = [
  {
    id: 'upsell-1',
    guestId: 'guest-1',
    stayId: 'stay-1',
    type: 'spa',
    title: 'Spa Package Suggestion',
    description: 'Marco has mentioned spa interest in 3 previous stays. Offer the Wellness Weekend package?',
    confidence: 0.89,
    basedOn: 'Past feedback themes, booking patterns',
    status: 'suggested',
  },
  {
    id: 'upsell-2',
    guestId: 'guest-4',
    stayId: 'stay-4',
    type: 'dining',
    title: 'Fine Dining Reservation',
    description: 'Elena is a VIP guest who loves fine dining. Suggest chef\'s table experience?',
    confidence: 0.92,
    basedOn: 'Guest preferences, lifetime value',
    status: 'offered',
  },
  {
    id: 'upsell-3',
    guestId: 'guest-5',
    stayId: 'stay-5',
    type: 'experience',
    title: 'Wine Tasting Tour',
    description: 'Pierre has wine-tasting in preferences. Partner vineyard tour available during stay.',
    confidence: 0.78,
    basedOn: 'Guest preferences',
    status: 'suggested',
  },
  {
    id: 'upsell-4',
    guestId: 'guest-2',
    type: 'return-booking',
    title: 'Return Stay Offer',
    description: 'Sophie\'s last feedback was neutral. Offer 15% discount for rebooking to improve sentiment?',
    confidence: 0.65,
    basedOn: 'Sentiment analysis, booking history',
    status: 'suggested',
  },
];

// Dashboard KPIs
export const dashboardKPIs: DashboardKPIs = {
  npsScore: 42,
  npsTrend: 5,
  responseRate: 78,
  responseRateTrend: -3,
  reviewVolume: 156,
  reviewVolumeTrend: 12,
  sentimentDistribution: {
    positive: 58,
    neutral: 27,
    negative: 15,
  },
  unresolvedFeedback: 8,
  pendingResponses: 3,
};

// Alerts
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Negative Review Spike',
    message: 'Check-in complaints increased 30% this week compared to last month.',
    severity: 'high',
    createdAt: '2025-02-02T10:30:00Z',
    read: false,
    actionUrl: '/guest-relations/feedback',
  },
  {
    id: 'alert-2',
    title: 'VIP Guest Arriving',
    message: 'Elena B. (Lifetime value €5,600) checking in tomorrow. Previous NPS: 10.',
    severity: 'medium',
    createdAt: '2025-02-02T08:00:00Z',
    read: false,
    actionUrl: '/receptionist/guests/guest-4',
  },
  {
    id: 'alert-3',
    title: 'Response Rate Declining',
    message: 'Survey response rate dropped from 81% to 78% this month.',
    severity: 'low',
    createdAt: '2025-02-01T14:00:00Z',
    read: true,
  },
];

// Incidents
export const incidents: Incident[] = [
  {
    id: 'incident-1',
    category: 'urgent-feedback',
    title: 'Guest complaint escalation',
    description: 'James W. posted negative review on TripAdvisor mentioning specific staff member.',
    severity: 'high',
    status: 'investigating',
    reportedBy: 'user-2',
    reportedAt: '2025-02-01T16:30:00Z',
  },
  {
    id: 'incident-2',
    category: 'system',
    title: 'PMS sync delay',
    description: 'Guest data sync from Opera PMS delayed by 2 hours.',
    severity: 'medium',
    status: 'resolved',
    reportedBy: 'user-5',
    reportedAt: '2025-01-30T09:15:00Z',
    resolvedAt: '2025-01-30T11:45:00Z',
    resolution: 'API connection reset, manual sync triggered.',
  },
];

// Campaigns
export const campaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Spring Return Guest Offer',
    type: 'email',
    status: 'scheduled',
    segmentCriteria: {
      sentiments: ['positive', 'neutral'],
      minNps: 7,
      stayRecency: 'last-90',
    },
    scheduledAt: '2025-02-15T09:00:00Z',
  },
  {
    id: 'campaign-2',
    name: 'Spa Weekend Promotion',
    type: 'email',
    status: 'active',
    segmentCriteria: {
      preferences: ['spa', 'wellness'],
      minNps: 6,
    },
    sentAt: '2025-01-28T10:00:00Z',
    metrics: {
      sent: 245,
      delivered: 238,
      opened: 89,
      clicked: 34,
      unsubscribed: 2,
    },
  },
  {
    id: 'campaign-3',
    name: 'Recovery Outreach',
    type: 'email',
    status: 'draft',
    segmentCriteria: {
      sentiments: ['negative'],
      maxNps: 5,
      stayRecency: 'last-30',
    },
  },
];

// Audit Log
export const auditLog: AuditLogEntry[] = [
  {
    id: 'audit-1',
    userId: 'user-2',
    userName: 'Marco Bianchi',
    action: 'Responded to review',
    entity: 'Feedback',
    entityId: 'fb-1',
    timestamp: '2025-01-31T14:22:00Z',
  },
  {
    id: 'audit-2',
    userId: 'user-4',
    userName: 'Alessandro Conti',
    action: 'Escalated feedback',
    entity: 'Feedback',
    entityId: 'fb-5',
    details: 'Escalated to management for compensation decision',
    timestamp: '2025-01-24T09:15:00Z',
  },
  {
    id: 'audit-3',
    userId: 'user-3',
    userName: 'Francesca Verdi',
    action: 'Created campaign',
    entity: 'Campaign',
    entityId: 'campaign-1',
    timestamp: '2025-02-01T11:30:00Z',
  },
  {
    id: 'audit-4',
    userId: 'user-5',
    userName: 'Roberto Esposito',
    action: 'Updated user role',
    entity: 'User',
    entityId: 'user-1',
    details: 'Changed role from staff to receptionist',
    timestamp: '2025-01-29T16:45:00Z',
  },
];

// Helper functions
export function getGuestById(id: string): Guest | undefined {
  return guests.find(g => g.id === id);
}

export function getStaysByGuestId(guestId: string): Stay[] {
  return stays.filter(s => s.guestId === guestId);
}

export function getFeedbackByGuestId(guestId: string): Feedback[] {
  return feedback.filter(f => f.guestId === guestId);
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find(p => p.id === id);
}

export function getCurrentGuests(): Guest[] {
  const currentStays = stays.filter(s => s.status === 'checked-in');
  return currentStays.map(s => getGuestById(s.guestId)).filter(Boolean) as Guest[];
}

export function getUpcomingArrivals(): Stay[] {
  return stays.filter(s => s.status === 'upcoming');
}

export function getRecentDepartures(): Stay[] {
  return stays.filter(s => s.status === 'checked-out');
}

export function getUnresolvedFeedback(): Feedback[] {
  return feedback.filter(f => f.status !== 'resolved' && f.status !== 'responded');
}
