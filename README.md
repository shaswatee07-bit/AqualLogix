# AquaLogix — Smart Water Supply & Fleet Logistics Management System

> **Enterprise-grade Municipal & Commercial Water Distribution, Tanker Telemetry, and SCADA Supply Grid**

Built using modern web technologies:
- **HTML5**: Semantic web page layouts and structures
- **CSS3**: Modern layouts, custom glassmorphism, animations, and transitions
- **JavaScript (ES2022+)**: Interactive logic, dynamic calculations, and asynchronous pipelines
- **TypeScript**: Strict type definitions for fleet telemetry, storage nodes, supply requests, and billing models
- **React.js**: Reusable UI component architecture, state management, and declarative views
- **Tailwind CSS**: Utility-first responsive design, custom palettes, and interactive states
- **Vite**: Ultra-fast next-gen frontend build tool and development server
- **React Router (v7)**: Client-side routing, route navigation, and deep linking
- **Axios**: HTTP client with request/response interceptors, centralized error handling, and API abstractions

---

## 💡 Recommended Project Names

If you are naming your project for a startup, enterprise pitch, college final year project, or municipal contract, here are the top recommended names:

| Name | Theme / Target | Tagline |
| :--- | :--- | :--- |
| **AquaLogix** *(Current)* | Enterprise & Fleet Logistics | *Next-Generation Municipal & Commercial Water Grid* |
| **HydroFlow ERP** | Supply Chain & Infrastructure | *End-to-End Water Flow, Pumping & Logistics Platform* |
| **AquaTrack 360** | GPS Telemetry & Smart Dispatch | *Real-Time Tanker Tracking & Water Delivery Network* |
| **PureStream Logistics** | Potability & Quality Monitoring | *Clean Water Supply Chain & Treatment Analytics* |
| **NeerFlow / JalSetu** | Municipal & Public Utilities | *Smart Water Distribution & Public Relief Dispatch* |
| **H2ORoute Pro** | Commercial Fleet & Billing | *Optimized Water Tanker Routing & Revenue Management* |

---

## 🚀 Key Modules & Capabilities

### 1. Control & Command Dashboard (`/`)
- **Real-Time KPIs**: Total water distributed today (KL), active tankers on road, storage reserves (KL & %), and active pipeline sensor incidents.
- **Pending Dispatch Queue**: Quick tanker allocation for urgent, priority, and emergency relief orders.
- **Reservoir Capacity Bars**: Live status of municipal elevated tanks and treatment plants.
- **One-Click Actions**: Book new water tanker orders and quick fleet dispatch.

### 2. Fleet & Logistics Dispatch (`/fleet`)
- **Fleet Telemetry**: Water volume load gauge, fuel level percentage, GPS location, and driver directory.
- **Dynamic Status Lifecycle**: Transitions between `Idle / Ready`, `Loading Bay`, `In Transit`, `Delivering`, and `In Workshop`.
- **GPS Telemetry Simulator**: Interactive visual telemetry showing active routes across city sectors.

### 3. Storage Reservoirs & SCADA Nodes (`/reservoirs`)
- **SCADA Levels**: Monitor elevated overhead tanks (OHT), underground reservoirs, and treatment plants.
- **Water Potability Telemetry**: Real-time sensor readouts for **pH**, **TDS (ppm)**, **Turbidity (NTU)**, and **Chlorine (mg/L)** complying with WHO standards.
- **Interactive Pump Valves**: Simulate inflow and discharge valves with live percentage recalculations.

### 4. Consumer Supply Requests (`/requests`)
- **Direct Booking Engine**: Modal form to request bulk water for Residential Societies, Hospitals, Tech Parks, and Municipal Wards.
- **Order Urgency Tiers**: Standard, Priority (+20%), and Subsidized Emergency Relief.
- **Tanker Assignment Workflow**: Interactive dispatch modal matching tanker capacity with order requirements.

### 5. Water Tariffs & Invoicing (`/billing`)
- **Volumetric Billing**: Calculation by water category (Potable Drinking ₹200/kL, Municipal ₹160/kL, Recycled ₹120/kL).
- **Payment Lifecycle**: Manage Paid, Pending, and Overdue receivables.
- **Digital Receipts**: Instant payment settlement and receipt generation.

### 6. Leakage & Sensor Alerts (`/analytics`)
- **Non-Revenue Water (NRW)**: Monitor estimated water loss per hour due to burst pipes or pressure drops.
- **Acoustic Sensor Alerts**: Filter anomalies by severity (`Critical`, `Medium`, `Low`).
- **Incident Resolution**: Dispatch maintenance and mark sensor alerts resolved.

---

## 📁 Project Structure

```text
aqualogix-water-logistics/
├── index.html                   # HTML5 Entry container
├── package.json                 # Dependencies (React, Vite, TS, Tailwind, React Router, Axios)
├── tsconfig.json                # TypeScript compiler config
├── vite.config.ts               # Vite bundler config with React plugin
├── tailwind.config.js           # Tailwind CSS configuration with custom theme
├── postcss.config.js            # PostCSS autotuning
├── src/
│   ├── main.tsx                 # React entrypoint with BrowserRouter
│   ├── App.tsx                  # Application layout, routes, and badge synchronization
│   ├── index.css                # CSS3 styles, scrollbars, and Tailwind directives
│   ├── vite-env.d.ts            # TypeScript Vite client environment types
│   ├── types/
│   │   └── index.ts             # TypeScript domain interfaces (Tanker, Node, Request, Invoice, Alert)
│   ├── api/
│   │   ├── client.ts            # Axios instance with request/response interceptors & logging
│   │   ├── mockData.ts          # Seed data for tankers, reservoirs, orders, and sensors
│   │   └── waterService.ts      # Persistent service layer with async CRUD operations
│   ├── components/
│   │   ├── Navbar.tsx           # Header with emergency hotline, alerts badge & reset button
│   │   ├── Sidebar.tsx          # NavLink menu with live status counters
│   │   ├── StatCard.tsx         # Reusable KPI card with trend indicators
│   │   ├── TankerCard.tsx       # Fleet vehicle status, fuel/load bars, and quick actions
│   │   ├── ReservoirCard.tsx    # Reservoir capacity gauge with interactive pump controls
│   │   ├── DispatchModal.tsx    # Tanker allocation modal
│   │   └── NewRequestModal.tsx  # Customer water supply booking modal
│   └── pages/
│       ├── Dashboard.tsx        # High-level operations overview
│       ├── LogisticsFleet.tsx   # Fleet tracking & GPS simulator
│       ├── ReservoirsDistribution.tsx # SCADA water levels & quality
│       ├── SupplyRequests.tsx   # Customer orders pipeline
│       ├── BillingInvoicing.tsx # Invoices, tariffs & payment ledger
│       └── AnalyticsReports.tsx # Leakage detection & NRW diagnostics
```

---

## 🛠️ How to Run the Project

### 1. Open Terminal & Navigate to the Directory
```bash
cd C:\Users\lenovo\.gemini\antigravity\scratch\aqualogix-water-logistics
```

### 2. Start the Development Server
```bash
npm run dev
```

Open your browser at:
`http://localhost:3000` (or the port indicated in your terminal).

### 3. Build for Production
```bash
npm run build
```

This will run TypeScript checks and output an optimized production bundle in `/dist`.

### 4. Preview the Production Build
```bash
npm run preview
```
