

# Tourism Post-Stay Intelligence Platform - Development Plan

## Project Vision
A privacy-first, GDPR-compliant staff console for Italian hospitality SMEs that transforms fragmented post-stay guest management into a unified, intelligent workflow. This platform will help hotels, B&Bs, and resorts manage guest feedback, sentiment analysis, and upselling opportunities.

---

## Development Phases

### 🔹 Phase 1: Foundation & Layout (Sprint 1)
**Goal:** Establish the application shell with navigation and role-based structure

**What we'll build:**
- **Hybrid navigation system** - Collapsible sidebar with role icons + tabbed content areas
- **Login/Role selection screen** - Demo mode to switch between user roles (Receptionist, Guest Relations, Marketing, Manager, Admin)
- **Core layout shell** - Professional, minimal design with subtle hospitality accent colors
- **Responsive structure** - Works on desktop and tablet for staff use

---

### 🔹 Phase 2: Receptionist Console (Sprint 2)
**Goal:** Front desk view for daily guest operations

**Key screens:**
- **Guest list view** - Current arrivals/departures with search and filters
- **Guest timeline card** - Stay history, past feedback themes, NPS score badges
- **Sentiment indicators** - Visual green/yellow/red badges for quick assessment
- **Upsell prompt cards** - "Guest mentioned spa interest – offer package?" suggestions
- **Quick feedback summary** - Theme keywords and recent sentiment without full text

**Sample data:** Realistic Italian hotel guests (e.g., "Marco R." at "Hotel Bellavista, Lago di Garda")

---

### 🔹 Phase 3: Guest Relations Console (Sprint 3)
**Goal:** Customer service manager's feedback management hub

**Key screens:**
- **Feedback inbox** - Unresolved negative feedback queue with priority sorting
- **Guest timeline view** - Complete history across all stays, surveys, reviews
- **AI response drafts panel** - Placeholder for AI-generated responses with edit capability
- **Escalation workflow** - Mark as resolved, forward to manager, trigger compensation buttons
- **Review response composer** - Rich text editor with template suggestions

---

### 🔹 Phase 4: Manager Dashboard (Sprint 4)
**Goal:** Strategic overview with KPIs and actionable insights

**Key visualizations:**
- **KPI tiles** - NPS trend, response rate, review volume, sentiment distribution
- **Alert panel** - Incidents, anomalies requiring staff action
- **Insight cards** - AI-style observations ("Check-in complaints +30% this month")
- **Trend charts** - Using Recharts for sentiment over time, feedback volume
- **Property benchmarks** - Comparative metrics (placeholder for multi-property)

---

### 🔹 Phase 5: Marketing Console (Sprint 5)
**Goal:** Campaign and consent management interface

**Key screens:**
- **Segment builder** - Filter by sentiment, preferences, booking channel, recency
- **Campaign scheduler** - Email/SMS/WhatsApp campaign builder with preview
- **Consent dashboard** - Opt-in rates, unsubscribe tracking, GDPR compliance status
- **Campaign list** - Active, scheduled, and completed campaigns with metrics

---

### 🔹 Phase 6: Admin & Cross-Cutting Features (Sprint 6)
**Goal:** System administration and shared functionality

**Key screens:**
- **User management** - RBAC matrix visualization, invite users, assign roles
- **Audit log viewer** - Action history with filters by user, date, entity
- **Incident tracker** - Log with categories (data breach, AI error, urgent feedback)
- **PMS integration status** - Connection health, last sync, error alerts (mock)
- **Settings panel** - Property configuration, consent policy versions

---

## Data Structure (Mock)
We'll create realistic Italian hotel mock data including:
- **3-5 sample properties** (Hotel Bellavista, Pensione Il Giardino, Resort Mare Azzurro)
- **20-30 guest profiles** with Italian names and pseudonymized keys
- **Sample stays** with check-in/out dates, room types, channels
- **Feedback samples** in Italian and English with varied sentiments
- **Pre-analyzed sentiment scores and theme tags**

---

## Design Principles
- **Professional & Minimal** - Clean lines, subtle shadows, enterprise-grade feel
- **Hospitality-appropriate colors** - Warm neutrals with a sophisticated accent
- **Information hierarchy** - Critical data prominent, details on-demand
- **Accessibility** - Clear contrast, readable typography, keyboard navigation

---

## Technical Approach
- React + TypeScript with existing Shadcn UI components
- Hybrid sidebar using the existing sidebar component
- Recharts for dashboard visualizations
- Mock data layer with realistic structure (easily replaceable with real API)
- Component-based architecture ready for backend integration

---

## Future-Ready Placeholders
- AI sentiment analysis badges (clickable for "Coming soon" modal)
- AI response draft generation button (shows mock output)
- PMS webhook status indicators
- Multi-language toggle (IT/EN)

