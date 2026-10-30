using Microsoft.AspNetCore.Mvc;
using SleepSyncAI.Api.Models;
using SleepSyncAI.Api.Services;

namespace SleepSyncAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SleepController : ControllerBase
{
    private readonly ISleepAnalyzerService _analyzer;
    private readonly PdfReportService _pdfService;
    private readonly ILogger<SleepController> _logger;

    public SleepController(
        ISleepAnalyzerService analyzer,
        PdfReportService pdfService,
        ILogger<SleepController> logger)
    {
        _analyzer = analyzer;
        _pdfService = pdfService;
        _logger = logger;
    }

    /// <summary>
    /// Analyzes the user's self-reported sleep and circadian questionnaire data.
    /// Returns comprehensive chronotype classification, daily energy curve, personalized schedule, and scientific references.
    /// </summary>
    [HttpPost("analyze")]
    [ProducesResponseType(typeof(SleepAnalysisResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Analyze([FromBody] SleepAnalysisRequest request)
    {
        // Additional time parsing validation
        if (!TimeSpan.TryParse(request.Bedtime, out _))
        {
            ModelState.AddModelError(nameof(request.Bedtime), "Bedtime is not a valid 24-hour time format (HH:mm).");
            return ValidationProblem(ModelState);
        }

        if (!TimeSpan.TryParse(request.WakeUpTime, out _))
        {
            ModelState.AddModelError(nameof(request.WakeUpTime), "Wake-up time is not a valid 24-hour time format (HH:mm).");
            return ValidationProblem(ModelState);
        }

        // Sanitize optional notes — strip any HTML tags
        if (!string.IsNullOrEmpty(request.Notes))
        {
            request.Notes = System.Text.RegularExpressions.Regex.Replace(request.Notes, "<[^>]*>", string.Empty);
            if (request.Notes.Length > 500)
            {
                request.Notes = request.Notes[..500];
            }
        }

        var result = await _analyzer.AnalyzeAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Generates an executive multi-page PDF Chronotype Assessment Report.
    /// Re-executes the analysis on the server to guarantee data integrity.
    /// </summary>
    [HttpPost("report")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateReport([FromBody] SleepAnalysisRequest request)
    {
        if (!TimeSpan.TryParse(request.Bedtime, out _))
        {
            ModelState.AddModelError(nameof(request.Bedtime), "Bedtime is not a valid 24-hour time format (HH:mm).");
            return ValidationProblem(ModelState);
        }

        if (!TimeSpan.TryParse(request.WakeUpTime, out _))
        {
            ModelState.AddModelError(nameof(request.WakeUpTime), "Wake-up time is not a valid 24-hour time format (HH:mm).");
            return ValidationProblem(ModelState);
        }

        if (!string.IsNullOrEmpty(request.Notes))
        {
            request.Notes = System.Text.RegularExpressions.Regex.Replace(request.Notes, "<[^>]*>", string.Empty);
            if (request.Notes.Length > 500)
            {
                request.Notes = request.Notes[..500];
            }
        }

        // Re-run analysis server-side to prevent client tampering
        var analysis = await _analyzer.AnalyzeAsync(request);

        var pdfBytes = _pdfService.GenerateReport(request, analysis);

        return File(pdfBytes, "application/pdf", "SleepSync-Chronotype-Report.pdf");
    }
}
