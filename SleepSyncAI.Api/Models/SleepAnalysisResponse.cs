namespace SleepSyncAI.Api.Models;

/// <summary>
/// Comprehensive Chronotype & Sleep Rhythm Assessment response.
/// Retains legacy fields (Summary, EstimatedPreference, Suggestions, etc.) for backwards compatibility,
/// while providing rich structured data for the professional multi-section report and charts.
/// </summary>
public class SleepAnalysisResponse
{
    // ==========================================
    // Core Chronotype Assessment
    // ==========================================

    /// <summary>
    /// Detailed chronotype classification data.
    /// </summary>
    public ChronotypeResultDto Chronotype { get; set; } = new();

    /// <summary>
    /// Calculated sleep metrics and profile.
    /// </summary>
    public SleepProfileDto SleepProfile { get; set; } = new();

    /// <summary>
    /// Daily energy curve phases (Peak, Dip, Recovery, Wind-down, Sleep).
    /// </summary>
    public EnergyCurveDto EnergyCurve { get; set; } = new();

    /// <summary>
    /// 24-hour hourly energy points for chart visualization (00:00 - 23:00).
    /// </summary>
    public List<HourlyEnergyPointDto> HourlyCurve { get; set; } = new();

    /// <summary>
    /// Tailored recommendations grouped by theme.
    /// </summary>
    public List<PersonalizedRecommendationDto> PersonalizedRecommendations { get; set; } = new();

    /// <summary>
    /// Suggested 24-hour schedule tailored to the user's chronotype and timing.
    /// </summary>
    public List<DailyScheduleItemDto> DailySchedule { get; set; } = new();

    /// <summary>
    /// Verified peer-reviewed and authoritative scientific citations.
    /// </summary>
    public List<ScientificReferenceDto> ScientificReferences { get; set; } = new();

    /// <summary>
    /// Indicates whether personalized prose was enhanced via Google Gemini AI.
    /// </summary>
    public bool AiGenerated { get; set; }

    // ==========================================
    // Backwards Compatibility Fields
    // ==========================================

    public string Summary { get; set; } = string.Empty;
    public string EstimatedPreference { get; set; } = string.Empty;
    public string ReportedSleepDuration { get; set; } = string.Empty;
    public List<string> Suggestions { get; set; } = new();
    public List<string> GeneralRecommendations { get; set; } = new();
    public string Disclaimer { get; set; } = string.Empty;
}

public class ChronotypeResultDto
{
    /// <summary>
    /// Technical category: "AM-Shifted", "Intermediate", or "PM-Shifted".
    /// </summary>
    public string Category { get; set; } = "Intermediate";

    /// <summary>
    /// User-friendly label (e.g. "Bi-Phasic / Intermediate", "AM-Shifted (Morning-Oriented)").
    /// </summary>
    public string DisplayName { get; set; } = "Bi-Phasic / Intermediate";

    /// <summary>
    /// Short tagline / archetype description.
    /// </summary>
    public string Tagline { get; set; } = string.Empty;

    /// <summary>
    /// Comprehensive personalized explanation of the chronotype result.
    /// </summary>
    public string Explanation { get; set; } = string.Empty;

    /// <summary>
    /// Reliability/confidence rating: "High", "Moderate", or "Inconclusive".
    /// </summary>
    public string Confidence { get; set; } = "Moderate";

    /// <summary>
    /// Transparent breakdown of how the classification was calculated.
    /// </summary>
    public string CalculationBreakdown { get; set; } = string.Empty;

    /// <summary>
    /// Key strengths of this rhythm.
    /// </summary>
    public List<string> NaturalStrengths { get; set; } = new();

    /// <summary>
    /// Common rhythm vulnerabilities or friction points.
    /// </summary>
    public List<string> WatchOuts { get; set; } = new();
}

public class SleepProfileDto
{
    public string PreferredBedtime { get; set; } = string.Empty;
    public string PreferredWakeTime { get; set; } = string.Empty;
    public double AverageSleepDuration { get; set; }
    public double CalculatedSleepWindowHours { get; set; }
    public string MidpointOfSleep { get; set; } = string.Empty;
    public double SocialJetlagHours { get; set; }
    public string SleepQualityAssessment { get; set; } = string.Empty;
    public string SleepConsistencyRating { get; set; } = string.Empty;
}

public class EnergyCurveDto
{
    public EnergyPhaseDto Peak { get; set; } = new();
    public EnergyPhaseDto Dip { get; set; } = new();
    public EnergyPhaseDto Recovery { get; set; } = new();
    public EnergyPhaseDto WindDown { get; set; } = new();
    public EnergyPhaseDto SleepWindow { get; set; } = new();
}

public class EnergyPhaseDto
{
    public string Name { get; set; } = string.Empty;
    public string Start { get; set; } = string.Empty;
    public string End { get; set; } = string.Empty;
    public string TimeWindowFormatted { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string WhyItHappens { get; set; } = string.Empty;
    public List<string> RecommendedActivities { get; set; } = new();
    public List<string> ThingsToAvoid { get; set; } = new();
}

public class HourlyEnergyPointDto
{
    public int Hour { get; set; }
    public string TimeLabel { get; set; } = string.Empty;
    public int EnergyLevel { get; set; } // 0 to 100
    public string Phase { get; set; } = string.Empty; // "Peak", "Dip", "Recovery", "WindDown", "Sleep"
    public string SuggestedFocus { get; set; } = string.Empty;
}

public class PersonalizedRecommendationDto
{
    public string Category { get; set; } = string.Empty; // "Light Exposure", "Caffeine & Nutrition", "Wind-Down", "Activity Timing"
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ScientificRationale { get; set; } = string.Empty;
}

public class DailyScheduleItemDto
{
    public string Time { get; set; } = string.Empty; // e.g. "07:00"
    public string TimeLabel { get; set; } = string.Empty; // e.g. "7:00 AM"
    public string Activity { get; set; } = string.Empty;
    public string FocusType { get; set; } = string.Empty; // "Analytical", "Administrative", "Creative", "Rest", "Sleep"
    public string Notes { get; set; } = string.Empty;
}

public class ScientificReferenceDto
{
    public string Authors { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Citation { get; set; } = string.Empty;
    public string KeyTakeaway { get; set; } = string.Empty;
}
