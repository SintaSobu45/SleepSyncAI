using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SleepSyncAI.Api.Models;

namespace SleepSyncAI.Api.Services;

/// <summary>
/// Generates professional PDF reports using QuestPDF.
/// </summary>
public class PdfReportService
{
    // Brand colors
    private static readonly string PrimaryHex = "#0F172A";
    private static readonly string AccentHex = "#14B8A6";
    private static readonly string LightBgHex = "#F8FAFC";

    public byte[] GenerateReport(SleepAnalysisRequest request, SleepAnalysisResponse analysis)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(11).FontColor(PrimaryHex));

                // ── Header ──
                page.Header().Column(header =>
                {
                    header.Item().Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("SleepSync AI")
                                .FontSize(24).Bold().FontColor(AccentHex);
                            col.Item().Text("Sleep Pattern Analysis Report")
                                .FontSize(12).FontColor(Colors.Grey.Medium);
                        });
                        row.ConstantItem(120).AlignRight().AlignMiddle()
                            .Text(DateTime.Now.ToString("MMMM dd, yyyy"))
                            .FontSize(10).FontColor(Colors.Grey.Darken1);
                    });
                    header.Item().PaddingTop(8).LineHorizontal(1).LineColor(AccentHex);
                });

                // ── Content ──
                page.Content().PaddingVertical(15).Column(content =>
                {
                    content.Spacing(14);

                    // Section 1: Sleep Schedule
                    content.Item().Column(section =>
                    {
                        SectionHeading(section, "Your Sleep Schedule");
                        section.Item().PaddingLeft(10).Column(details =>
                        {
                            details.Spacing(4);
                            InfoRow(details, "Bedtime", request.Bedtime);
                            InfoRow(details, "Wake-up Time", request.WakeUpTime);
                            InfoRow(details, "Peak Energy", FormatEnergyPeak(request.EnergyPeak));
                            InfoRow(details, "Preferred Schedule", request.PreferredSchedule);
                            InfoRow(details, "Reported Sleep Duration", analysis.ReportedSleepDuration);
                            if (!string.IsNullOrWhiteSpace(request.Notes))
                            {
                                InfoRow(details, "Additional Notes", request.Notes);
                            }
                        });
                    });

                    // Section 2: Pattern Summary
                    content.Item().Column(section =>
                    {
                        SectionHeading(section, "Pattern Summary");
                        section.Item().PaddingLeft(10)
                            .Text(analysis.Summary).FontSize(11).LineHeight(1.5f);
                    });

                    // Section 3: Estimated Preference
                    content.Item().Column(section =>
                    {
                        SectionHeading(section, "Estimated Schedule Preference");
                        section.Item().PaddingLeft(10).Column(col =>
                        {
                            col.Item().Row(row =>
                            {
                                row.AutoItem().Background(AccentHex)
                                    .Padding(6, Unit.Point).PaddingLeft(12).PaddingRight(12)
                                    .Text(analysis.EstimatedPreference)
                                    .FontSize(13).Bold().FontColor(Colors.White);
                            });
                            col.Item().PaddingTop(6)
                                .Text("This preference is estimated from your self-reported bedtime, " +
                                      "energy peak, and schedule preference. It is an informal indicator, " +
                                      "not a scientific measurement.")
                                .FontSize(9).Italic().FontColor(Colors.Grey.Darken1);
                        });
                    });

                    // Section 4: Personalized Suggestions
                    content.Item().Column(section =>
                    {
                        SectionHeading(section, "Personalized Suggestions");
                        section.Item().PaddingLeft(10).Column(list =>
                        {
                            list.Spacing(6);
                            for (int i = 0; i < analysis.Suggestions.Count; i++)
                            {
                                var index = i;
                                list.Item().Row(row =>
                                {
                                    row.AutoItem().Width(20)
                                        .Text($"{index + 1}.").Bold().FontColor(AccentHex);
                                    row.RelativeItem()
                                        .Text(analysis.Suggestions[index])
                                        .FontSize(11).LineHeight(1.4f);
                                });
                            }
                        });
                    });

                    // Section 5: General Recommendations
                    content.Item().Column(section =>
                    {
                        SectionHeading(section, "General Sleep Recommendations");
                        section.Item().PaddingLeft(10).Column(list =>
                        {
                            list.Spacing(5);
                            foreach (var rec in analysis.GeneralRecommendations)
                            {
                                list.Item().Row(row =>
                                {
                                    row.AutoItem().Width(16)
                                        .Text("•").Bold().FontColor(AccentHex);
                                    row.RelativeItem()
                                        .Text(rec).FontSize(10.5f).LineHeight(1.4f);
                                });
                            }
                        });
                    });

                    // Section 6: Disclaimer
                    content.Item().PaddingTop(10).Column(section =>
                    {
                        section.Item().LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);
                        section.Item().PaddingTop(8)
                            .Background(LightBgHex).Padding(12).Column(box =>
                            {
                                box.Item().Text("Wellness Disclaimer").FontSize(10).Bold()
                                    .FontColor(Colors.Grey.Darken2);
                                box.Item().PaddingTop(4)
                                    .Text(analysis.Disclaimer)
                                    .FontSize(9).LineHeight(1.5f)
                                    .FontColor(Colors.Grey.Darken1);
                            });
                    });
                });

                // ── Footer ──
                page.Footer().Column(footer =>
                {
                    footer.Item().LineHorizontal(0.5f).LineColor(Colors.Grey.Lighten2);
                    footer.Item().PaddingTop(5).Row(row =>
                    {
                        row.RelativeItem().Text("SleepSync AI — Wellness Report")
                            .FontSize(8).FontColor(Colors.Grey.Medium);
                        row.RelativeItem().AlignRight().Text(text =>
                        {
                            text.DefaultTextStyle(x => x.FontSize(8).FontColor(Colors.Grey.Medium));
                            text.Span("Page ");
                            text.CurrentPageNumber();
                            text.Span(" of ");
                            text.TotalPages();
                        });
                    });
                });
            });
        });

        return document.GeneratePdf();
    }

    private static void SectionHeading(ColumnDescriptor column, string title)
    {
        column.Item().PaddingBottom(4).Text(title)
            .FontSize(14).Bold().FontColor(PrimaryHex);
    }

    private static void InfoRow(ColumnDescriptor column, string label, string value)
    {
        column.Item().Row(row =>
        {
            row.ConstantItem(160).Text(label + ":").Bold().FontSize(10.5f);
            row.RelativeItem().Text(value).FontSize(10.5f);
        });
    }

    private static string FormatEnergyPeak(string energyPeak)
    {
        return energyPeak switch
        {
            "EarlyMorning" => "Early Morning",
            "LateMorning" => "Late Morning",
            _ => energyPeak
        };
    }
}
