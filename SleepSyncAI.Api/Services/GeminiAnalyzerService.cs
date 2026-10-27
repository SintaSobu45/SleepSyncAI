using System.Text.Json;
using Google.GenAI;
using SleepSyncAI.Api.Models;

namespace SleepSyncAI.Api.Services;

/// <summary>
/// AI-powered sleep analyzer using Google Gemini.
/// Falls back to RuleBasedAnalyzerService if the AI response is unusable.
/// </summary>
public class GeminiAnalyzerService : ISleepAnalyzerService
{
    private readonly Client _client;
    private readonly string _model;
    private readonly RuleBasedAnalyzerService _fallback;
    private readonly ILogger<GeminiAnalyzerService> _logger;

    public GeminiAnalyzerService(Client client, IConfiguration config, ILogger<GeminiAnalyzerService> logger)
    {
        _client = client;
        _model = config["Gemini:Model"] ?? "gemini-2.0-flash";
        _fallback = new RuleBasedAnalyzerService();
        _logger = logger;
    }

    public async Task<SleepAnalysisResponse> AnalyzeAsync(SleepAnalysisRequest request)
    {
        try
        {
            var prompt = BuildPrompt(request);
            var response = await _client.Models.GenerateContentAsync(
                model: _model,
                contents: prompt
            );

            var text = response.Text;
            if (string.IsNullOrWhiteSpace(text))
            {
                _logger.LogWarning("Gemini returned empty response, falling back to rule-based analysis.");
                return await _fallback.AnalyzeAsync(request);
            }

            var parsed = ParseAiResponse(text, request);
            if (parsed != null)
            {
                return parsed;
            }

            _logger.LogWarning("Could not parse Gemini response, falling back to rule-based analysis.");
            return await _fallback.AnalyzeAsync(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gemini API call failed, falling back to rule-based analysis.");
            return await _fallback.AnalyzeAsync(request);
        }
    }

    private static string BuildPrompt(SleepAnalysisRequest request)
    {
        var bedtime = TimeSpan.Parse(request.Bedtime);
        var wakeUp = TimeSpan.Parse(request.WakeUpTime);
        double calculatedHours = RuleBasedAnalyzerService.CalculateSleepDuration(bedtime, wakeUp);

        return $@"You are a friendly wellness assistant. Analyze the following self-reported sleep data and provide helpful, non-medical insights.

IMPORTANT RULES:
- Do NOT diagnose any sleep disorder or medical condition.
- Do NOT claim to determine a biological chronotype from this limited data.
- Use cautious, encouraging language.
- Be practical and specific to the user's data.

USER DATA:
- Bedtime: {request.Bedtime}
- Wake-up time: {request.WakeUpTime}
- Calculated sleep window: approximately {calculatedHours:0.#} hours
- Self-reported average sleep: {request.AverageSleepHours} hours
- Time of peak energy: {request.EnergyPeak}
- Preferred schedule type: {request.PreferredSchedule}
- Additional notes: {(string.IsNullOrWhiteSpace(request.Notes) ? "None provided" : request.Notes)}

Respond ONLY with valid JSON in this exact format (no markdown, no code fences, no extra text):
{{
  ""summary"": ""A 2-3 sentence summary of their reported sleep pattern."",
  ""estimatedPreference"": ""One of: Early-oriented, Intermediate, or Late-oriented"",
  ""reportedSleepDuration"": ""{request.AverageSleepHours} hours (calculated interval: ~{calculatedHours:0.#} hours)"",
  ""suggestions"": [
    ""First specific personalized suggestion"",
    ""Second specific personalized suggestion"",
    ""Third specific personalized suggestion""
  ],
  ""generalRecommendations"": [
    ""First general sleep recommendation"",
    ""Second general sleep recommendation"",
    ""Third general sleep recommendation"",
    ""Fourth general sleep recommendation"",
    ""Fifth general sleep recommendation""
  ],
  ""disclaimer"": ""This is an informal wellness estimate based on your self-reported data. It is not a clinical chronotype assessment or medical diagnosis. For sleep concerns, please consult a qualified healthcare professional.""
}}";
    }

    private SleepAnalysisResponse? ParseAiResponse(string text, SleepAnalysisRequest request)
    {
        try
        {
            // Clean up the response - remove any markdown code fences if present
            var cleaned = text.Trim();
            if (cleaned.StartsWith("```"))
            {
                var firstNewline = cleaned.IndexOf('\n');
                if (firstNewline > 0)
                    cleaned = cleaned[(firstNewline + 1)..];
                if (cleaned.EndsWith("```"))
                    cleaned = cleaned[..^3];
                cleaned = cleaned.Trim();
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var parsed = JsonSerializer.Deserialize<SleepAnalysisResponse>(cleaned, options);
            if (parsed == null) return null;

            // Validate the parsed response has essential fields
            if (string.IsNullOrWhiteSpace(parsed.Summary) ||
                string.IsNullOrWhiteSpace(parsed.EstimatedPreference) ||
                parsed.Suggestions == null || parsed.Suggestions.Count < 3)
            {
                return null;
            }

            // Ensure disclaimer is always present (don't trust AI to include it)
            parsed.Disclaimer = "This is an informal wellness estimate based on your self-reported data. " +
                                "It is not a clinical chronotype assessment or medical diagnosis. " +
                                "For sleep concerns, please consult a qualified healthcare professional.";

            // Ensure general recommendations exist
            if (parsed.GeneralRecommendations == null || parsed.GeneralRecommendations.Count == 0)
            {
                parsed.GeneralRecommendations = new List<string>
                {
                    "Keep your wake-up time reasonably consistent, even on days off.",
                    "Create a relaxing pre-sleep routine.",
                    "Keep your bedroom cool, dark, and quiet.",
                    "Avoid caffeine at least 6 hours before bedtime.",
                    "Track your energy levels to learn more about your patterns."
                };
            }

            return parsed;
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Failed to parse Gemini JSON response.");
            return null;
        }
    }
}
