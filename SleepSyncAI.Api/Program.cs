
using Google.GenAI;
using Microsoft.OpenApi.Models;
using QuestPDF.Infrastructure;
using SleepSyncAI.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// QuestPDF License
QuestPDF.Settings.License = LicenseType.Community;

// Controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SleepSync AI API",
        Version = "v1",
        Description = "Sleep pattern analysis and PDF report generation API."
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                 "https://sleepsyncaiclient.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// AI Service Registration
var geminiApiKey = builder.Configuration["Gemini:ApiKey"]
                   ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

if (!string.IsNullOrWhiteSpace(geminiApiKey))
{
    builder.Services.AddSingleton(new Client(apiKey: geminiApiKey));
    builder.Services.AddScoped<ISleepAnalyzerService, GeminiAnalyzerService>();
    Console.WriteLine("Gemini AI service configured.");
}
else
{
    builder.Services.AddScoped<ISleepAnalyzerService, RuleBasedAnalyzerService>();
    Console.WriteLine("No Gemini API key found. Using rule-based analysis.");
}

// PDF Service
builder.Services.AddScoped<PdfReportService>();

var app = builder.Build();

// Swagger enabled in Development and Production
app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Sleep Sync AI API v1");
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
            error = "An unexpected error occurred. Please try again later."
        });
    });
});

app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
