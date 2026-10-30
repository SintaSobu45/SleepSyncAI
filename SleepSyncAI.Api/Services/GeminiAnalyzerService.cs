using System.Text.Json;
using Google.GenAI;
using SleepSyncAI.Api.Models;

namespace SleepSyncAI.Api.Services;

/// <summary>
/// AI-powered personalization engine using Google Gemini.
/// Takes pre-calculated scientific chronotype results and enhances them with personalized,
/// conversational explanations, actionable afternoon dip strategies, and schedule commentary.
/// Always falls back safely to RuleBasedAnalyzerService if Gemini is unavailable or returns invalid data.
/// </summary>
public class GeminiAnalyzerService : ISleepAnalyzerService
{
    private readonly Client _client;
    private readonly string _model;
    private readonly ChronotypeClassificationService _classifier;
    private readonly RuleBasedAnalyzerService _fallback;
    private readonly ILogger<GeminiAnalyzerService> _logger;

    public GeminiAnalyzerService(
        Client client,
        IConfiguration config,
        ChronotypeClassificationService classifier,
        ILogger<GeminiAnalyzerService> logger)
    {
        _client = client;
        _model = config["Gemini:Model"] ?? "gemini-2.0-flash";
        _classifier = classifier;
        _fallback = new RuleBasedAnalyzerService(_classifier);
        _logger = logger;
    }

    public async Task<SleepAnalysisResponse> AnalyzeAsync(SleepAnalysisRequest request)
    {
        // 1. Calculate baseline deterministic chronotype and schedule
        var baseline = _classifier.ClassifyAndBuildReport(request);

        try
        {
            var prompt = BuildPrompt(request, baseline);

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(12));

            var response = await _client.Models.GenerateContentAsync(
                model: _model,
                contents: prompt
            );

            var text = response.Text;
            if (string.IsNullOrWhiteSpace(text))
            {
                _logger.LogWarning("Gemini returned empty text response; using rule-based analysis.");
                return baseline;
            }

            var enhanced = MergeAiEnhancement(baseline, text);
            if (enhanced != null)
            {
                enhanced.AiGenerated = true;
                return enhanced;
            }

            _logger.LogWarning("Could not parse or validate Gemini response; using rule-based analysis.");
            return baseline;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Gemini API call failed or timed out. Falling back to rule-based analysis.");
            return baseline;
        }
    }

    private static string BuildPrompt(SleepAnalysisRequest request, SleepAnalysisResponse baseline)
    {
        return $@"You are a circadian biology and sleep wellness consultant for SleepSync AI.
Analyze the user's self-reported sleep data and enrich their Chronotype Report with warm, evidence-based, actionable guidance.

STRICT MEDICAL & SAFETY RULES:
1. This is an EDUCATIONAL WELLNESS report, NOT a medical assessment.
2. Do NOT diagnose any medical or sleep disorder (e.g. insomnia, sleep apnea, delayed sleep phase syndrome).
3. Do NOT prescribe medications, supplements, melatonin dosages, or medical treatments.
4. Do NOT alter the pre-calculated chronotype classification: '{baseline.Chronotype.DisplayName}'.
5. Do NOT invent fake research citations or journal DOIs.

PRE-CALCULATED RESULTS:
- Chronotype Category: {baseline.Chronotype.DisplayName}
- Confidence: {baseline.Chronotype.Confidence}
- Preferred Bedtime: {baseline.SleepProfile.PreferredBedtime}
- Preferred Wake Time: {baseline.SleepProfile.PreferredWakeTime}
- Sleep Window: ~{baseline.SleepProfile.CalculatedSleepWindowHours} hours (Self-reported: {baseline.SleepProfile.AverageSleepDuration}h)
- Midpoint of Sleep: {baseline.SleepProfile.MidpointOfSleep}
- Peak Energy Window: {baseline.EnergyCurve.Peak.TimeWindowFormatted}
- Afternoon Dip Window: {baseline.EnergyCurve.Dip.TimeWindowFormatted}
- Creative Recovery Window: {baseline.EnergyCurve.Recovery.TimeWindowFormatted}

USER'S REPORTED CONTEXT:
- Work Schedule: {request.WorkSchedule}
- Exercise Frequency & Timing: {request.ExerciseFrequency} ({request.ExerciseTiming})
- Caffeine Habit: {request.CaffeineConsumption} (Cutoff: {request.CaffeineCutoffTime})
- Pre-bed Screen Use: {request.ScreenBeforeBed}
- Weekend Schedule Shift: {request.WeekendSleepShift}
- Sleep Onset Difficulty: {request.SleepOnsetDifficulty}
- Morning Refreshed Level: {request.MorningRefreshedLevel}
- Daytime Fatigue: {request.DaytimeFatigue}
- Afternoon Dip Experience: {request.HasAfternoonDip}
- User Notes: {(string.IsNullOrWhiteSpace(request.Notes) ? "None provided" : request.Notes)}

Respond ONLY with a valid JSON object matching this exact schema (no markdown, no backticks, no code fences):
{{
  ""personalizedSummary"": ""3-4 engaging sentences summarizing how their sleep habits shape their daily circadian rhythm."",
  ""chronotypeExplanation"": ""A detailed, personalized 2-paragraph explanation of their {baseline.Chronotype.DisplayName} rhythm, explaining why they feel energetic at certain times and how their biology operates."",
  ""peakPeriodInsight"": ""Personalized guidance on maximizing their {baseline.EnergyCurve.Peak.TimeWindowFormatted} peak focus window, tailored to their work/study style."",
  ""afternoonDipStrategy"": ""Practical, specific suggestions to manage their {baseline.EnergyCurve.Dip.TimeWindowFormatted} afternoon dip without relying on late caffeine."",
  ""recoveryPeriodInsight"": ""Suggestions for their {baseline.EnergyCurve.Recovery.TimeWindowFormatted} recovery and creative window."",
  ""personalizedSuggestions"": [
    ""First specific actionable suggestion tailored to their inputs"",
    ""Second specific actionable suggestion tailored to their inputs"",
    ""Third specific actionable suggestion tailored to their inputs""
  ]
}}";
    }

    private SleepAnalysisResponse? MergeAiEnhancement(SleepAnalysisResponse baseline, string aiText)
    {
        try
        {
            var cleaned = aiText.Trim();
            if (cleaned.StartsWith("```"))
            {
                var firstNewline = cleaned.IndexOf('\n');
                if (firstNewline > 0)
                    cleaned = cleaned[(firstNewline + 1)..];
                if (cleaned.EndsWith("```"))
                    cleaned = cleaned[..^3];
                cleaned = cleaned.Trim();
            }

            using var doc = JsonDocument.Parse(cleaned);
            var root = doc.RootElement;

            if (root.TryGetProperty("personalizedSummary", out var summaryProp) &&
                !string.IsNullOrWhiteSpace(summaryProp.GetString()))
            {
                baseline.Summary = summaryProp.GetString()!;
            }

            if (root.TryGetProperty("chronotypeExplanation", out var explProp) &&
                !string.IsNullOrWhiteSpace(explProp.GetString()))
            {
                baseline.Chronotype.Explanation = explProp.GetString()!;
            }

            if (root.TryGetProperty("peakPeriodInsight", out var peakProp) &&
                !string.IsNullOrWhiteSpace(peakProp.GetString()))
            {
                baseline.EnergyCurve.Peak.Description = peakProp.GetString()!;
            }

            if (root.TryGetProperty("afternoonDipStrategy", out var dipProp) &&
                !string.IsNullOrWhiteSpace(dipProp.GetString()))
            {
                baseline.EnergyCurve.Dip.Description = dipProp.GetString()!;
            }

            if (root.TryGetProperty("recoveryPeriodInsight", out var recProp) &&
                !string.IsNullOrWhiteSpace(recProp.GetString()))
            {
                baseline.EnergyCurve.Recovery.Description = recProp.GetString()!;
            }

            if (root.TryGetProperty("personalizedSuggestions", out var suggProp) &&
                suggProp.ValueKind == JsonValueKind.Array)
            {
                var newSuggestions = new List<string>();
                foreach (var item in suggProp.EnumerateArray())
                {
                    var s = item.GetString();
                    if (!string.IsNullOrWhiteSpace(s))
                    {
                        newSuggestions.Add(s);
                    }
                }

                if (newSuggestions.Count >= 3)
                {
                    baseline.Suggestions = newSuggestions;
                }
            }

            return baseline;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse and merge Gemini response JSON.");
            return null;
        }
    }
}
