# PostStay Intelligence Platform

**Privacy-First Post-Stay Management for Hospitality SMEs**

PostStay Intelligence is a comprehensive dashboard designed to orchestrate systematic post-stay engagement. It bridges the gap between Property Management Systems (PMS) and guest satisfaction by automating feedback collection, providing AI-powered sentiment analysis, and enabling privacy-compliant upselling—all within a strict governance framework.

> **Note:** This repository contains the **Frontend Staff Console** implementation.

## 🚀 Key Features

*   **Role-Based Consoles:** Tailored interfaces for Receptionists, Guest Relations, Marketing, Managers, and Admins.
*   **Privacy by Design:** Architectural pseudonymization ensures AI components never process raw PII.
*   **AI-Powered Insights:** Automated sentiment scoring, theme classification, and anomaly detection.
*   **Unified Workflow:** Seamlessly manages the Checkout → Survey → Follow-up → Analysis cycle.
*   **Governance & Compliance:** Full audit logging, incident management, and GDPR-compliant consent handling.

## 👥 User Roles

1.  **Receptionist:** View daily arrivals with past sentiment context; manage on-site upsell opportunities.
2.  **Guest Relations:** Handle feedback inbox; review AI-drafted responses; manage guest recovery.
3.  **Marketing:** Create segments based on sentiment and preferences; schedule multi-channel campaigns.
4.  **Manager:** Monitor high-level KPIs (NPS, Response Rate); oversee system alerts and reporting.
5.  **Admin:** Manage users, integrations, and audit logs.

## 🛠️ Tech Stack

*   **Framework:** React 18 (Vite)
*   **Language:** TypeScript
*   **UI System:** [shadcn-ui](https://ui.shadcn.com/) + Tailwind CSS
*   **State Management:** TanStack Query + React Context
*   **Icons:** Lucide React
*   **Testing:** Vitest + React Testing Library

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or bun

### Installation

1.  **Clone the repository**
    ```sh
    git clone <YOUR_GIT_URL>
    cd PMS-hospitality-tool
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Start the development server**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

### Building for Production

```sh
npm run build
```

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── layout/         # App shell and sidebar
│   └── ui/             # Shadcn primitives
├── contexts/           # React Context (RoleProvider)
├── data/               # Mock data (Simulated Backend)
├── pages/              # Role-specific dashboards
│   ├── admin/
│   ├── guest-relations/
│   ├── manager/
│   ├── marketing/
│   └── receptionist/
└── types/              # Domain models (Guest, Stay, Feedback)
```

## 📄 Documentation

For a detailed technical blueprint, architectural diagrams, and privacy specifications, please refer to the internal documentation: `Tourism Staff Tool.docx`.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

*Built with ❤️ for the Hospitality Industry.*