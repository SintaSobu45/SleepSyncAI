# SleepSync AI — Personalized Chronotype & Sleep Rhythm Platform

SleepSync AI is an AI-powered educational wellness application built with React and ASP.NET Core 8 Web API. It analyzes self-reported sleep schedules, natural sleep preferences, daily energy patterns, and lifestyle habits to generate personalized chronotype insights, an interactive 24-hour energy curve, and a downloadable PDF report.

**Live Demo:** https://sleepsyncaiclient.vercel.app/

**Backend API & Swagger:** https://sleepsyncai.onrender.com/swagger

**GitHub Repository:** https://github.com/SintaSobu45/SleepSyncAI

> **Important Educational Wellness Disclaimer:** SleepSync AI is an educational wellness tool, not a medical diagnostic application. It does not diagnose sleep disorders, establish biological chronotypes with clinical certainty, or replace professional medical advice. Consult a qualified healthcare professional for sleep-related medical concerns.

---

## Key Features

### 1. Multi-Step Chronotype Assessment

- Interactive five-step questionnaire.
- Natural sleep preferences and habitual sleep schedules.
- Free-day sleep timing and social jetlag assessment.
- Daily physical energy and mental alertness patterns.
- Lifestyle habits, caffeine consumption, exercise, naps, and screen exposure.
- Sleep quality and subjective daytime energy assessment.
- Step-by-step validation and answer review.

### 2. Chronotype Classification Engine

The backend calculates an estimated chronotype using self-reported information and deterministic C# scoring logic.

Three estimated categories:

- **AM-Shifted (Morning-Oriented):** Earlier sleep and wake preferences with stronger morning alertness.
- **Bi-Phasic / Intermediate:** More balanced daily energy patterns with possible morning and afternoon focus periods.
- **PM-Shifted (Evening-Oriented):** Later sleep preferences and stronger evening alertness.

Additional analysis includes:

- Midpoint of Sleep on Free Days (MSF).
- Social jetlag estimation.
- Chronotype scoring breakdown.
- Confidence rating.
- Personalized daily schedule.

These categories are educational estimates, not clinical chronotype diagnoses.

### 3. AI-Powered Personalization

- Google Gemini API integration.
- AI-generated natural-language explanations and personalized suggestions.
- Backend-controlled AI requests.
- Classification remains controlled by the deterministic C# engine.
- Rule-based fallback when Gemini is unavailable, times out, or is not configured.
- AI responses are handled using structured output and validation.

### 4. Interactive 24-Hour Energy Curve

- Responsive SVG-based energy visualization.
- Displays estimated alertness across a 24-hour period.
- Highlights cognitive peaks, afternoon dips, recovery periods, evening wind-down, and sleep windows.
- Interactive time and energy inspection.
- Personalized activity suggestions.

### 5. Downloadable PDF Report

Generated using QuestPDF on the backend.

The report includes:

- Chronotype result and profile summary.
- Classification explanation and confidence rating.
- Daily energy curve information.
- Personalized daily schedule.
- Focus and recovery suggestions.
- General sleep wellness recommendations.
- Educational wellness disclaimer.

### 6. Responsive User Interface

- React component-based architecture.
- Material UI components.
- Light, soothing wellness-oriented colour palette.
- Responsive questionnaire, charts, and report views.
- User-friendly explanations and accessible content.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (JavaScript JSX) |
| Build Tool | Vite |
| UI Library | Material UI 7 |
| HTTP Client | Axios |
| Backend | ASP.NET Core 8 Web API |
| Language | C# |
| AI Integration | Google Gemini API |
| Gemini SDK | Google.GenAI |
| PDF Generation | QuestPDF |
| API Documentation | Swagger / OpenAPI |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## Architecture

```text
User
 |
 v
React + Vite Frontend
(Hosted on Vercel)
 |
 | HTTP requests using Axios
 v
ASP.NET Core 8 Web API
(Hosted on Render)
 |
 +----> Chronotype Classification Service
 |
 +----> Gemini AI Personalization
 |         |
 |         +----> Rule-Based Fallback
 |
 +----> QuestPDF Report Generator
 |
 v
Analysis Response / Downloadable PDF
```

---

## Project Structure

```text
SleepSyncAI/
|
├── SleepSyncAI.Api/
│   ├── Controllers/
│   │   └── SleepController.cs
│   │
│   ├── Models/
│   │   ├── SleepAnalysisRequest.cs
│   │   └── SleepAnalysisResponse.cs
│   │
│   ├── Services/
│   │   ├── ISleepAnalyzerService.cs
│   │   ├── ChronotypeClassificationService.cs
│   │   ├── RuleBasedAnalyzerService.cs
│   │   ├── GeminiAnalyzerService.cs
│   │   └── PdfReportService.cs
│   │
│   ├── Properties/
│   │   └── launchSettings.json
│   │
│   ├── Program.cs
│   ├── Dockerfile
│   └── SleepSyncAI.Api.csproj
│
├── sleepsyncai.client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AssessmentWizard.jsx
│   │   │   ├── EnergyCurveChart.jsx
│   │   │   ├── ChronotypeReportView.jsx
│   │   │   ├── SleepForm.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   └── SuggestionCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── sleepApi.js
│   │   │
│   │   ├── theme/
│   │   │   └── theme.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## Live API Endpoints

Base URL:

`https://sleepsyncai.onrender.com`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/sleep/analyze` | Analyze submitted sleep and chronotype information |
| POST | `/api/sleep/report` | Generate and download a PDF report |

Interactive documentation:

https://sleepsyncai.onrender.com/swagger

---

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js and npm
- Visual Studio 2022 or Visual Studio Code
- Google Gemini API key (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/SintaSobu45/SleepSyncAI.git
cd SleepSyncAI
```

### 2. Run the Backend

```bash
cd SleepSyncAI.Api
dotnet restore
dotnet build
dotnet run
```

The backend runs using the configured launch profile.

For local HTTP development, the configured URL may be:

`http://localhost:5062`

Swagger:

`http://localhost:5062/swagger`

### 3. Configure Gemini API Key (Optional)

The application supports rule-based analysis without a Gemini API key.

For AI-powered personalization, configure the key on the backend.

**Option A: .NET User Secrets**

```bash
dotnet user-secrets init
dotnet user-secrets set "Gemini:ApiKey" "YOUR_GEMINI_API_KEY"
```

**Option B: Environment Variable**

PowerShell:

```powershell
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
```

Never expose the Gemini API key in frontend code or commit real credentials to GitHub.

### 4. Run the Frontend

Open a separate terminal from the repository root:

```bash
cd sleepsyncai.client
npm install
npm run dev
```

Vite displays the local application URL, typically:

`http://localhost:5173`

The frontend API configuration is maintained in:

`src/services/sleepApi.js`

Ensure the local API URL points to the running backend during development.

---

## Security and Privacy

- No database or Entity Framework Core is used.
- Assessment data is processed by the backend without persistent database storage.
- Gemini API credentials remain server-side.
- Backend request validation protects API endpoints.
- CORS is configured for approved frontend development and production origins.
- The PDF endpoint generates its report on the backend.
- The application does not require user authentication.

---

## AI and Rule-Based Fallback

The application separates chronotype classification from AI-generated explanations.

1. The C# classification engine calculates estimated chronotype information.
2. Gemini can generate personalized natural-language explanations.
3. If Gemini is unavailable or not configured, the rule-based analyzer provides the fallback analysis.
4. The backend generates the structured response and PDF report.

AI-generated text does not determine the underlying classification.

---

## Known Limitations

- The application does not store assessment history in a database.
- There is no user authentication or personal dashboard.
- AI personalization depends on Gemini availability and valid server-side configuration.
- Rule-based analysis is used when Gemini is unavailable.
- Chronotype results are educational estimates based on self-reported information.
- The application is not intended for medical diagnosis or treatment.

---

## Future Improvements

- Automated frontend and backend test coverage.
- More detailed sleep history and trend visualizations.
- Optional saved reports.
- Additional accessibility improvements.
- Expanded educational content about sleep and circadian rhythms.

---

## Wellness Disclaimer

SleepSync AI provides educational wellness information based on self-reported data. It does not diagnose sleep disorders, establish biological chronotypes with clinical certainty, or provide medical advice. Consult a qualified healthcare professional for sleep-related health concerns.

---

**Built with React, ASP.NET Core 8, Google Gemini, and QuestPDF.**