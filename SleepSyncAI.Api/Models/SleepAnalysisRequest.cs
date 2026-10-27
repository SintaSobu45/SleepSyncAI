using System.ComponentModel.DataAnnotations;

namespace SleepSyncAI.Api.Models;

public class SleepAnalysisRequest
{
    [Required(ErrorMessage = "Bedtime is required.")]
    [RegularExpression(@"^([01]?\d|2[0-3]):[0-5]\d$", ErrorMessage = "Bedtime must be in HH:mm format (e.g., 23:00).")]
    public string Bedtime { get; set; } = string.Empty;

    [Required(ErrorMessage = "Wake-up time is required.")]
    [RegularExpression(@"^([01]?\d|2[0-3]):[0-5]\d$", ErrorMessage = "Wake-up time must be in HH:mm format (e.g., 07:00).")]
    public string WakeUpTime { get; set; } = string.Empty;

    [Required(ErrorMessage = "Energy peak time is required.")]
    [RegularExpression(@"^(EarlyMorning|LateMorning|Afternoon|Evening|Night)$",
        ErrorMessage = "Energy peak must be one of: EarlyMorning, LateMorning, Afternoon, Evening, Night.")]
    public string EnergyPeak { get; set; } = string.Empty;

    [Required(ErrorMessage = "Preferred schedule is required.")]
    [RegularExpression(@"^(Early|Flexible|Late)$",
        ErrorMessage = "Preferred schedule must be one of: Early, Flexible, Late.")]
    public string PreferredSchedule { get; set; } = string.Empty;

    [Required(ErrorMessage = "Average sleep hours is required.")]
    [Range(1, 24, ErrorMessage = "Average sleep hours must be between 1 and 24.")]
    public double AverageSleepHours { get; set; }

    [MaxLength(500, ErrorMessage = "Notes must be 500 characters or fewer.")]
    public string? Notes { get; set; }
}
