# CallCenterX

A full-stack call center management platform with real-time voice agent monitoring, live call tracking, analytics, and a customer-facing support interface.

## Tech Stack

**Frontend**
- React 18 + TypeScript, Vite
- Tailwind CSS v3, shadcn/ui (Radix UI primitives)
- Ubuntu / Ubuntu Mono fonts (Google Fonts)
- Recharts for analytics charts
- Socket.IO client for real-time updates
- React Router v6, React Hook Form + Zod

**Backend**
- Node.js + Express (TypeScript)
- Socket.IO for WebSocket connections
- MySQL2 via Dolt (version-controlled relational database)
- JWT authentication, bcryptjs password hashing
- ElevenLabs API for text-to-speech synthesis

## Project Structure

```
CallCenterX/
├── src/                    # React frontend
│   ├── components/         # Shared UI components (header, sidebar, layout, shadcn/ui)
│   ├── contexts/           # Auth and Socket React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and API client
│   ├── pages/              # Route-level page components
│   │   ├── auth/           # Login and register pages
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── calls/          # Call management (list, recordings, live, analytics)
│   │   ├── customer-interface/  # Customer-facing chat and voice support
│   │   ├── dashboard/      # Main dashboard (overview, analytics, reports)
│   │   ├── settings/       # App settings (general, team, integrations, billing)
│   │   └── setup-organization/  # First-run org creation flow
│   ├── routes/             # Route definitions
│   └── types/              # Shared TypeScript types
├── server/                 # Express backend
│   └── src/
│       ├── routes/         # REST API routes (auth, agents, calls, organizations, synthesize)
│       ├── middleware/      # JWT auth middleware
│       ├── db.ts           # Dolt/MySQL connection pool
│       └── schema.sql      # Database schema
├── .env.example            # Environment variable template
└── config.yaml             # App configuration
```

## Getting Started

### Prerequisites

- Node.js 20+
- [Dolt](https://docs.dolthub.com/introduction/installation) running locally (MySQL-compatible on port 3306)
- An ElevenLabs API key (for TTS features)

### 1. Clone and install

```bash
git clone <repo-url>
cd CallCenterX
npm install
npm install --prefix server
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (default: `http://localhost:4000`) |
| `PORT` | Server port (default: `4000`) |
| `CLIENT_ORIGIN` | Frontend origin for CORS (default: `http://localhost:5173`) |
| `DOLT_HOST` | Dolt host (default: `127.0.0.1`) |
| `DOLT_PORT` | Dolt port (default: `3306`) |
| `DOLT_USER` | Dolt user (default: `root`) |
| `DOLT_PASSWORD` | Dolt password |
| `DOLT_DATABASE` | Database name (default: `callcenterx`) |
| `JWT_SECRET` | Secret key for JWT signing — change in production |
| `ELEVENLABS_API_KEY` | ElevenLabs API key for TTS |

### 3. Initialize the database

Start Dolt and create the database, then run the schema:

```bash
dolt sql < server/src/schema.sql
```

### 4. Run in development

Run both frontend and backend together:

```bash
npm run dev:all
```

Or separately:

```bash
# Frontend (http://localhost:5173)
npm run dev

# Backend (http://localhost:4000)
npm run server:dev
```

### 5. Build for production

```bash
npm run build        # Frontend — output in dist/
npm run server:build # Backend — output in server/dist/
npm run server:start # Start compiled backend
```

## Features

- **Authentication** — Register, login, JWT sessions, organization setup flow
- **Dashboard** — Overview stats, activity feed, analytics, reports
- **Calls** — Call list with search/filter, recordings, live call monitoring, per-call analytics
- **Analytics** — KPI cards, call volume charts, category breakdown, satisfaction scores
- **Settings** — General, team management, third-party integrations, billing, advanced options
- **Customer Interface** — Embeddable chat + voice call widget for end-customers
- **Real-time** — Socket.IO for live call status and agent state updates
- **Voice Synthesis** — ElevenLabs TTS integration for AI voice responses

## Design

Dark terminal aesthetic throughout — deep black backgrounds, terminal green accent, Ubuntu typeface. Always dark mode; no light mode toggle.
