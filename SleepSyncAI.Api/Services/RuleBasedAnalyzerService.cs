using SleepSyncAI.Api.Models;

namespace SleepSyncAI.Api.Services;

/// <summary>
/// Deterministic rule-based sleep & chronotype analyzer.
/// Produces a complete, professional chronotype assessment using scientific scoring principles
/// and acts as the infallible offline fallback when AI is unavailable.
/// </summary>
public class RuleBasedAnalyzerService : ISleepAnalyzerService
{
    private readonly ChronotypeClassificationService _classifier;

    public RuleBasedAnalyzerService(ChronotypeClassificationService? classifier = null)
    {
        _classifier = classifier ?? new ChronotypeClassificationService();
    }

    public Task<SleepAnalysisResponse> AnalyzeAsync(SleepAnalysisRequest request)
    {
        var response = _classifier.ClassifyAndBuildReport(request);
        return Task.FromResult(response);
    }

    public static double CalculateSleepDuration(TimeSpan bedtime, TimeSpan wakeUp)
    {
        return ChronotypeClassificationService.CalculateDuration(bedtime, wakeUp);
    }
}
