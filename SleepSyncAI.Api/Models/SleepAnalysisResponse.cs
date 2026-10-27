namespace SleepSyncAI.Api.Models;

public class SleepAnalysisResponse
{
    public string Summary { get; set; } = string.Empty;
    public string EstimatedPreference { get; set; } = string.Empty;
    public string ReportedSleepDuration { get; set; } = string.Empty;
    public List<string> Suggestions { get; set; } = new();
    public List<string> GeneralRecommendations { get; set; } = new();
    public string Disclaimer { get; set; } = string.Empty;
}
