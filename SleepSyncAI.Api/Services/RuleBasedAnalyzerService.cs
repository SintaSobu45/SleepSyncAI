using SleepSyncAI.Api.Models;

namespace SleepSyncAI.Api.Services;

/// <summary>
/// Deterministic rule-based sleep analyzer.
/// Works without any external dependency — used as fallback when AI is unavailable.
/// </summary>
public class RuleBasedAnalyzerService : ISleepAnalyzerService
{
    public Task<SleepAnalysisResponse> AnalyzeAsync(SleepAnalysisRequest request)
    {
        // Parse times
        var bedtime = TimeSpan.Parse(request.Bedtime);
        var wakeUp = TimeSpan.Parse(request.WakeUpTime);

        // Calculate sleep duration handling midnight crossover
        double calculatedHours = CalculateSleepDuration(bedtime, wakeUp);
        double reportedHours = request.AverageSleepHours;

        // Determine schedule preference
        string preference = DeterminePreference(bedtime, request.EnergyPeak, request.PreferredSchedule);

        // Build summary
        string bedtimeLabel = FormatTime(bedtime);
        string wakeUpLabel = FormatTime(wakeUp);
        string summary = BuildSummary(bedtimeLabel, wakeUpLabel, calculatedHours, request.EnergyPeak, preference);

        // Generate personalized suggestions based on the user's specific data
        var suggestions = GenerateSuggestions(bedtime, wakeUp, calculatedHours, reportedHours, 
            request.EnergyPeak, request.PreferredSchedule, preference);

        // General recommendations
        var recommendations = GenerateRecommendations(calculatedHours, preference);

        var response = new SleepAnalysisResponse
        {
            Summary = summary,
            EstimatedPreference = preference,
            ReportedSleepDuration = $"{reportedHours:0.#} hours (calculated interval: ~{calculatedHours:0.#} hours)",
            Suggestions = suggestions,
            GeneralRecommendations = recommendations,
            Disclaimer = "This is an informal wellness estimate based on your self-reported data. " +
                         "It is not a clinical chronotype assessment or medical diagnosis. " +
                         "For sleep concerns, please consult a qualified healthcare professional."
        };

        return Task.FromResult(response);
    }

    /// <summary>
    /// Calculates hours between bedtime and wake-up, handling overnight schedules correctly.
    /// </summary>
    public static double CalculateSleepDuration(TimeSpan bedtime, TimeSpan wakeUp)
    {
        double hours;
        if (wakeUp >= bedtime)
        {
            // Same-day schedule (e.g., 01:00 → 09:00)
            hours = (wakeUp - bedtime).TotalHours;
        }
        else
        {
            // Overnight schedule (e.g., 23:00 → 07:00)
            hours = (TimeSpan.FromHours(24) - bedtime + wakeUp).TotalHours;
        }

        return Math.Round(hours, 1);
    }

    private static string DeterminePreference(TimeSpan bedtime, string energyPeak, string preferredSchedule)
    {
        // Score-based approach: lower score = early-oriented, higher = late-oriented
        int score = 0;

        // Bedtime scoring
        double bedHour = bedtime.TotalHours;
        if (bedHour >= 20 && bedHour < 22) score += 0;      // Early bedtime
        else if (bedHour >= 22 && bedHour < 23.5) score += 1; // Moderate bedtime
        else if (bedHour >= 23.5 || bedHour < 1) score += 2;  // Late bedtime
        else if (bedHour >= 1 && bedHour < 4) score += 3;     // Very late bedtime
        else score += 1; // Daytime/unusual — treat as moderate

        // Energy peak scoring
        score += energyPeak switch
        {
            "EarlyMorning" => 0,
            "LateMorning" => 1,
            "Afternoon" => 2,
            "Evening" => 3,
            "Night" => 4,
            _ => 1
        };

        // Preferred schedule scoring
        score += preferredSchedule switch
        {
            "Early" => 0,
            "Flexible" => 1,
            "Late" => 2,
            _ => 1
        };

        // Total score range: 0-9
        return score switch
        {
            <= 2 => "Early-oriented",
            <= 5 => "Intermediate",
            _ => "Late-oriented"
        };
    }

    private static string BuildSummary(string bedtime, string wakeUp, double hours, string energyPeak, string preference)
    {
        string energyDescription = energyPeak switch
        {
            "EarlyMorning" => "early morning",
            "LateMorning" => "late morning",
            "Afternoon" => "the afternoon",
            "Evening" => "the evening",
            "Night" => "nighttime",
            _ => energyPeak.ToLower()
        };

        return $"Based on your reported schedule, you typically go to bed around {bedtime} and wake up around {wakeUp}, " +
               $"giving you approximately {hours:0.#} hours of sleep. " +
               $"You report feeling most energetic during {energyDescription}. " +
               $"Your overall pattern suggests an {preference.ToLower()} schedule preference.";
    }

    private static List<string> GenerateSuggestions(TimeSpan bedtime, TimeSpan wakeUp, 
        double calculatedHours, double reportedHours, string energyPeak, 
        string preferredSchedule, string preference)
    {
        var suggestions = new List<string>();

        // Suggestion based on sleep duration
        if (calculatedHours < 6)
        {
            suggestions.Add("Your reported sleep window is under 6 hours. Most adults benefit from 7–9 hours. " +
                            "Consider gradually moving your bedtime earlier by 15–30 minutes each week.");
        }
        else if (calculatedHours > 9)
        {
            suggestions.Add("Your reported sleep window is over 9 hours. While some people need this much rest, " +
                            "consistently sleeping more than 9 hours may warrant a conversation with your doctor.");
        }
        else
        {
            suggestions.Add($"Your ~{calculatedHours:0.#}-hour sleep window falls within the commonly recommended 7–9 hour range. " +
                            "Try to keep this schedule consistent, even on weekends, to support your natural rhythm.");
        }

        // Suggestion based on energy peak vs schedule alignment
        if ((energyPeak == "EarlyMorning" || energyPeak == "LateMorning") && preferredSchedule == "Late")
        {
            suggestions.Add("Your energy peaks in the morning but you prefer a late schedule. " +
                            "You might be more productive by shifting important tasks to your morning energy window.");
        }
        else if ((energyPeak == "Evening" || energyPeak == "Night") && preferredSchedule == "Early")
        {
            suggestions.Add("Your energy peaks later in the day but you follow an early schedule. " +
                            "If possible, consider scheduling demanding tasks during your natural energy peak.");
        }
        else
        {
            suggestions.Add("Your energy peak and schedule preference appear well-aligned. " +
                            "Try to schedule your most important or demanding tasks during your peak energy window.");
        }

        // Suggestion based on bedtime habits
        double bedHour = bedtime.TotalHours;
        if (bedHour >= 0 && bedHour < 4)
        {
            suggestions.Add("Going to bed after midnight can make it harder to get morning sunlight, " +
                            "which helps regulate your internal clock. If this schedule works for you, " +
                            "ensure your room is fully dark and quiet during your sleep hours.");
        }
        else if (bedHour >= 20 && bedHour < 22)
        {
            suggestions.Add("Your early bedtime gives you a head start on rest. " +
                            "To protect this schedule, dim lights and reduce screen brightness at least 30 minutes before bed.");
        }
        else
        {
            suggestions.Add("Reduce bright-screen exposure for 30–60 minutes before your bedtime. " +
                            "Blue light from screens can interfere with your body's natural wind-down process.");
        }

        return suggestions;
    }

    private static List<string> GenerateRecommendations(double calculatedHours, string preference)
    {
        var recommendations = new List<string>
        {
            "Keep your wake-up time reasonably consistent, even on days off, to help stabilize your internal rhythm.",
            "Create a relaxing pre-sleep routine — reading, stretching, or deep breathing can signal your body to wind down.",
            "Keep your bedroom cool (around 65–68°F / 18–20°C), dark, and quiet for better sleep quality.",
            "Avoid caffeine at least 6 hours before your planned bedtime.",
            "Track your energy levels for a week or two to discover more about your personal patterns."
        };

        return recommendations;
    }

    private static string FormatTime(TimeSpan time)
    {
        int hour12 = time.Hours % 12;
        if (hour12 == 0) hour12 = 12;
        string amPm = time.Hours < 12 ? "AM" : "PM";
        return $"{hour12}:{time.Minutes:D2} {amPm}";
    }
}
