using SleepSyncAI.Api.Models;

namespace SleepSyncAI.Api.Services;

/// <summary>
/// Interface for sleep analysis services.
/// Both the rule-based fallback and the AI-powered analyzer implement this.
/// </summary>
public interface ISleepAnalyzerService
{
    Task<SleepAnalysisResponse> AnalyzeAsync(SleepAnalysisRequest request);
}
