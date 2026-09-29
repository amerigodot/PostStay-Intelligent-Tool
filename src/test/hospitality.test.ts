import { describe, it, expect } from 'vitest';
import { 
  properties, 
  guests, 
  stays, 
  feedback, 
  upsellOpportunities, 
  getGuestById, 
  getPropertyById, 
  getFeedbackByPropertyId 
} from '@/data/mockData';

describe('PostStay Intelligence • Distinguished Establishments Domain', () => {
  it('loads all 5 distinguished luxury establishments', () => {
    expect(properties).toHaveLength(5);
    const names = properties.map(p => p.name);
    expect(names).toContain("Villa d'Este");
    expect(names).toContain('Aman Venice');
    expect(names).toContain('Belmond Hotel Caruso');
    expect(names).toContain('Borgo Egnazia');
    expect(names).toContain('Forestis Dolomites');

    properties.forEach(p => {
      expect(p.stars).toBe(5);
      expect(p.npsBenchmark).toBeGreaterThanOrEqual(80);
      expect(p.tagline).toBeDefined();
    });
  });

  it('guarantees architectural pseudonymization for all guest records', () => {
    expect(guests.length).toBeGreaterThanOrEqual(8);
    guests.forEach(guest => {
      // Must follow tokenized pattern GK-[ESTATE]-[CODE]
      expect(guest.pseudonymizedKey).toMatch(/^GK-[A-Z]{3}-[0-9A-Z]+$/);
      // Must contain SHA-256 vault hash (64 hex characters)
      expect(guest.vaultHash).toHaveLength(64);
      expect(guest.consentStatus).toBeDefined();
      expect(typeof guest.consentStatus.marketing).toBe('boolean');
      expect(typeof guest.consentStatus.conciergeProfiling).toBe('boolean');
      expect(guest.lifetimeValue).toBeGreaterThan(0);
    });
  });

  it('provides multi-lingual authentic luxury reviews with AI response drafts', () => {
    expect(feedback.length).toBeGreaterThanOrEqual(8);
    const languages = feedback.map(f => f.language);
    expect(languages).toContain('it');
    expect(languages).toContain('en');
    expect(languages).toContain('fr');
    expect(languages).toContain('de');

    feedback.forEach(fb => {
      expect(['positive', 'neutral', 'negative']).toContain(fb.sentiment);
      expect(fb.themes.length).toBeGreaterThan(0);
      expect(fb.aiConfidence).toBeGreaterThanOrEqual(0.9);
      if (fb.aiDrafts) {
        expect(fb.aiDrafts.diplomatic).toBeDefined();
        expect(fb.aiDrafts.warm).toBeDefined();
        expect(fb.aiDrafts.recovery).toBeDefined();
        expect(fb.aiDrafts.concise).toBeDefined();
      }
    });
  });

  it('verifies helper querying by guest and property IDs', () => {
    const vde = getPropertyById('prop-vde');
    expect(vde).toBeDefined();
    expect(vde?.name).toBe("Villa d'Este");

    const guest1 = getGuestById('guest-1');
    expect(guest1).toBeDefined();
    expect(guest1?.pseudonymizedKey).toBe('GK-VDE-8491A');

    const vdeFeedback = getFeedbackByPropertyId('prop-vde');
    expect(vdeFeedback.length).toBeGreaterThanOrEqual(2);
  });

  it('maintains curated upsell opportunities with calibrated confidence scores', () => {
    expect(upsellOpportunities.length).toBeGreaterThanOrEqual(4);
    upsellOpportunities.forEach(upsell => {
      expect(upsell.confidence).toBeGreaterThanOrEqual(0.6);
      expect(upsell.confidence).toBeLessThanOrEqual(1.0);
      expect(['suggested', 'offered', 'accepted', 'declined']).toContain(upsell.status);
    });
  });
});
