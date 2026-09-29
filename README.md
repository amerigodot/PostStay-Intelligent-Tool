# PostStay Intelligence Platform

**Privacy-First Post-Stay Intelligence & Experience Governance for Distinguished Hospitality**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2-green.svg)](https://vitest.dev/)
[![GDPR Compliant](https://img.shields.io/badge/GDPR-Article%2025%20%26%2032-emerald.svg)]()

PostStay Intelligence is an enterprise-grade staff console designed to orchestrate systematic post-stay engagement for distinguished hospitality properties, luxury palace hotels, and boutique resorts. It resolves the "diffuse usage without system" paradox in hospitality AI by coupling Property Management System (PMS) event webhooks with automated micro-surveys, multi-dimensional sentiment scoring, and calibrated AI response drafting—all anchored in an architectural pseudonymization framework that guarantees zero PII leakage to LLM providers.

---

## 🏛️ Distinguished Establishments Showcase

The working demo is configured with authentic multi-lingual post-stay reviews, guest personas, and operational scenarios from world-acclaimed European properties:

1. **Villa d'Este** *(Cernobbio, Lago di Como)* — 16th-century Renaissance palace, private Riva Aquarama transfers, lakeside veranda dining, and Queen Pavilion acoustic quiet-hour governance.
2. **Aman Venice** *(Palazzo Papadopoli, Canal Grande)* — Rococo stuccos, Tiepolo frescoes, private water gate arrivals, and zero-voucher public billing discretion.
3. **Belmond Hotel Caruso** *(Ravello, Amalfi Coast)* — 11th-century cliffside palace suspended 350m above the Tyrrhenian Sea, Belvedere restaurant, and executive anniversary recovery workflows.
4. **Borgo Egnazia** *(Savelletri di Fasano, Puglia)* — Sculpted Tufo limestone citadel, Vair Spa traditional rituals, Due Camini Michelin gastronomy, and Cala Masciola beach club logistics.
5. **Forestis Dolomites** *(Plose, Bressanone)* — Minimalist alpine sanctuary at 1,800m altitude, Celtic tree sauna ceremonies, pure spring water, and plant-forward culinary philosophies.

---

## 🔒 Privacy-by-Design Architecture

```
┌─────────────────┐       TLS 1.3       ┌────────────────────────┐
│ Opera / Mews    │ ──────────────────> │  Identity Vault        │
│ PMS Webhook     │                     │  (Air-Gapped PII DB)   │
└─────────────────┘                     └──────────┬─────────────┘
                                                   │ HMAC-SHA256
                                                   ▼
┌─────────────────┐    Zero-PII Payload ┌────────────────────────┐
│ Localized AI    │ <────────────────── │  Operational DB        │
│ Sentiment Engine│                     │  (Token: GK-VDE-8491A) │
└────────┬────────┘                     └──────────┬─────────────┘
         │                                         │
         │ Multi-Tone Drafts                       │ Staff Console
         ▼                                         ▼
┌────────────────────────────────────────────────────────────────┐
│  Frontend Staff Console (Human-in-the-Loop Validation)         │
│  Receptionist • Guest Relations • Marketing • GM • DPO         │
└────────────────────────────────┬───────────────────────────────┘
                                 │ Approved Dispatch
                                 ▼
                     ┌───────────────────────┐
                     │ Encrypted Audit Trail │
                     │ & Outbox Relay        │
                     └───────────────────────┘
```

* **Identity Vault Isolation:** Raw guest identity (name, email, phone) is sequestered in an air-gapped vault. A salted cryptographic hash mints a pseudonymous `guest_key` (e.g. `GK-VDE-8491A`).
* **Zero-PII AI Layer:** LLM sentiment analysis and response generation operate exclusively on sanitized feedback texts and stay attributes.
* **Tamper-Evident Audit Ledger:** Every de-pseudonymization request or vault inspection triggers an immutable log entry with operator ID, cryptographic entity hash, and client IP.
* **Interactive Vault Shield:** The console includes a live **PII Shield** toggle allowing evaluators to switch between *Tokenized Privacy Mode* and *Operational Staff Mode*.

---

## 👥 Role-Based Access Control (RBAC)

* **Receptionist Console:** In-house patron directory, expected arrivals, stay history, past sentiment badges, and predictive upsell prompts (Riva boat charters, private spa suites).
* **Guest Relations Officer:** Unresolved feedback inbox, priority triage for negative feedback, interactive AI response co-pilot (Diplomatic Haute Luxury, Warm Concierge, Executive Recovery, Concise Brevity), and guest dossier inspection.
* **General Manager:** High-level KPIs (NPS +84, 91% response rate), weekly trend area charts, multi-property luxury benchmark comparison, and automated executive AI synthesis.
* **Marketing & Loyalty Director:** GDPR Article 6 & 9 consent governance dashboard, interactive segment builder with live patron count, and curated campaign scheduler.
* **Compliance & System Admin:** Tamper-evident audit ledger, incident resolution tracker, PMS connector telemetry (Oracle Opera Cloud, Mews), and vault salt rotation.

---

## 🛠️ Technology Stack

* **Core:** React 18, TypeScript 5.8, Vite 5.4
* **UI & Styling:** Tailwind CSS, shadcn/ui (Radix UI primitives), Lucide React
* **Data Visualizations:** Recharts (Area charts, Bar benchmarks, Pie distributions)
* **State Management:** Reactive Domain Context (`HospitalityDataContext`), Role Context (`RoleContext`)
* **Feedback & Notifications:** Sonner Toast Engine
* **Testing:** Vitest, React Testing Library, Jest DOM

---

## 🚀 Quickstart & Verification

### 1. Installation
```bash
git clone https://github.com/amerigodot/PMS-hospitality-tool.git
cd PMS-hospitality-tool
npm install
```

### 2. Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:8080`.

### 3. Verification & Tests
```bash
npm test        # Runs Vitest unit & domain test suite
npm run lint    # Runs ESLint checks
npm run build   # Production Vite bundle build
```

---

## 🎮 Interactive Demo Controls

The top navigation bar provides interactive controls to evaluate the platform in real time:
1. **Estate Selector:** Filter between *Unified Luxury Portfolio* and specific properties (Villa d'Este, Aman Venice, Belmond Caruso, Borgo Egnazia, Forestis Dolomites).
2. **Role Quick-Switcher:** Seamlessly toggle between Receptionist, Guest Relations, Marketing, Manager, and Admin.
3. **Vault Shield Button:** Toggle live between pseudonymized token keys and operational guest names.
4. **Simulate Event Button:** Ingest live checkout micro-surveys into the operational inbox to test real-time sentiment scoring and AI drafting.
5. **Architecture Button:** Launch the interactive Zero-Knowledge & Privacy-by-Design pipeline modal.