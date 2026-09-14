# FoodLink 🍲📡

> **Smart Surplus-Food Redistribution System with IoT Telemetry & Digital Food Passport**

FoodLink is an end-to-end logistics and food rescue platform designed to bridge commercial food providers, courier networks, and community receiving organizations. By integrating physical IoT monitoring containers with an immutable digital tracking layer, FoodLink verifies food safety, hot/cold chain integrity, and weight audit compliance from kitchen staging to final intake.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Key Features](#-key-features)
- [Stakeholder Portals & Demo Accounts](#-stakeholder-portals--demo-accounts)
- [Physical IoT Hardware Layer](#-physical-iot-hardware-layer)
- [Digital Food Passport](#-digital-food-passport)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Design Philosophy](#-design-philosophy)

---

## 🌐 Overview & Architecture

Every day, vast quantities of prepared surplus food are wasted due to lack of verifiable transit data and liability concerns around temperature abuse. FoodLink solves this by creating a closed-loop chain of custody:

```
[ FOOD PROVIDER ]                     [ COURIER / TRANSIT ]                 [ RECEIVER ]
Commercial Kitchen / Catering          Dedicated Couriers / Vans             Community Shelters / Pantries
       │                                       │                                   │
       ▼                                       ▼                                   ▼
Staging & Batch Creation              Custody Acceptance                   Arrival Inspection
ESP32 Node Attached                   Real-time Temp & Latch Pings         Digital Receipt & Weight Audit
       │                                       │                                   │
       └───────────────────────────────────────┴───────────────────────────────────┘
                                       ▼
                       [ FOODLINK CORE PLATFORM ]
                      Next.js 16 + Turbopack Engine
                      Digital Food Passport Audit Log
```

---

## ✨ Key Features

### 1. Multi-Stakeholder Workflows
- **Food Provider Console (`/app?role=provider`)**:
  - Register surplus batches with category, initial temperature, net mass, and shelf-life expiration.
  - Link batches to physical telemetry nodes (`FL-NODE-001`, etc.).
  - Real-time staging queue and courier pickup dispatch.
- **Delivery Partner Console (`/app?role=delivery`)**:
  - Accept assigned transfers with loading dock handover verification.
  - Active route guidance, destination ETA, and container seal latch telemetry.
  - Multi-stage transit state machine (`ASSIGNED` → `ACCEPTED` → `PICKED_UP` → `IN_TRANSIT` → `ARRIVED` → `DELIVERED`).
- **Receiving Organization Console (`/app?role=receiver`)**:
  - Inbound shipment radar with real-time temperature and ETA alerts.
  - One-click intake verification with automatic weight variance detection.
  - Discrepancy logging for seal violations or thermal excursions.

### 2. Digital Food Passport (`/food/[batchId]`)
- Persistent, shareable public audit sheet for every food batch.
- Displays origin kitchen, preparation timestamp, target organization, and continuous temperature logs.
- Interactive sensor health indicators (DS18B20 1-Wire, HX711 Load Cell, Magnetic Reed Latch, Wi-Fi uplink).
- Scannable QR code linking physical container stickers directly to the digital record.

### 3. Dedicated Presentation & Evaluator Mode (`/presentation`)
- Built specifically for academic reviews, jury evaluations, and demonstrations.
- Interactive 10-milestone demo runner for batch `FL-DEMO-001` (`Hot Vegetable Korma & Basmati Portions`).
- Supports automated playback or step-by-step milestone advancement (`FOOD PREPARED` → `PACKED` → `NODE CONNECTED` → `PICKED UP` → `TRANSPORT` → `MONITORED` → `CONTAINER EVENT` → `ARRIVED` → `DELIVERED` → `RECEIVED`).

---

## 👥 Stakeholder Portals & Demo Accounts

FoodLink includes preconfigured demo accounts for role-based authentication and evaluation:

| Role | Demo Email | Password | Assigned Dashboard |
| :--- | :--- | :--- | :--- |
| **Food Provider** | `provider@foodlink.demo` | `FoodLink123` | `/app?role=provider` |
| **Delivery Partner** | `delivery@foodlink.demo` | `FoodLink123` | `/app?role=delivery` |
| **Receiving Organization** | `receiver@foodlink.demo` | `FoodLink123` | `/app?role=receiver` |

> 💡 **Tip**: On the [`/login`](http://localhost:3000/login) page, click on any account in the **DEMO ACCESS** panel to instantly pre-fill credentials.

---

## 📟 Physical IoT Hardware Layer

FoodLink containers integrate a dedicated hardware telemetry node that streams real-time sensor packets:

- **Microcontroller**: ESP32 Dual-Core 240MHz with 802.11 b/g/n Wi-Fi & BLE.
- **Thermal Probe**: DS18B20 1-Wire digital temperature sensor (-55°C to +125°C, ±0.5°C precision).
- **Load Cell & ADC**: Single-point strain gauge with HX711 24-bit ADC for precision weight monitoring.
- **Container Latch**: Magnetic reed switch monitoring lid closures and detecting unauthorized openings in transit.
- **Local Display**: 0.96" I2C Monochrome OLED showing batch ID, current temperature, and connectivity status.

Inspect the technical equipment registry at [`/devices`](http://localhost:3000/devices) and individual node spec sheets at [`/devices/FL-NODE-001`](http://localhost:3000/devices/FL-NODE-001).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/)
- **UI & Components**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Typography**: Geist Sans & Geist Mono
- **State & Data**: Client session authentication, Next.js App Router API endpoints
- **Hardware Integration**: RESTful JSON Telemetry Ingestion (`/api/devices/[deviceId]/telemetry`)

---

## 📁 Project Structure

```text
FoodLink/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── batches/              # Batch creation & query API
│   │   │   ├── demo/                 # 10-stage presentation demo engine
│   │   │   ├── devices/              # Equipment node registry
│   │   │   └── devices/[deviceId]/   # Device telemetry ingestion handler
│   │   ├── app/                      # Role-aware operations dashboard
│   │   ├── devices/                  # Physical hardware equipment inventory
│   │   │   └── [deviceId]/           # Technical node product specification
│   │   ├── food/
│   │   │   └── [batchId]/            # Digital Food Passport audit page
│   │   ├── login/                    # Stakeholder login portal with demo credentials
│   │   ├── presentation/             # Fullscreen presentation & review console
│   │   ├── globals.css               # Design system tokens & global styling
│   │   ├── layout.tsx                # Root layout & font definitions
│   │   └── page.tsx                  # Public landing & system overview page
│   ├── components/
│   │   ├── batches/                  # Batch creation modal dialogs
│   │   ├── hardware/                 # Milestone demo runner components
│   │   ├── shared/                   # Navigation bar, footer, and shell
│   │   └── ui/                       # Industrial tactile buttons, badges, QR codes
│   ├── data/
│   │   └── mockData.ts               # Initial batches, stakeholder profiles, notifications
│   ├── lib/
│   │   ├── auth.ts                   # Demo credentials, validation & session helpers
│   │   └── utils.ts                  # Tailwind styling helpers
│   └── types/
│       └── foodlink.ts               # Core TypeScript definitions (batches, stages, telemetry)
├── public/                           # Static assets and icons
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.18+ or v20+
- `npm` or `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kanisk-14/FoodLink.git
   cd FoodLink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/batches` | `GET` | List all active food batches with status and telemetry summary. |
| `/api/batches` | `POST` | Create a new food batch and link it to an IoT node. |
| `/api/devices` | `GET` | Retrieve list of registered ESP32 equipment nodes and battery levels. |
| `/api/devices/[deviceId]/telemetry` | `POST` | Ingest sensor telemetry packets from physical ESP32 devices. |
| `/api/demo` | `GET` | Fetch the current state of presentation demo batch `FL-DEMO-001`. |
| `/api/demo` | `POST` | Advance or reset the 10-stage demonstration scenario. |

---

## 🎨 Design Philosophy

FoodLink uses a curated **Industrial Modern + Subtle Retro** aesthetic:
- **Palette**: Warm ivory (`#F7F5EF`), deep charcoal (`#1C1D1B`), muted olive green (`#536B4F`), terracotta accent (`#B66A4E`), and tactile warm-gray borders (`#DDD9CF`).
- **Typography**: Crisp modern sans-serif paired with selective monospace technical readouts.
- **Zero AI Cliché**: No fluorescent glowing neon, no sci-fi dark HUDs, and no generic SaaS templates. Styled like real mission-critical logistics operations software.

---

## 📄 License

This project was created for demonstration and academic evaluation purposes. Licensed under the [MIT License](LICENSE).
