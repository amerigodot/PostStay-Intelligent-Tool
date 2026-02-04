/**
 * Pseudonymisation Architecture for Privacy by Design
 * 
 * This module ensures AI components never process raw PII by separating:
 * 1. Identity Vault (encrypted PII) - Only accessible to authorized staff
 * 2. Analytics Profile (pseudonymised) - Safe for AI/ML processing
 * 
 * The pseudonymizedKey acts as the link between the two layers.
 */

import type { Guest, SentimentScore, Feedback } from '@/types';
import { feedback as allFeedback } from '@/data/mockData';

// Minimum data points required for reliable sentiment analysis
const MIN_FEEDBACK_COUNT_FOR_SENTIMENT = 1;
const MIN_STAYS_FOR_TREND = 2;

/**
 * Analytics-safe guest profile - contains NO direct PII
 * Safe to pass to AI components for sentiment analysis, recommendations, etc.
 */
export interface PseudonymisedGuestProfile {
  pseudonymizedKey: string;
  nationality: string;
  language: 'it' | 'en' | 'de' | 'fr';
  totalStays: number;
  lifetimeValueBand: 'standard' | 'premium' | 'vip';
  preferences: string[];
  consentForAnalytics: boolean;
  sentimentSummary: SentimentSummary;
}

/**
 * Sentiment summary with data sufficiency indicator
 */
export interface SentimentSummary {
  hasEnoughData: boolean;
  sentiment?: SentimentScore;
  npsCategory?: 'promoter' | 'passive' | 'detractor';
  feedbackCount: number;
  lastFeedbackDate?: string;
}

/**
 * Identity Vault record - contains PII, encrypted at rest
 * Only accessible through authorized staff actions
 */
export interface IdentityVaultRecord {
  pseudonymizedKey: string;
  firstName: string;
  lastInitial: string;
  email?: string;
  phone?: string;
}

/**
 * Converts a full Guest record into a pseudonymised profile safe for AI processing
 */
export function createPseudonymisedProfile(guest: Guest): PseudonymisedGuestProfile {
  return {
    pseudonymizedKey: guest.pseudonymizedKey,
    nationality: guest.nationality,
    language: guest.language,
    totalStays: guest.totalStays,
    lifetimeValueBand: getLifetimeValueBand(guest.lifetimeValue),
    preferences: guest.preferences,
    consentForAnalytics: guest.consentStatus.analytics,
    sentimentSummary: calculateSentimentSummary(guest),
  };
}

/**
 * Extracts identity vault record from guest - this stays encrypted/protected
 */
export function extractIdentityVault(guest: Guest): IdentityVaultRecord {
  return {
    pseudonymizedKey: guest.pseudonymizedKey,
    firstName: guest.firstName,
    lastInitial: guest.lastInitial,
    email: guest.email,
    phone: guest.phone,
  };
}

/**
 * Categorizes lifetime value into bands for privacy-preserving analytics
 */
function getLifetimeValueBand(value: number): 'standard' | 'premium' | 'vip' {
  if (value >= 3000) return 'vip';
  if (value >= 1500) return 'premium';
  return 'standard';
}

/**
 * Calculates sentiment summary with data sufficiency check
 * Returns "Not enough data" indicator when insufficient feedback exists
 */
export function calculateSentimentSummary(guest: Guest): SentimentSummary {
  const guestFeedback = allFeedback.filter(f => f.guestId === guest.id);
  const feedbackCount = guestFeedback.length;
  
  // Check if we have enough data for reliable sentiment
  const hasEnoughData = feedbackCount >= MIN_FEEDBACK_COUNT_FOR_SENTIMENT && 
                        guest.totalStays >= MIN_STAYS_FOR_TREND;
  
  if (!hasEnoughData) {
    return {
      hasEnoughData: false,
      feedbackCount,
    };
  }
  
  // Calculate NPS category from score
  const npsCategory = guest.npsScore !== undefined 
    ? getNpsCategory(guest.npsScore) 
    : undefined;
  
  // Get most recent feedback date
  const sortedFeedback = [...guestFeedback].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return {
    hasEnoughData: true,
    sentiment: guest.sentimentTrend,
    npsCategory,
    feedbackCount,
    lastFeedbackDate: sortedFeedback[0]?.date,
  };
}

/**
 * Converts NPS score to category
 */
function getNpsCategory(score: number): 'promoter' | 'passive' | 'detractor' {
  if (score >= 9) return 'promoter';
  if (score >= 7) return 'passive';
  return 'detractor';
}

/**
 * Checks if a guest has provided consent for AI-powered features
 */
export function hasAIConsent(guest: Guest): boolean {
  return guest.consentStatus.analytics;
}

/**
 * Gets display-safe guest identifier (first name + initial only)
 */
export function getDisplayName(guest: Guest): string {
  return `${guest.firstName} ${guest.lastInitial}.`;
}

/**
 * Masks email for privacy-conscious display
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***@***.***';
  const maskedLocal = local.slice(0, 2) + '***';
  return `${maskedLocal}@${domain}`;
}
