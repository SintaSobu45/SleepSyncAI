# SleepSync AI — Personalized Chronotype & Sleep Rhythm Platform

SleepSync AI is an AI-powered educational wellness application and circadian analysis platform. It collects detailed self-reported data regarding sleep timing, preferred sleep/wake hours, diurnal energy patterns, and lifestyle habits to generate a comprehensive, personalized **Chronotype & Circadian Rhythm Report** with an interactive 24-hour diurnal energy curve and executive downloadable PDF report.

> **Important Educational Wellness Disclaimer:** SleepSync AI is an educational wellness tool and informational platform, NOT a medical diagnostic instrument. It does not diagnose sleep disorders (e.g., insomnia, sleep apnea, or circadian rhythm sleep-wake disorders), determine genetic chronotypes with clinical certainty, or provide medical treatment advice. For clinical sleep concerns, consult a board-certified sleep specialist.

---

## 🌟 Key Platform Capabilities

### 1. Multi-Step Chronotype Questionnaire Wizard
- **Section A: Natural Sleep Preferences** — Habitual vs. free-day bedtimes, spontaneous wake times, average sleep duration, and weekend sleep shifts (social jetlag).
- **Section B: Daily Energy Patterns** — Peak physical energy, mental alertness windows, lowest energy troughs, preferred analytical windows, creative windows, and afternoon dip characteristics.
- **Section C: Lifestyle & Sleep Habits** — Work/study schedules, exercise timing & frequency, caffeine consumption level & cutoff time, pre-bed screen exposure, night awakenings, and naps.
- **Section D: Sleep Quality & Subjective Rhythms** — Sleep onset latency, morning refreshedness rating, schedule consistency, and daytime fatigue.
- **Review & Submission** — Step-by-step validation, back/next navigation, answer review card, and state preservation.

### 2. Scientific Chronotype Classification Engine
- **Midpoint of Sleep on Free Days ($MSF$)** calculation inspired by the Munich Chronotype Questionnaire (MCTQ).
- Multi-dimensional scoring across sleep timing, peak alertness, and subjective diurnal orientation.
- Three scientifically grounded estimated categories:
  - **AM-Shifted (Morning-Oriented):** Early rise, rapid morning activation, early focus peak, earlier evening melatonin onset.
  - **Bi-Phasic / Intermediate:** Balanced diurnal rhythm, robust morning analytical peak, natural post-lunch dip, late-afternoon recovery.
  - **PM-Shifted (Evening-Oriented):** Night focus, late-day mental flow, extended evening energy, morning sleep inertia.
- Transparent calculation breakdown and confidence rating (High, Moderate, Inconclusive).
- Social jetlag metric calculating the divergence between workdays and free days.

### 3. AI-Powered Personalization (Google Gemini) with Infallible Offline Fallback
- Backend-orchestrated Google Gemini integration (`gemini-2.0-flash`) using structured JSON schemas.
- Strictly separates classification (calculated deterministically by C# engine) from prose generation (personalized by Gemini).
- Strict AI safety rules preventing medical diagnosis or hallucinations.
- Infallible rule-based fallback: If Gemini is offline, timed out, or unconfigured, the comprehensive report is generated deterministically without degradation.

### 4. Interactive 24-Hour Circadian Energy Curve Chart
- Custom responsive SVG visualization with smooth cubic Bezier spline curves and ambient gradient fill.
- Visualizes 5 core diurnal phases: **Cognitive Peak**, **Afternoon Dip**, **Creative Recovery**, **Melatonin Wind-Down**, and **Restorative Sleep Window**.
- Interactive hover/touch inspection: Displays exact time, estimated alertness percentage, phase name, and suggested focus activities.

### 5. Multi-Page Executive QuestPDF Report
- Executive Cover Page with title, branding, user profile summary, and assessment metadata.
- Table of Contents.
- Section 1: What is a Chronotype? (molecular clockwork & 2017 Nobel Prize context).
- Section 2: Your Chronotype Results & Strengths.
- Section 3: Daily Energy Curve Architecture table.
- Section 4: Period-Specific Focus, Afternoon Dip & Recovery Optimization Protocols.
- Section 5: Personalized 24-Hour Schedule Matrix.
- Section 6: Verified Scientific References (Hall, Rosbash, Young 2017; Horne & Östberg 1976; Roenneberg 2003; Facer-Childs 2018; AASM).
- Educational Wellness Disclaimer on every page.

---

## 🛠 Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Backend** | ASP.NET Core Web API | .NET 8.0 | High-performance RESTful API, DTO validation, classification engine |
| **PDF Engine** | QuestPDF | 2026.9.1 | Server-side multi-page PDF generation (Community License) |
| **AI Integration** | Google Gemini API | Google.GenAI 1.27.0 | Structured JSON personalizations (server-side only) |
| **Frontend** | React | 19.1.0 (JSX) | Component architecture, responsive state management |
| **Build Tool** | Vite | 6.3.0 | Rapid development server and optimized production bundling |
| **UI Library** | Material UI (MUI) | 7.0.0 | Dark wellness theme, glassmorphism cards, Stepper |
| **HTTP Client** | Axios | 1.9.0 | API communication with binary blob streaming for PDF download |

---

## 📁 Project Structure

```
SleepSyncAI/
├── SleepSyncAI.Api/                       # ASP.NET Core 8 Web API
│   ├── Controllers/
│   │   └── SleepController.cs             # POST /api/sleep/analyze & /api/sleep/report
│   ├── Models/
│   │   ├── SleepAnalysisRequest.cs        # Comprehensive request DTO with validation
│   │   └── SleepAnalysisResponse.cs       # Rich response DTO (Chronotype, Profile, Curve, Schedule, Citations)
│   ├── Services/
│   │   ├── ISleepAnalyzerService.cs       # Analyzer interface
│   │   ├── ChronotypeClassificationService.cs # Core scientific scoring & schedule engine
│   │   ├── RuleBasedAnalyzerService.cs    # Deterministic fallback service
│   │   ├── GeminiAnalyzerService.cs       # AI personalizer with schema enforcement
│   │   └── PdfReportService.cs            # Multi-page executive QuestPDF report builder
│   ├── Properties/
│   │   └── launchSettings.json            # HTTP port 5062 launch profile
│   ├── Program.cs                         # Dependency injection, CORS, self-test suite
│   ├── Dockerfile                         # Production Docker deployment (Render)
│   └── SleepSyncAI.Api.csproj             # .NET 8 project dependencies
│
└── sleepsyncai.client/                    # React 19 + Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx                 # App bar with navigation pills & view switcher
    │   │   ├── Footer.jsx                 # Educational wellness disclaimer & copyright
    │   │   ├── AssessmentWizard.jsx       # 5-step Chronotype questionnaire wizard
    │   │   ├── EnergyCurveChart.jsx       # Interactive 24-hour SVG energy curve visualization
    │   │   ├── ChronotypeReportView.jsx   # Complete 10-section interactive report
    │   │   ├── SleepForm.jsx              # Classic 6-field questionnaire (backward compatibility)
    │   │   ├── AnalysisResults.jsx         # Legacy results renderer
    │   │   └── SuggestionCard.jsx         # Reusable suggestion card
    │   ├── pages/
    │   │   └── HomePage.jsx               # Redesigned 9-section landing page
    │   ├── services/
    │   │   └── sleepApi.js                # Axios client with dynamic URL & localStorage helpers
    │   ├── theme/
    │   │   └── theme.js                   # Custom MUI dark wellness theme (#0B1220 palette)
    │   ├── App.jsx                        # Root orchestrator with view state routing
    │   └── main.jsx                       # React 19 entry point
    ├── index.html                         # Document template with Inter typography
    ├── vite.config.js                     # Vite dev server configuration (port 5173)
    └── package.json                       # Dependencies & build scripts
```

---

## 🚀 Setup & Execution Guide

### Backend (.NET 8 Web API)

```powershell
# Navigate to API project
cd SleepSyncAI\SleepSyncAI.Api

# Restore dependencies
dotnet restore

# Build project (0 errors, 0 warnings)
dotnet build

# Run automated verification tests
dotnet bin\Debug\net8.0\SleepSyncAI.Api.dll --test-run

# Run API server (listens on http://localhost:5062)
dotnet run --launch-profile http
```

- **Interactive Swagger Documentation:** `http://localhost:5062/swagger`

### Frontend (React 19 + Vite)

```powershell
# Navigate to client project
cd SleepSyncAI\sleepsyncai.client

# Run production build check
cmd.exe /c "npm run build"

# Launch development server
cmd.exe /c "npm run dev"
```

- **Application URL:** `http://localhost:5173` (or `http://localhost:5174`)

---

## 🔒 Security & Privacy Architecture

1. **Zero Data Persistence:** No database or Entity Framework Core. Data is processed in-memory and immediately discarded.
2. **Server-Side API Key Security:** Google Gemini API keys are held strictly in backend User Secrets or environment variables (`GEMINI_API_KEY`). No secrets are ever exposed to client bundles.
3. **Untrusted Client Protection:** The PDF generation endpoint (`POST /api/sleep/report`) re-runs classification on the server to prevent fabricated client injections.
4. **HTML Sanitization & Validation:** Regex and range validations enforce data format integrity; text inputs are sanitized against HTML injections.
5. **CORS Governance:** Restricted to approved frontend development origins (`http://localhost:5173`, `http://localhost:5174`, `http://localhost:3000`) and production deployment (`https://sleepsyncaiclient.vercel.app`).
