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
- Visual Studio 2022 or Visual Studio
