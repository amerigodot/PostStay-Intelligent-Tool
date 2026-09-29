# Gemini Project Context: PostStay Intelligence Platform

## Project Overview

**PostStay Intelligence** is a privacy-first hospitality management platform designed to orchestrate systematic post-stay engagement. It addresses the "diffuse usage without system" paradox in AI adoption within the hospitality sector by integrating Property Management Systems (PMS), automating feedback collection, and providing AI-powered sentiment analysis—all while maintaining strict GDPR compliance and data governance.

**Current Repository Scope:** This repository contains the **Frontend Staff Console** (React/Vite) implementation of the platform.

### Core Value Proposition
*   **Unified Workflow:** Transforms fragmented processes into a cohesive cycle: Checkout → Survey → Follow-up → AI Analysis.
*   **Privacy by Design:** Implements architectural pseudonymization. AI components never receive directly identifiable information (PII).
*   **Governance-First AI:** Centralized feedback analysis with role-based access, logging, and human-in-the-loop validation.

## Architecture & Workflows

The platform implements a four-stage workflow triggered by guest checkout:

1.  **Checkout Event:** PMS registers checkout; system generates a pseudonymous `guest_key`.
2.  **Survey Dispatch:** Automated micro-survey (NPS + open text) sent via personalized channels (T+2 hours).
3.  **Feedback Follow-up:** Automated reminders or thank-you messages; upsell triggers based on sentiment (T+7 days).
4.  **AI Analysis:** Continuous text classification (themes), sentiment scoring, and anomaly detection.

### Privacy Architecture
*   **Identity Vault:** Stores `guest_key` ↔ PII mapping, accessible only to the Backend service.
*   **Operational DB:** Uses `guest_key` for all logic; no PII exposure.
*   **AI Layer:** Processes anonymized text fragments and stay attributes only.

## Technology Stack (Frontend Console)

*   **Framework:** React (Vite)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn-ui (Radix UI primitives)
*   **Routing:** React Router DOM
*   **State Management:** React Query (TanStack Query), React Context (`RoleContext`)
*   **Charts:** Recharts (for Dashboard KPIs)
*   **Icons:** Lucide React
*   **Mocking:** `src/data/mockData.ts` (Prototypes the backend API responses)

*(Backend Stack referenced in Blueprint: Node.js/Python, PostgreSQL, Redis, OpenAI/HuggingFace - currently mocked in this frontend repo)*

## Directory Structure

*   `src/components/`: Reusable UI components.
    *   `layout/`: `AppSidebar` (Role-based navigation), `MainLayout`.
    *   `shared/`: Domain components (e.g., `SentimentBadge`, `NpsScoreBadge`).
    *   `ui/`: shadcn-ui primitives.
*   `src/contexts/`: `RoleContext.tsx` (Manages user roles: Receptionist, Manager, etc.).
*   `src/data/`: `mockData.ts` (Simulates the Operational DB and Identity Vault responses).
*   `src/pages/`: Role-specific dashboards.
    *   `receptionist/`: Guest lists, arrivals, upsell prompts.
    *   `guest-relations/`: Feedback inbox, response templates, guest timelines.
    *   `marketing/`: Campaign management, segmentation, consent dashboard.
    *   `manager/`: High-level KPIs, alerts, reports.
    *   `admin/`: User management, audit logs, incident tracking.
*   `src/types/`: Domain models (`Guest`, `Stay`, `Feedback`, `Incident`, etc.).

## Key Features & Roles (RBAC)

*   **Receptionist:**
    *   **Focus:** Operational guest handling.
    *   **Features:** View guest list (pseudonymized), past-stay sentiment badges, upsell prompts.
*   **Guest Relations:**
    *   **Focus:** Feedback management and recovery.
    *   **Features:** Unresolved feedback inbox, AI-drafted responses (human-review required), guest timelines.
*   **Marketing:**
    *   **Focus:** Growth and engagement.
    *   **Features:** Segment builder (sentiment/preference based), campaign scheduler, consent management.
*   **Manager:**
    *   **Focus:** Strategic oversight.
    *   **Features:** KPI tiles (NPS, Response Rate), system alerts, comparative benchmarks.
*   **Admin:**
    *   **Focus:** System governance.
    *   **Features:** User management, audit log inspection, incident resolution, PMS integration config.

## Development Conventions

*   **Path Aliases:** Use `@/` for `src/`.
*   **Data Privacy (Simulated):** Even in frontend code, refer to guests by ID or pseudonymized keys where possible.
*   **Styling:** Mobile-first Tailwind CSS.
*   **Role Hooks:** Always use `useRole()` to gate features or navigation.

## Build & Run Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server. |
| `npm run build` | Build for production. |
| `npm test` | Run Vitest suite. |
| `npm run lint` | Run ESLint. |

## Reference Documentation
*   **Blueprint:** `Tourism Staff Tool.docx` (Detailed Technical Blueprint & Privacy Specs)