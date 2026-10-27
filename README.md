# SleepSync AI — Sleep Pattern Analyzer & PDF Report Generator

An AI-powered wellness web application that analyzes self-reported sleep schedules and daily energy patterns to generate personalized informational insights and downloadable PDF reports.

**Live Demo:** https://sleepsyncaiclient.vercel.app/  
**Backend API & Swagger:** https://sleepsyncai.onrender.com/swagger  
**GitHub Repository:** https://github.com/SintaSobu45/SleepSyncAI

> **Disclaimer:** SleepSync AI is an educational wellness tool, not a medical diagnostic application. It does not diagnose sleep disorders, scientifically determine biological chronotypes, or replace professional medical advice.

## Features

### 1. Sleep Pattern Analysis
- Interactive sleep questionnaire covering bedtime, wake-up time, energy peak, preferred schedule, average sleep duration, and optional notes.
- AI-powered analysis using Google Gemini.
- Rule-based fallback when AI is unavailable or an API key is not configured.
- Correct handling of overnight sleep schedules, such as 1:00 AM to 9:00 AM.
- Personalized informational suggestions based on submitted responses.
- General sleep wellness recommendations and clear disclaimers.

### 2. PDF Report Generation
- Generates a professionally formatted A4 PDF report.
- Includes the reported schedule, analysis summary, estimated preference, suggestions, and recommendations.
- PDF generated on the backend using QuestPDF.
- Downloadable report named `SleepSync-Report.pdf`.

### 3. Backend API
- RESTful endpoints built with ASP.NET Core Web API.
- Request validation and structured JSON responses.
- Server-side AI integration to keep API credentials out of the frontend.
- Swagger UI for API exploration and testing.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite |
| UI | Material UI 7 |
| HTTP Client | Axios |
| Backend | ASP.NET Core 8 Web API |
| Language | C# |
| AI Integration | Google Gemini API, Google.GenAI SDK |
| PDF Generation | QuestPDF |
| API Documentation | Swagger / OpenAPI |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

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
ASP.NET Core Web API
(Hosted on Render)
 |
 +----> Gemini AI Analyzer
 |         |
 |         +----> Rule-based fallback
 |
 +----> QuestPDF Report Generator
 |
 v
JSON Analysis / Downloadable PDF
```

## Live API Endpoints

Base URL:

`https://sleepsyncai.onrender.com`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/sleep/analyze` | Analyze submitted sleep information |
| POST | `/api/sleep/report` | Generate and download a PDF report |

Interactive API documentation is available at the [Swagger UI](https://sleepsyncai.onrender.com/swagger).

## Project Structure

```text
SleepSyncAI/
├── SleepSyncAI.Api/
│   ├── Controllers/
│   │   └── SleepController.cs
│   ├── Models/
│   │   ├── SleepAnalysisRequest.cs
│   │   └── SleepAnalysisResponse.cs
│   ├── Services/
│   │   ├── ISleepAnalyzerService.cs
│   │   ├── RuleBasedAnalyzerService.cs
│   │   ├── GeminiAnalyzerService.cs
│   │   └── PdfReportService.cs
│   ├── Program.cs
│   └── SleepSyncAI.Api.csproj
│
├── sleepsyncai.client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── theme/
│   ├── App.jsx
│   ├── main.jsx
│   └── package.json
│
├── README.md
└── ProjectDocumentation.html
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js and npm
- Visual Studio 2022 or Visual Studio Code
- A Google Gemini API key (optional; the rule-based fallback can be used without one)

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
```

Configure the Gemini API key if AI-powered analysis is required.

**Option A: .NET User Secrets**

```bash
dotnet user-secrets init
dotnet user-secrets set "Gemini:ApiKey" "YOUR_GEMINI_API_KEY"
```

**Option B: Environment Variable**

In PowerShell:

```powershell
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
```

Run the API using your configured local launch profile:

```bash
dotnet run
```

Open the Swagger URL displayed by the application. For a launch profile configured for HTTP on port 5062, the URL is:

`http://localhost:5062/swagger`

The actual port depends on your launch settings.

### 3. Run the Frontend

Open a separate terminal from the repository root:

```bash
cd sleepsyncai.client
npm install
npm run dev
```

Open the local URL displayed by Vite, typically:

`http://localhost:5173`

The frontend API configuration is in:

`src/services/sleepApi.js`

For local development, ensure the API base URL points to your locally running backend. For the deployed frontend, it should point to the Render API.

## Example API Request

**POST** `/api/sleep/analyze`

```json
{
  "bedtime": "23:00",
  "wakeUpTime": "07:00",
  "energyPeak": "LateMorning",
  "preferredSchedule": "Flexible",
  "averageSleepHours": 8,
  "notes": ""
}
```

The API returns structured analysis information, including a summary, estimated schedule preference, reported sleep duration, suggestions, general recommendations, and a wellness disclaimer.

The exact response depends on the submitted data and the active analysis service.

### Accepted Values

| Field | Accepted values |
|---|---|
| `energyPeak` | `EarlyMorning`, `LateMorning`, `Afternoon`, `Evening`, `Night` |
| `preferredSchedule` | `Early`, `Flexible`, `Late` |
| `averageSleepHours` | 1–24, including decimal values |
| `notes` | Optional; maximum 500 characters |

The API validates required fields and accepted values. Invalid requests return a validation error response.

## How the Rule-Based Fallback Works

When Gemini is not configured or AI analysis is unavailable, the application can use a deterministic rule-based analyzer.

- **Sleep duration:** Calculates the interval between bedtime and wake-up time, including overnight schedules.
- **Schedule preference:** Estimates a broad schedule preference using the application's scoring rules.
- **Suggestions:** Produces contextual informational suggestions based on submitted sleep details.
- **Recommendations:** Provides general sleep-hygiene guidance.

These are application-generated estimates, not scientifically established chronotype measurements or medical conclusions.

## Security and Privacy

- Gemini credentials should be stored in server-side configuration or environment variables.
- Never commit real API keys, passwords, or other secrets to GitHub.
- Sleep information is not persisted by the current application.
- The application does not require user authentication in its current version.

## Known Limitations

- Sleep questionnaire data is not saved between sessions.
- There is no user authentication or personal dashboard.
- AI-powered analysis depends on Gemini availability and valid configuration.
- Rule-based analysis is used as a fallback when AI is unavailable.
- PDF rendering may vary slightly depending on font availability.
- Results are informational and must not be used for medical diagnosis.

## Future Improvements

Potential enhancements include:
- Sleep history and trend visualization.
- Optional user accounts and saved reports.
- More detailed weekly sleep summaries.
- Additional accessibility and responsive-design improvements.
- Automated API and frontend tests.

## Wellness Disclaimer

SleepSync AI provides informal wellness information based on self-reported data. It does not diagnose sleep disorders, establish biological chronotypes, or provide medical advice. A short questionnaire cannot scientifically determine an individual's biological chronotype. Consult a qualified healthcare professional for sleep-related health concerns.

---

**Built with React, ASP.NET Core, Google Gemini, and QuestPDF.**
