# Mysuru EM AI Studio — Emergency Response Intelligence

> **AI-Powered Emergency Management & Live Operations Platform for Mysuru District**

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Google Maps](https://img.shields.io/badge/Google%20Maps-JS%20API-4285F4?logo=google-maps)](https://developers.google.com/maps)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%204.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---
🌐 Live Demo: https://ideathon-2crt.vercel.app/


## 🌟 Overview

**Mysuru EM AI Studio** is a real-time, AI-assisted emergency response and clinical triage platform designed for emergency dispatchers (112 EOC), hospital emergency rooms, 108 ambulance paramedics, and citizens.

### Key Capabilities:
- 🚨 **Public Emergency Assistance Portal:** Instant 1-tap 112 emergency calling (with user confirmation), nearby hospital finder, ER capacity overview, and life-saving first-aid guidance.
- 🗺️ **Official Google Maps Integration:** Real geographic mapping of Mysuru district with Standard (Roadmap), Satellite, Hybrid, and Terrain layers, verified hospital markers, and interactive InfoWindows.
- ⚡ **Real-Time 108 Fleet Telematics:** Live GPS tracking of emergency vehicles with turn-by-turn routing and dynamic status updates.
- 🧠 **Intelligent Multi-Factor Hospital Matcher:** Evaluates road drive times, trauma classification, ICU capacity, and clinical specialties (Cath Lab, Stroke Unit, Burn Unit).
- 🧭 **Dual-Stage Turn-by-Turn Navigation:**
  - **Stage A:** Ambulance $\rightarrow$ Incident Scene
  - **Stage B:** Incident Scene $\rightarrow$ Selected Hospital ER Trauma Bay
- 🔔 **Driver Dispatch Queue:** Push notifications for 108 ambulance drivers with a 5-minute expiration countdown.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### 2. Installation
```bash
git clone https://github.com/kishorsv/Ideathon.git
cd Ideathon
npm install
```

### 3. Environment Configuration (Optional)
Create a `.env` file in the root directory:
```env
# Google Maps JavaScript API Key (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here

# CARTO Basemaps Key (Optional)
VITE_CARTO_API_KEY=
```
*Note: If no API key is provided, the platform automatically allows entering and testing a key live in the UI.*

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── auth/              # Role-based authentication modal
│   ├── common/            # Theme & sound toggles
│   ├── dashboard/         # Command Center, Google Maps, Triage Lab, ER Matrix, 108 Fleet
│   └── landing/           # Simple Homepage, Hero, Emergency Assistance Panel, Navbar
├── context/
│   ├── AuthContext.tsx           # User authentication & role management
│   ├── EmergencyDataContext.tsx  # Central emergency telemetry & dispatch state
│   └── ThemeContext.tsx          # Dark/Light mode provider
├── services/
│   ├── googleMapsService.ts      # Official Google Maps JS API loader
│   ├── hospitalMatcher.ts        # Multi-factor clinical hospital ranking engine
│   ├── mockData.ts               # Verified Mysuru hospital & fleet datasets
│   └── routingService.ts         # Distance, travel time & navigation route calculations
└── types/                        # TypeScript type definitions
```

---

## 🛡️ License
Built for the **Ideathon** & Mysuru Emergency Operations.
