# SleepSync AI — Sleep Pattern Analyzer & PDF Report Generator

SleepSync AI is an educational wellness application that helps users understand their self-reported sleep and daily energy patterns. It generates personalized informational reports with practical sleep-routine suggestions and allows users to download their report as a professional PDF.

> **Important:** This is an informational wellness tool, not a medical diagnostic application. It does not diagnose sleep disorders, determine biological chronotypes, or provide medical advice.

## Features

### 1. Sleep Pattern Analyzer
- Complete sleep questionnaire with 6 fields (bedtime, wake-up time, energy peak, preferred schedule, sleep duration, notes)
- AI-powered analysis using Google Gemini (with rule-based fallback)
- Handles overnight sleep schedules correctly (e.g., 1:00 AM → 9:00 AM)
- Personalized suggestions based on your specific data
- General sleep wellness recommendations
- Wellness disclaimers on all outputs

### 2. PDF Report Generator
- Professional A4 PDF with branded layout
- Includes all analysis sections: schedule, summary, preference, suggestions, recommendations
- Generated server-side using QuestPDF — no client-side processing
- Downloaded as `SleepSync-Report.pdf`

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | ASP.NET Core 8 Web API |
| PDF Generation | QuestPDF 2026.9.1 (Community License) |
| AI Integration | Google Gemini API via Google.GenAI SDK |
| Frontend | React 19 + Vite + Material UI 7 |
| HTTP Client | Axios |

## Folder Structure

```
SleepSyncAI/
├── SleepSyncAI.Api/                      # ASP.NET Core 8 Web API
│   ├── Controllers/
│   │   └── SleepController.cs            # POST /api/sleep/analyze & /api/sleep/report
│   ├── Models/
│   │   ├── SleepAnalysisRequest.cs       # Request DTO with validation
│   │   └── SleepAnalysisResponse.cs      # Response DTO
│   ├── Services/
│   │   ├── ISleepAnalyzerService.cs      # Analyzer interface
│   │   ├── RuleBasedAnalyzerService.cs   # Deterministic fallback
│   │   ├── GeminiAnalyzerService.cs      # AI-powered analyzer
│   │   └── PdfReportService.cs           # QuestPDF report generator
│   ├── Program.cs                        # App configuration & DI
│   ├── appsettings.json                  # Configuration
│   └── SleepSyncAI.Api.csproj            # Project file
│
└── sleepsyncai.client/                   # React + Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx                # App header with branding
    │   │   ├── Footer.jsx                # Wellness disclaimer footer
    │   │   ├── SleepForm.jsx             # Sleep questionnaire form
    │   │   ├── AnalysisResults.jsx        # Analysis display
    │   │   └── SuggestionCard.jsx        # Reusable suggestion card
    │   ├── pages/
    │   │   └── HomePage.jsx              # Main page orchestration
    │   ├── services/
    │   │   └── sleepApi.js               # Axios API service
    │   ├── theme/
    │   │   └── theme.js                  # MUI dark theme
    │   ├── App.jsx                       # Root component
    │   └── main.jsx                      # Entry point
    ├── index.html                        # HTML template
    ├── vite.config.js                    # Vite configuration
    └── package.json                      # Dependencies
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) (LTS recommended)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (optional but recommended for backend)
- A text editor or VS Code for frontend development

## Setup & Running

### Backend Setup

```powershell
# Navigate to the API project
cd SleepSyncAI\SleepSyncAI.Api

# Restore packages
dotnet restore

# Build the project
dotnet build

# Run the backend (starts on http://localhost:5062)
dotnet run --launch-profile http
```

The backend will start on `http://localhost:5062`. Swagger UI is available at `http://localhost:5062/swagger`.

### Frontend Setup

```powershell
# Navigate to the client project
cd SleepSyncAI\sleepsyncai.client

# Install dependencies
npm install

# Start the development server (starts on http://localhost:5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

### Running with Visual Studio 2022

1. Open `SleepSyncAI\SleepSyncAI.Api\SleepSyncAI.Api.csproj` in Visual Studio
2. Press `F5` to run with debugging, or `Ctrl+F5` to run without
3. Swagger UI will open automatically
4. Start the frontend separately using the PowerShell commands above

## Configuring the Gemini AI API Key

The application works fully **without** an AI API key using the rule-based fallback. To enable AI-powered analysis:

### Option 1: .NET User Secrets (Recommended for Development)

```powershell
cd SleepSyncAI\SleepSyncAI.Api
dotnet user-secrets init
dotnet user-secrets set "Gemini:ApiKey" "your-actual-api-key"
```

### Option 2: Environment Variable

```powershell
$env:GEMINI_API_KEY = "your-actual-api-key"
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Configure it using one of the methods above

> **Security:** The API key is never exposed to the frontend. It is read server-side only from configuration or environment variables.

## API Endpoints

### POST `/api/sleep/analyze`

Analyzes sleep questionnaire data and returns personalized insights.

**Request Body:**
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

**Response (200 OK):**
```json
{
  "summary": "Based on your reported schedule...",
  "estimatedPreference": "Intermediate",
  "reportedSleepDuration": "8 hours (calculated interval: ~8 hours)",
  "suggestions": [
    "Your ~8-hour sleep window falls within the recommended range...",
    "Your energy peak and schedule preference appear well-aligned...",
    "Reduce bright-screen exposure for 30-60 minutes before bedtime..."
  ],
  "generalRecommendations": [
    "Keep your wake-up time reasonably consistent...",
    "Create a relaxing pre-sleep routine...",
    "Keep your bedroom cool, dark, and quiet...",
    "Avoid caffeine at least 6 hours before bedtime.",
    "Track your energy levels for a week or two..."
  ],
  "disclaimer": "This is an informal wellness estimate..."
}
```

**Validation Error (400):**
```json
{
  "errors": {
    "Bedtime": ["Bedtime is required."],
    "EnergyPeak": ["Energy peak must be one of: EarlyMorning, LateMorning, Afternoon, Evening, Night."]
  }
}
```

### POST `/api/sleep/report`

Generates and returns a PDF report. Accepts the same request body as `/analyze`.

**Response:** `application/pdf` binary with `Content-Disposition: attachment; filename="SleepSync-Report.pdf"`

### Valid Enumerated Values

| Field | Accepted Values |
|-------|----------------|
| `energyPeak` | `EarlyMorning`, `LateMorning`, `Afternoon`, `Evening`, `Night` |
| `preferredSchedule` | `Early`, `Flexible`, `Late` |
| `averageSleepHours` | `1` to `24` (decimal allowed) |
| `notes` | Optional, max 500 characters |

## How the Rule-Based Fallback Works

When no Gemini API key is configured (or if the AI call fails), the app uses a deterministic rule-based analyzer:

1. **Sleep Duration**: Calculated from bedtime and wake-up time, correctly handling overnight schedules
2. **Schedule Preference**: Determined by a scoring system based on bedtime hour, energy peak, and preferred schedule:
   - Score 0–2 → Early-oriented
   - Score 3–5 → Intermediate
   - Score 6–9 → Late-oriented
3. **Suggestions**: Generated contextually based on sleep duration, energy/schedule alignment, and bedtime habits
4. **Recommendations**: Standard sleep hygiene tips

The fallback always includes the wellness disclaimer and produces different results for different inputs.

## Testing PDF Downloads

1. Start both the backend and frontend
2. Fill out the sleep questionnaire form
3. Click "Analyze My Sleep Pattern"
4. After results appear, click "Download My Sleep Report"
5. The PDF will download as `SleepSync-Report.pdf`
6. Open it to verify all sections are present: schedule, summary, preference, suggestions, recommendations, disclaimer

## Known Limitations

- **No data persistence**: Sleep data is not saved between sessions (MVP design decision)
- **No user authentication**: The app is stateless and does not require login
- **AI availability**: The Gemini API requires an API key and internet connection; the fallback works offline
- **PDF fonts**: QuestPDF uses system fonts; PDF appearance may vary slightly across operating systems
- **Not a medical tool**: This application provides informal wellness estimates only

## Wellness Disclaimer

SleepSync AI provides informal wellness estimates based on self-reported data. It does not diagnose sleep disorders, determine biological chronotypes, or provide medical advice. A short questionnaire cannot scientifically determine a user's biological chronotype. For sleep-related health concerns, please consult a qualified healthcare professional.
