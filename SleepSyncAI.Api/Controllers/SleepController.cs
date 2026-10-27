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

    public SleepController(ISleepAnalyzerService analyzer, PdfReportService pdfService, ILogger<SleepController> logger)
    {
        _analyzer = analyzer;
        _pdfService = pdfService;
        _logger = logger;
    }

    /// <summary>
    /// Analyzes the user's self-reported sleep data and returns personalized insights.
    /// </summary>
    [HttpPost("analyze")]
    [ProducesResponseType(typeof(SleepAnalysisResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Analyze([FromBody] SleepAnalysisRequest request)
    {
        // Model validation is handled automatically by [ApiController]
        // Additional validation for time parsing
        if (!TimeSpan.TryParse(request.Bedtime, out _))
        {
            ModelState.AddModelError(nameof(request.Bedtime), "Bedtime is not a valid time format.");
            return ValidationProblem(ModelState);
        }

        if (!TimeSpan.TryParse(request.WakeUpTime, out _))
        {
            ModelState.AddModelError(nameof(request.WakeUpTime), "Wake-up time is not a valid time format.");
            return ValidationProblem(ModelState);
        }

        // Sanitize notes — strip any HTML tags
        if (!string.IsNullOrEmpty(request.Notes))
        {
            request.Notes = System.Text.RegularExpressions.Regex.Replace(request.Notes, "<[^>]*>", string.Empty);
        }

        var result = await _analyzer.AnalyzeAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Generates a PDF report based on the user's sleep data.
    /// Re-runs the analysis on the server to ensure data integrity.
    /// </summary>
    [HttpPost("report")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateReport([FromBody] SleepAnalysisRequest request)
    {
        // Validate the same way as /analyze
        if (!TimeSpan.TryParse(request.Bedtime, out _))
        {
            ModelState.AddModelError(nameof(request.Bedtime), "Bedtime is not a valid time format.");
            return ValidationProblem(ModelState);
        }

        if (!TimeSpan.TryParse(request.WakeUpTime, out _))
        {
            ModelState.AddModelError(nameof(request.WakeUpTime), "Wake-up time is not a valid time format.");
            return ValidationProblem(ModelState);
        }

        if (!string.IsNullOrEmpty(request.Notes))
        {
            request.Notes = System.Text.RegularExpressions.Regex.Replace(request.Notes, "<[^>]*>", string.Empty);
        }

        // Re-run analysis server-side so we don't trust client-supplied analysis
        var analysis = await _analyzer.AnalyzeAsync(request);

        var pdfBytes = _pdfService.GenerateReport(request, analysis);

        return File(pdfBytes, "application/pdf", "SleepSync-Report.pdf");
    }
}
