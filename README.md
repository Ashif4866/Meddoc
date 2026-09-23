# PharmaPulse — AI-Powered Pharmacy Spike Tracker

> **From Pharmacy Data to Early Health Intelligence.**  
> *Detect demand spikes. Predict shortages. Act earlier.*  
> **Smart India Hackathon (SIH) Innovation Prototype**

---

## 1. Executive Summary & Vision

Traditional public health surveillance depends on hospital admission registries and clinical test confirmations, which lag actual disease transmission by 10 to 21 days. **PharmaPulse** transforms daily decentralized pharmacy point-of-sale (POS) and inventory transactions into real-time health intelligence signals.

By observing when citizens first seek over-the-counter and prescription symptomatic relief (antipyretics, rehydration salts, anti-infectives, respiratory formulations), PharmaPulse detects localized demand surges, forecasts supply chain stress, and flags syndromic co-surges weeks before hospital inundation.

> [!IMPORTANT]
> **The Analytical Signal Principle**: PharmaPulse explicitly distinguishes between an *analytical demand signal* and a *medical diagnosis*. An anomalous spike is never automatically asserted as proof of an outbreak; instead, it provides scientific phrasing (*"Unusual demand pattern"*, *"Elevated demand activity requiring further investigation"*) to empower targeted epidemiological investigation.

---

## 2. System Architecture

```
                                  ┌────────────────────────────────┐
                                  │   React + Vite + TypeScript    │
                                  │   Tailwind CSS + Lucide Icons  │
                                  │   Recharts + Interactive Maps  │
                                  └──────────────┬─────────────────┘
                                                 │ REST / JSON (JWT)
                                                 ▼
                                  ┌────────────────────────────────┐
                                  │    Node.js / Express API       │
                                  │  Prisma ORM + Zod Validation   │
                                  │   Role-Based Access Control    │
                                  └───────┬────────────────┬───────┘
                                          │                │
                      HTTP / JSON Queries │                │ Prisma Queries
                                          ▼                ▼
┌──────────────────────────────────────────────┐ ┌───────────────────┐
│     Python FastAPI AI Microservice           │ │ Database Storage  │
│ • Isolation Forest Outlier Detection         │ │ • PostgreSQL /    │
│ • Rolling Z-Score & Statistical Thresholding │ │   SQLite          │
│ • Holt-Winters 7/14/30-Day Forecaster        │ │ • 4,800+ Records  │
│ • Pearson Syndromic Correlation Matrix       │ │ • 26 Pharmacies   │
│ • Days-of-Supply (DoS) Depletion Engine      │ └───────────────────┘
└──────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Canvas Confetti |
| **Backend API** | Node.js, Express.js, TypeScript, Prisma ORM, JWT, bcryptjs, Zod |
| **AI / ML Service** | Python 3, FastAPI, scikit-learn (`IsolationForest`), pandas, NumPy, SciPy |
| **Database** | SQLite (zero-setup local default) / PostgreSQL (containerized) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 4. Key Platform Features

1. **Executive Intelligence Dashboard**:
   - 6 KPI metric cards with sparkline trends (2,548 Pharmacies Monitored, 18,426 SKUs, 17 Active Spikes, 4 Critical Alerts, 8 Shortage Risks, 94.7% AI Confidence).
   - 14-day aggregated demand trend vs historical baseline with 95% confidence interval area.
   - Interactive India geospatial radar preview and recent active spike table.

2. **AI Spike & Anomaly Detection Hub**:
   - Rolling Z-Score and Isolation Forest scoring.
   - Severity filtering (Critical, High, Warning, Normal).
   - Scientific non-diagnostic explanations and action workflows (*Investigate, Acknowledge, Resolve*).

3. **Geographic Intelligence Map**:
   - Geospatial visualization across Indian cities (*Chennai, Madurai, Coimbatore, Tiruchirappalli, Salem, Bengaluru, Hyderabad, Mumbai, Delhi, Kolkata*).
   - Pulsating heatmap rings indicating surge severity and district node telemetry.

4. **AI Demand Forecasting & Shortage Predictor**:
   - 7, 14, and 30-day forward demand projections with upper/lower bounds.
   - Days of Supply (DoS) depletion timeline and recommended safety reorder calculations.

5. **Decentralized Inventory & Stock Balancing Optimizer**:
   - Pharmacy stock monitors with automated inter-pharmacy stock transfer proposals to bridge immediate stockouts.

6. **Syndromic Correlation Radar & AI Copilot**:
   - Cross-medicine correlation matrix (e.g. Paracetamol + ORS co-surge detecting seasonal gastroenteritis patterns).
   - Built-in natural language AI Health Assistant answering live queries.

7. **Actionable Intelligence Reports**:
   - 1-Click generation of Public Health Surveillance Bulletins, Supply Chain Buffer Advisories, and Executive Summaries with print and CSV export.

8. **Live Outbreak Surge Simulator**:
   - 1-Click synthetic surge injector enabling live SIH jury demonstration of the entire anomaly pipeline.

---

## 5. Quickstart & Local Setup

### Prerequisites
- Node.js v18+ and npm
- Python 3.10+ (optional, internal analytical fallback engine included)

### 1. Clone & Install

```bash
# Clone the repository
cd pharmapulse

# Install Backend Dependencies
cd backend
npm install
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Run the Application

```bash
# Terminal 1: Start Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2: Start Frontend Dev Server (Port 5173)
cd frontend
npm run dev

# Terminal 3 (Optional): Start Python AI Service (Port 8000)
cd ai-service
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```

Open `http://localhost:5173` in your browser.

---

## 6. Demo Accounts (1-Click Login Available)

| Role | Email | Password | Primary Scope |
| :--- | :--- | :--- | :--- |
| **Health Officer** | `arjun.venkatesh@pharmapulse.health` | `password123` | Epidemiological surveillance & spike analysis |
| **Supply Chain Manager** | `rajesh.kumar@pharmapulse.health` | `password123` | Inventory runways, forecasts & shortage buffers |
| **Pharmacy Manager** | `priya.sundaram@pharmapulse.health` | `password123` | Retail stock levels & local demand monitoring |
| **System Admin** | `admin@pharmapulse.health` | `password123` | Full system settings & node management |

---

## 7. Docker Deployment

Launch all 4 microservices with Docker Compose:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- AI Microservice: `http://localhost:8000`

---

## 8. SIH Presentation Guide

When presenting to the Smart India Hackathon jury:
1. Open the **Landing Page** to demonstrate the product vision, 7-step architecture, and 10 platform capabilities.
2. Click **"Live Prototype"** or use the **1-Click Demo Login** for Dr. Arjun (Health Officer).
3. Review the **Dashboard KPIs** and the **14-day demand surge** chart vs 30-day baseline.
4. Open the **Geographic Intelligence Map** to show regional spike clusters across Chennai, Madurai, Coimbatore, etc.
5. Navigate to **Data Ingestion / Simulator** and click **"Inject Surge & Run AI Pipeline"** to show real-time anomaly detection, spike creation, alert dispatch, and AI insight synthesis!
6. Open the **AI Copilot Drawer** and ask questions about current spikes and stockout risks.
7. Generate and print an official **Public Health Surveillance Bulletin** from the Reports page.
