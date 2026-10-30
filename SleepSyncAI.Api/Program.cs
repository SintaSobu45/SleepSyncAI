using Google.GenAI;
using Microsoft.OpenApi.Models;
using QuestPDF.Infrastructure;
using SleepSyncAI.Api.Models;
using SleepSyncAI.Api.Services;

// QuestPDF License & Font Configuration
QuestPDF.Settings.License = LicenseType.Community;
QuestPDF.Settings.UseSystemFonts = true;

// Self-Test Mode for CI/Verification
if (args.Contains("--test-run"))
{
    Console.WriteLine("==================================================");
    Console.WriteLine("Running SleepSync AI Automated Verification Tests");
    Console.WriteLine("==================================================");

    var classifier = new ChronotypeClassificationService();
    var pdfService = new PdfReportService();

    // Test 1: Intermediate Chronotype
    var reqInter = new SleepAnalysisRequest
    {
        Bedtime = "23:00",
        WakeUpTime = "07:00",
        NaturalSleepyTime = "23:00",
        PreferredBedtime = "23:30",
        NaturalWakeTime = "07:00",
        PreferredWakeTime = "07:30",
        AverageSleepHours = 7.5,
        EnergyPeak = "LateMorning",
        MentalAlertnessPeak = "Morning",
        AnalyticalWindow = "Morning",
        PreferredSchedule = "Flexible",
        HasAfternoonDip = "YesNoticeable"
    };
    var resInter = classifier.ClassifyAndBuildReport(reqInter);
    Console.WriteLine($"✓ Test 1 (Intermediate): Category = '{resInter.Chronotype.Category}', Display = '{resInter.Chronotype.DisplayName}', Confidence = '{resInter.Chronotype.Confidence}'");
    if (resInter.Chronotype.Category != "Intermediate") throw new Exception("Test 1 Failed: Expected Intermediate");

    // Test 2: AM-Shifted Chronotype
    var reqAm = new SleepAnalysisRequest
    {
        Bedtime = "21:30",
        WakeUpTime = "05:30",
        NaturalSleepyTime = "21:00",
        PreferredBedtime = "21:30",
        NaturalWakeTime = "05:30",
        PreferredWakeTime = "06:00",
        AverageSleepHours = 8.0,
        EnergyPeak = "EarlyMorning",
        MentalAlertnessPeak = "Morning",
        AnalyticalWindow = "EarlyMorning",
        PreferredSchedule = "Early",
        MorningRefreshedLevel = "FullyRefreshed",
        WeekendSleepShift = "None"
    };
    var resAm = classifier.ClassifyAndBuildReport(reqAm);
    Console.WriteLine($"✓ Test 2 (AM-Shifted): Category = '{resAm.Chronotype.Category}', Display = '{resAm.Chronotype.DisplayName}', Confidence = '{resAm.Chronotype.Confidence}'");
    if (resAm.Chronotype.Category != "AM-Shifted") throw new Exception("Test 2 Failed: Expected AM-Shifted");

    // Test 3: PM-Shifted Chronotype
    var reqPm = new SleepAnalysisRequest
    {
        Bedtime = "01:30",
        WakeUpTime = "09:30",
        NaturalSleepyTime = "01:30",
        PreferredBedtime = "02:00",
        NaturalWakeTime = "09:30",
        PreferredWakeTime = "10:00",
        AverageSleepHours = 8.0,
        EnergyPeak = "Night",
        MentalAlertnessPeak = "Night",
        AnalyticalWindow = "Evening",
        PreferredSchedule = "Late",
        MorningRefreshedLevel = "Tired",
        WeekendSleepShift = "MoreThan2Hours"
    };
    var resPm = classifier.ClassifyAndBuildReport(reqPm);
    Console.WriteLine($"✓ Test 3 (PM-Shifted): Category = '{resPm.Chronotype.Category}', Display = '{resPm.Chronotype.DisplayName}', Confidence = '{resPm.Chronotype.Confidence}'");
    if (resPm.Chronotype.Category != "PM-Shifted") throw new Exception("Test 3 Failed: Expected PM-Shifted");

    // Test 4: PDF Report Generation
    var pdfBytes = pdfService.GenerateReport(reqInter, resInter);
    Console.WriteLine($"✓ Test 4 (QuestPDF Executive Report): Generated {pdfBytes.Length} bytes.");
    if (pdfBytes.Length < 1000) throw new Exception("Test 4 Failed: PDF size is suspiciously small");

    // Check PDF header
    var headerStr = System.Text.Encoding.ASCII.GetString(pdfBytes[..8]);
    Console.WriteLine($"✓ Test 4 PDF Header: '{headerStr}'");
    if (!headerStr.StartsWith("%PDF")) throw new Exception("Test 4 Failed: Output does not start with %PDF header");

    Console.WriteLine("==================================================");
    Console.WriteLine("ALL AUTOMATED VERIFICATION TESTS PASSED (4/4)!");
    Console.WriteLine("==================================================");
    return;
}

var builder = WebApplication.CreateBuilder(args);

// Controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SleepSync AI — Chronotype & Sleep Rhythm API",
        Version = "v2",
        Description = "API for personalized chronotype analysis, circadian energy curve modeling, and PDF report generation."
    });
});

// CORS: support local dev ports and production frontend domains
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000",
                "https://sleepsyncaiclient.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Register Core Scientific Chronotype Classification Service
builder.Services.AddSingleton<ChronotypeClassificationService>();

// AI Service Registration with Safe Fallback
var geminiApiKey = builder.Configuration["Gemini:ApiKey"]
                   ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

if (!string.IsNullOrWhiteSpace(geminiApiKey))
{
    builder.Services.AddSingleton(new Client(apiKey: geminiApiKey));
    builder.Services.AddScoped<ISleepAnalyzerService, GeminiAnalyzerService>();
    Console.WriteLine("✓ Google Gemini AI service configured with structured schema.");
}
else
{
    builder.Services.AddScoped<ISleepAnalyzerService, RuleBasedAnalyzerService>();
    Console.WriteLine("ℹ No Gemini API key found — using scientific rule-based analysis fallback.");
}

// PDF Service
builder.Services.AddScoped<PdfReportService>();

var app = builder.Build();

// Swagger enabled in Development and Production for portfolio inspection
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "SleepSync AI API v2");
    options.RoutePrefix = "swagger";
});

// Global exception handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            error = "An unexpected error occurred while processing your circadian analysis. Please try again."
        });
    });
});

app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
