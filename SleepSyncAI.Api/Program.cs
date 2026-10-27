using Google.GenAI;
using QuestPDF.Infrastructure;
using SleepSyncAI.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ── QuestPDF License ──
QuestPDF.Settings.License = LicenseType.Community;

// ── Controllers & Swagger ──
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "SleepSync AI API",
        Version = "v1",
        Description = "Sleep pattern analysis and PDF report generation API."
    });
});

// ── CORS ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",  // Vite dev server
                "http://localhost:3000"   // Alternate dev port
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── AI Service Registration ──
// Read API key from configuration (appsettings, user-secrets, or environment variable)
var geminiApiKey = builder.Configuration["Gemini:ApiKey"]
                   ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

if (!string.IsNullOrWhiteSpace(geminiApiKey))
{
    // Gemini API key is available — use AI-powered analyzer
    builder.Services.AddSingleton(new Client(apiKey: geminiApiKey));
    builder.Services.AddScoped<ISleepAnalyzerService, GeminiAnalyzerService>();
    Console.WriteLine("✓ Gemini AI service configured — using AI-powered analysis.");
}
else
{
    // No API key — use rule-based fallback
    builder.Services.AddScoped<ISleepAnalyzerService, RuleBasedAnalyzerService>();
    Console.WriteLine("ℹ No Gemini API key found — using rule-based analysis fallback.");
}

// ── PDF Service ──
builder.Services.AddScoped<PdfReportService>();

var app = builder.Build();

// ── Middleware Pipeline ──
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global exception handler — never expose stack traces to client
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
