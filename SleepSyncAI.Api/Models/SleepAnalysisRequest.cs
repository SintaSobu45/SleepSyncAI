using System.ComponentModel.DataAnnotations;

namespace SleepSyncAI.Api.Models;

/// <summary>
/// Questionnaire submission data for sleep and chronotype analysis.
/// Supports both the comprehensive multi-step assessment and the classic 6-field submission for backwards compatibility.
/// </summary>
public class SleepAnalysisRequest
{
    // ==========================================
    // Section A: Natural Sleep Preferences
    // ==========================================

    /// <summary>
    /// Typical bedtime (HH:mm format, e.g., "23:00").
    /// </summary>
    [Required(ErrorMessage = "Bedtime is required.")]
    [RegularExpression(@"^([01]?\d|2[0-3]):[0-5]\d$", ErrorMessage = "Bedtime must be in HH:mm format (e.g., 23:00).")]
    public string Bedtime { get; set; } = "23:00";

    /// <summary>
    /// Typical wake-up time (HH:mm format, e.g., "07:00").
    /// </summary>
    [Required(ErrorMessage = "Wake-up time is required.")]
    [RegularExpression(@"^([01]?\d|2[0-3]):[0-5]\d$", ErrorMessage = "Wake-up time must be in HH:mm format (e.g., 07:00).")]
    public string WakeUpTime { get; set; } = "07:00";

    /// <summary>
    /// Time user feels naturally sleepy without forced wakefulness (HH:mm). Defaults to Bedtime if omitted.
    /// </summary>
    [RegularExpression(@"^([01]?\d|2[0-3]):[0-5]\d$", ErrorMessage = "Natural sleepy time must be in HH:mm format.")]
    public string? NaturalSleepyTime { get; set; }

    /// <summary>
    /// Preferred bedtime if user had no morning obligations (HH:mm). Defaults to Bedtime if omitted.
    /// </summary>
    [RegularExpression(@"^([01]?\d|2[0-3]):[0-5]\d$", ErrorMessage = "Preferred bedtime must be in HH:mm format.")]
    public string? PreferredBedtime { get; set; }

    /// <summary>
    /// Natural wake-up time without an alarm (HH:mm). Defaults to WakeUpTime if omitted.
    /// </summary>
    [RegularExpression(@"^([01]?\d|2[0-3]):[0-5]\d$", ErrorMessage = "Natural wake time must be in HH:mm format.")]
    public string? NaturalWakeTime { get; set; }

    /// <summary>
    /// Preferred wake-up time if user had no obligations (HH:mm). Defaults to WakeUpTime if omitted.
    /// </summary>
    [RegularExpression(@"^([01]?\d|2[0-3]):[0-5]\d$", ErrorMessage = "Preferred wake time must be in HH:mm format.")]
    public string? PreferredWakeTime { get; set; }

    /// <summary>
    /// Average hours of actual sleep per night.
    /// </summary>
    [Required(ErrorMessage = "Average sleep hours is required.")]
    [Range(1, 24, ErrorMessage = "Average sleep hours must be between 1 and 24.")]
    public double AverageSleepHours { get; set; } = 7.5;

    /// <summary>
    /// Shift in sleep schedule on weekends or days off ("None", "Under1Hour", "1To2Hours", "MoreThan2Hours").
    /// </summary>
    public string WeekendSleepShift { get; set; } = "Under1Hour";

    // ==========================================
    // Section B: Daily Energy Patterns
    // ==========================================

    /// <summary>
    /// Time period of peak energy ("EarlyMorning", "LateMorning", "Afternoon", "Evening", "Night").
    /// </summary>
    [Required(ErrorMessage = "Energy peak time is required.")]
    [RegularExpression(@"^(EarlyMorning|LateMorning|Afternoon|Evening|Night)$",
        ErrorMessage = "Energy peak must be one of: EarlyMorning, LateMorning, Afternoon, Evening, Night.")]
    public string EnergyPeak { get; set; } = "LateMorning";

    /// <summary>
    /// Time period of highest mental alertness ("Morning", "Midday", "LateAfternoon", "Night").
    /// </summary>
    public string MentalAlertnessPeak { get; set; } = "Morning";

    /// <summary>
    /// Time period of lowest energy / sluggishness ("EarlyMorning", "EarlyAfternoon", "LateAfternoon", "Evening").
    /// </summary>
    public string LowestEnergyTime { get; set; } = "EarlyAfternoon";

    /// <summary>
    /// Preferred window for complex or analytical work ("EarlyMorning", "Morning", "Afternoon", "Evening").
    /// </summary>
    public string AnalyticalWindow { get; set; } = "Morning";

    /// <summary>
    /// Preferred window for creative or exploratory work ("Morning", "Afternoon", "Evening", "LateNight").
    /// </summary>
    public string CreativeWindow { get; set; } = "Evening";

    /// <summary>
    /// Regularity of afternoon energy dip ("YesNoticeable", "YesModerate", "RarelyOrNone").
    /// </summary>
    public string HasAfternoonDip { get; set; } = "YesNoticeable";

    // ==========================================
    // Section C: Lifestyle & Sleep Habits
    // ==========================================

    /// <summary>
    /// Work or study schedule type ("StandardDay", "Flexible", "ShiftWork", "Student").
    /// </summary>
    public string WorkSchedule { get; set; } = "StandardDay";

    /// <summary>
    /// Exercise frequency ("Daily", "SeveralTimesAWeek", "OnceAWeek", "RarelyOrNever").
    /// </summary>
    public string ExerciseFrequency { get; set; } = "SeveralTimesAWeek";

    /// <summary>
    /// Exercise timing ("Morning", "Afternoon", "Evening", "None").
    /// </summary>
    public string ExerciseTiming { get; set; } = "Afternoon";

    /// <summary>
    /// Level of caffeine consumption ("None", "Low", "Moderate", "High").
    /// </summary>
    public string CaffeineConsumption { get; set; } = "Moderate";

    /// <summary>
    /// Cut-off time for caffeine ("BeforeNoon", "EarlyAfternoon", "LateAfternoon", "Evening", "NoCaffeine").
    /// </summary>
    public string CaffeineCutoffTime { get; set; } = "EarlyAfternoon";

    /// <summary>
    /// Mobile/screen device usage in the 30-60 min before bed ("Always", "Often", "Sometimes", "Never").
    /// </summary>
    public string ScreenBeforeBed { get; set; } = "Often";

    /// <summary>
    /// Frequency of waking during the night ("Rarely", "OncePerNight", "MultipleTimes").
    /// </summary>
    public string NightAwakenings { get; set; } = "Rarely";

    /// <summary>
    /// Daytime nap habits ("Never", "OccasionalPowerNap", "RegularNaps").
    /// </summary>
    public string NapHabit { get; set; } = "Never";

    /// <summary>
    /// Daytime fatigue frequency ("Rarely", "Occasionally", "Frequently").
    /// </summary>
    public string DaytimeFatigue { get; set; } = "Occasionally";

    // ==========================================
    // Section D: Sleep Quality & Consistency
    // ==========================================

    /// <summary>
    /// Typical sleep onset latency ("Under15Min", "15To30Min", "30To60Min", "Over60Min").
    /// </summary>
    public string SleepOnsetLatency { get; set; } = "15To30Min";

    /// <summary>
    /// Frequency of difficulty falling asleep ("Rarely", "Sometimes", "Often").
    /// </summary>
    public string SleepOnsetDifficulty { get; set; } = "Sometimes";

    /// <summary>
    /// How refreshed the user feels on waking ("FullyRefreshed", "ModeratelyRefreshed", "Tired", "Exhausted").
    /// </summary>
    public string MorningRefreshedLevel { get; set; } = "ModeratelyRefreshed";

    /// <summary>
    /// Consistency of day-to-day schedule ("VeryConsistent", "ModeratelyConsistent", "Variable", "Irregular").
    /// </summary>
    public string ScheduleConsistency { get; set; } = "ModeratelyConsistent";

    /// <summary>
    /// Frequency of daytime sleepiness ("Rarely", "Sometimes", "Often").
    /// </summary>
    public string DaytimeSleepiness { get; set; } = "Sometimes";

    // ==========================================
    // General & Backwards Compatibility
    // ==========================================

    /// <summary>
    /// Preferred schedule orientation ("Early", "Flexible", "Late").
    /// </summary>
    [Required(ErrorMessage = "Preferred schedule is required.")]
    [RegularExpression(@"^(Early|Flexible|Late)$",
        ErrorMessage = "Preferred schedule must be one of: Early, Flexible, Late.")]
    public string PreferredSchedule { get; set; } = "Flexible";

    /// <summary>
    /// Optional user notes or context (max 500 characters).
    /// </summary>
    [MaxLength(500, ErrorMessage = "Notes must be 500 characters or fewer.")]
    public string? Notes { get; set; }
}
