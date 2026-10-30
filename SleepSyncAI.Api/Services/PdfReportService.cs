using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SleepSyncAI.Api.Models;

namespace SleepSyncAI.Api.Services;

/// <summary>
/// Generates a calm, welcoming, executive-grade PDF Sleep Rhythm Report using QuestPDF.
/// Styled with a soft wellness palette: Sage Green (#5B8C7A), Soft Ivory (#FBFDF9),
/// Slate (#334155), and gentle borders (#E2E8E3).
/// </summary>
public class PdfReportService
{
    // Calm, welcoming wellness palette
    private static readonly string TextPrimary = "#334155";
    private static readonly string TextSecondary = "#64748B";
    private static readonly string SageGreen = "#5B8C7A";
    private static readonly string SageLight = "#E5F0EA";
    private static readonly string BackgroundIvory = "#FBFDF9";
    private static readonly string BorderColor = "#E2E8E3";

    public byte[] GenerateReport(SleepAnalysisRequest request, SleepAnalysisResponse analysis)
    {
        var document = Document.Create(container =>
        {
            // ==========================================
            // Page 1: Calm Wellness Cover Page
            // ==========================================
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(BackgroundIvory);
                page.DefaultTextStyle(x => x.FontFamily("Lato").FontColor(TextPrimary));

                page.Content().PaddingTop(100).Column(col =>
                {
                    // Brand Pill
                    col.Item().Row(r =>
                    {
                        r.AutoItem().Background(SageLight).Padding(4).PaddingLeft(10).PaddingRight(10)
                            .Text("SLEEPSYNC AI • WELLNESS GUIDE")
                            .FontSize(9).Bold().FontColor("#456B5D").LetterSpacing(0.05f);
                    });

                    col.Item().PaddingTop(16).Text("Your Natural Sleep Rhythm")
                        .FontSize(28).Bold().FontColor(TextPrimary).LineHeight(1.2f);
                    col.Item().PaddingTop(8).Text("A personalized, friendly guide to understanding when you naturally feel most awake, focused, and ready to rest.")
                        .FontSize(12).FontColor(TextSecondary).LineHeight(1.5f);

                    col.Item().PaddingTop(28).LineHorizontal(2).LineColor(SageGreen);

                    // Profile Summary Card
                    col.Item().PaddingTop(32).Background(Colors.White).Border(1).BorderColor(BorderColor).Padding(16).Column(card =>
                    {
                        card.Item().Text("Assessment Summary").FontSize(11).Bold().FontColor(TextPrimary);

                        card.Item().PaddingTop(10).Row(r =>
                        {
                            r.RelativeItem().Column(c =>
                            {
                                c.Item().Text("ESTIMATED RHYTHM").FontSize(8).Bold().FontColor(TextSecondary);
                                c.Item().Text(GetFriendlyPatternName(analysis.Chronotype.DisplayName)).FontSize(12).Bold().FontColor(SageGreen);
                            });
                            r.RelativeItem().Column(c =>
                            {
                                c.Item().Text("USUAL SLEEP WINDOW").FontSize(8).Bold().FontColor(TextSecondary);
                                c.Item().Text($"{request.Bedtime} – {request.WakeUpTime} (~{analysis.SleepProfile.CalculatedSleepWindowHours:0.#}h)").FontSize(11).Bold().FontColor(TextPrimary);
                            });
                            r.RelativeItem().Column(c =>
                            {
                                c.Item().Text("SLEEP MIDPOINT").FontSize(8).Bold().FontColor(TextSecondary);
                                c.Item().Text(analysis.SleepProfile.MidpointOfSleep).FontSize(11).Bold().FontColor(TextPrimary);
                            });
                        });
                    });

                    // Metadata footer
                    col.Item().PaddingTop(50).Row(r =>
                    {
                        r.RelativeItem().Column(c =>
                        {
                            c.Item().Text($"Date: {DateTime.Now:MMMM dd, yyyy}").FontSize(9.5f).FontColor(TextSecondary);
                            c.Item().Text("Platform: SleepSync AI Educational Wellness Tool").FontSize(8.5f).FontColor(TextSecondary);
                        });
                        r.RelativeItem().AlignRight().Column(c =>
                        {
                            c.Item().Text($"Consistency: {analysis.Chronotype.Confidence}").FontSize(9.5f).FontColor(TextSecondary);
                            c.Item().Text(analysis.AiGenerated ? "AI Personalization: Google Gemini" : "Model: Deterministic Analysis").FontSize(8.5f).FontColor(SageGreen);
                        });
                    });
                });

                page.Footer().AlignCenter().Text("EDUCATIONAL WELLNESS DOCUMENT • NOT A MEDICAL DIAGNOSIS")
                    .FontSize(7.5f).FontColor(Colors.Grey.Medium);
            });

            // ==========================================
            // Page 2+: Detailed Wellness Report Body
            // ==========================================
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(1.8f, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontFamily("Lato").FontSize(9.5f).FontColor(TextPrimary));

                // ── Running Header ──
                page.Header().Column(header =>
                {
                    header.Item().Row(row =>
                    {
                        row.RelativeItem().Row(r =>
                        {
                            r.AutoItem().Text("SleepSync AI ").FontSize(9.5f).Bold().FontColor(SageGreen);
                            r.RelativeItem().Text("• Personalized Sleep Rhythm Report").FontSize(9).FontColor(TextSecondary);
                        });
                        row.ConstantItem(160).AlignRight()
                            .Text(GetFriendlyPatternName(analysis.Chronotype.DisplayName))
                            .FontSize(9).Bold().FontColor(SageGreen);
                    });
                    header.Item().PaddingTop(4).LineHorizontal(0.75f).LineColor(BorderColor);
                });

                // ── Main Content ──
                page.Content().PaddingVertical(10).Column(content =>
                {
                    content.Spacing(14);

                    // Section 1: Your Sleep Rhythm
                    content.Item().Column(sec =>
                    {
                        SectionHeading(sec, "1. Your Natural Sleep Rhythm");

                        sec.Item().Row(r =>
                        {
                            r.RelativeItem(3).Column(c =>
                            {
                                c.Item().Row(cr =>
                                {
                                    cr.AutoItem().Background(SageLight).Padding(4).PaddingLeft(8).PaddingRight(8)
                                        .Text(GetFriendlyPatternName(analysis.Chronotype.DisplayName)).FontSize(10.5f).Bold().FontColor("#456B5D");
                                    cr.RelativeItem().PaddingLeft(8).AlignMiddle()
                                        .Text($"Schedule Consistency: {analysis.Chronotype.Confidence}").FontSize(8.5f).FontColor(TextSecondary);
                                });
                                c.Item().PaddingTop(6).Text(analysis.Chronotype.Explanation).FontSize(9).LineHeight(1.4f);
                            });
                            r.ConstantItem(12);
                            r.RelativeItem(2).Background(BackgroundIvory).Border(1).BorderColor(BorderColor).Padding(8).Column(c =>
                            {
                                c.Item().Text("Your Routine Overview").FontSize(8.5f).Bold().FontColor(TextPrimary);
                                c.Item().PaddingTop(3).Text($"• Bedtime: {request.Bedtime}").FontSize(8);
                                c.Item().Text($"• Wake-Up: {request.WakeUpTime}").FontSize(8);
                                c.Item().Text($"• Rest Duration: ~{analysis.SleepProfile.CalculatedSleepWindowHours:0.#}h").FontSize(8);
                                c.Item().Text($"• Sleep Midpoint: {analysis.SleepProfile.MidpointOfSleep}").FontSize(8);
                                c.Item().Text($"• Day-Off Shift: ~{analysis.SleepProfile.SocialJetlagHours:0.#}h").FontSize(8);
                            });
                        });

                        // Strengths & Reminders
                        sec.Item().PaddingTop(6).Row(r =>
                        {
                            r.RelativeItem().Border(1).BorderColor(BorderColor).Padding(8).Column(c =>
                            {
                                c.Item().Text("Natural Strengths").FontSize(8.5f).Bold().FontColor(SageGreen);
                                foreach (var st in analysis.Chronotype.NaturalStrengths.Take(3))
                                {
                                    c.Item().PaddingTop(2).Text($"✓ {st}").FontSize(7.5f).FontColor(TextPrimary);
                                }
                            });
                            r.ConstantItem(10);
                            r.RelativeItem().Border(1).BorderColor(BorderColor).Padding(8).Column(c =>
                            {
                                c.Item().Text("Things to Keep in Mind").FontSize(8.5f).Bold().FontColor(TextSecondary);
                                foreach (var wo in analysis.Chronotype.WatchOuts.Take(3))
                                {
                                    c.Item().PaddingTop(2).Text($"• {wo}").FontSize(7.5f).FontColor(TextPrimary);
                                }
                            });
                        });
                    });

                    // Section 2: Your Daily Energy Pattern
                    content.Item().Column(sec =>
                    {
                        SectionHeading(sec, "2. Your Daily Energy Pattern");
                        sec.Item().Text("Your energy naturally rises and dips throughout the day in distinct phases:").FontSize(8.5f);

                        sec.Item().PaddingTop(4).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(120);
                                columns.ConstantColumn(100);
                                columns.RelativeColumn();
                            });

                            table.Header(h =>
                            {
                                h.Cell().Background(SageLight).Padding(4).Text("Phase").FontSize(8).Bold().FontColor("#456B5D");
                                h.Cell().Background(SageLight).Padding(4).Text("Timing").FontSize(8).Bold().FontColor("#456B5D");
                                h.Cell().Background(SageLight).Padding(4).Text("Suggested Activity & Helpful Tips").FontSize(8).Bold().FontColor("#456B5D");
                            });

                            // Peak
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text("Best Focus Time").Bold().FontSize(8).FontColor(SageGreen);
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text(analysis.EnergyCurve.Peak.TimeWindowFormatted).FontSize(8).Bold();
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text(analysis.EnergyCurve.Peak.Description).FontSize(7.5f);

                            // Dip
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text("Afternoon Energy Dip").Bold().FontSize(8).FontColor(TextSecondary);
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text(analysis.EnergyCurve.Dip.TimeWindowFormatted).FontSize(8).Bold();
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text("Natural mid-day slowdown. Great time for a short walk, drinking water, or light administrative tasks.").FontSize(7.5f);

                            // Recovery
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text("Energy Recovery").Bold().FontSize(8).FontColor(TextPrimary);
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text(analysis.EnergyCurve.Recovery.TimeWindowFormatted).FontSize(8).Bold();
                            table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(4)
                                .Text(analysis.EnergyCurve.Recovery.Description).FontSize(7.5f);

                            // Wind Down
                            table.Cell().Padding(4)
                                .Text("Evening Wind-Down").Bold().FontSize(8).FontColor(TextSecondary);
                            table.Cell().Padding(4)
                                .Text(analysis.EnergyCurve.WindDown.TimeWindowFormatted).FontSize(8).Bold();
                            table.Cell().Padding(4)
                                .Text(analysis.EnergyCurve.WindDown.Description).FontSize(7.5f);
                        });
                    });

                    // Section 3: Handling the Afternoon Dip
                    content.Item().Column(sec =>
                    {
                        SectionHeading(sec, "3. Managing Your Afternoon Energy Dip");
                        sec.Item().Text(
                            "Feeling less energetic during parts of the afternoon is a normal biological experience. " +
                            "Here are gentle, realistic ways to support your energy without relying on late-day caffeine:")
                            .FontSize(8.5f).LineHeight(1.4f);

                        sec.Item().PaddingTop(4).Row(r =>
                        {
                            r.RelativeItem().Border(0.5f).BorderColor(BorderColor).Padding(6).Column(c =>
                            {
                                c.Item().Text("Natural Light & Movement").FontSize(8).Bold().FontColor(SageGreen);
                                c.Item().PaddingTop(2).Text("Take a 10–15 minute walk outside in natural daylight to gently cue your alertness.").FontSize(7.5f);
                            });
                            r.ConstantItem(8);
                            r.RelativeItem().Border(0.5f).BorderColor(BorderColor).Padding(6).Column(c =>
                            {
                                c.Item().Text("Hydration & Light Snack").FontSize(8).Bold().FontColor(SageGreen);
                                c.Item().PaddingTop(2).Text("Drink a tall glass of water. Choose a light, balanced snack rather than heavy carbohydrates.").FontSize(7.5f);
                            });
                            r.ConstantItem(8);
                            r.RelativeItem().Border(0.5f).BorderColor(BorderColor).Padding(6).Column(c =>
                            {
                                c.Item().Text("Optional Rest Break").FontSize(8).Bold().FontColor(SageGreen);
                                c.Item().PaddingTop(2).Text("If needed and appropriate, a 15–20 minute quiet break or power nap can help you recharge.").FontSize(7.5f);
                            });
                        });
                    });

                    // Section 4: Your Personal Daily Routine
                    content.Item().Column(sec =>
                    {
                        SectionHeading(sec, "4. Your Personal Daily Routine");

                        sec.Item().Table(table =>
                        {
                            table.ColumnsDefinition(cols =>
                            {
                                cols.ConstantColumn(75);
                                cols.ConstantColumn(160);
                                cols.ConstantColumn(75);
                                cols.RelativeColumn();
                            });

                            table.Header(h =>
                            {
                                h.Cell().Background(SageLight).Padding(4).Text("Time").FontSize(8).Bold().FontColor("#456B5D");
                                h.Cell().Background(SageLight).Padding(4).Text("Suggested Activity").FontSize(8).Bold().FontColor("#456B5D");
                                h.Cell().Background(SageLight).Padding(4).Text("Category").FontSize(8).Bold().FontColor("#456B5D");
                                h.Cell().Background(SageLight).Padding(4).Text("Helpful Tip").FontSize(8).Bold().FontColor("#456B5D");
                            });

                            foreach (var item in analysis.DailySchedule)
                            {
                                table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(3).Text(item.TimeLabel).FontSize(7.5f).Bold();
                                table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(3).Text(item.Activity).FontSize(7.5f);
                                table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(3).Text(item.FocusType).FontSize(7.5f).FontColor(SageGreen);
                                table.Cell().BorderBottom(0.5f).BorderColor(BorderColor).Padding(3).Text(item.Notes).FontSize(7).FontColor(TextSecondary);
                            }
                        });
                    });

                    // Section 5: Understanding Your Results
                    content.Item().Column(sec =>
                    {
                        SectionHeading(sec, "5. Understanding Your Results in Plain English");

                        sec.Item().Row(r =>
                        {
                            r.RelativeItem().Column(c =>
                            {
                                c.Item().Text("• Chronotype:").Bold().FontSize(8);
                                c.Item().Text("Your natural tendency to wake earlier, sleep later, or stay balanced.").FontSize(7.5f).FontColor(TextSecondary);
                                c.Item().PaddingTop(3).Text("• Sleep Midpoint:").Bold().FontSize(8);
                                c.Item().Text("The exact halfway point of your sleep on a day off (e.g. 11 PM to 7 AM = 3 AM).").FontSize(7.5f).FontColor(TextSecondary);
                            });
                            r.ConstantItem(10);
                            r.RelativeItem().Column(c =>
                            {
                                c.Item().Text("• Social Jetlag:").Bold().FontSize(8);
                                c.Item().Text("The shift between your work-day and free-day sleep hours. Keeping this small promotes steady energy.").FontSize(7.5f).FontColor(TextSecondary);
                                c.Item().PaddingTop(3).Text("• Confidence:").Bold().FontSize(8);
                                c.Item().Text("How consistently your answers align with one of the standard biological patterns.").FontSize(7.5f).FontColor(TextSecondary);
                            });
                        });
                    });

                    // Section 6: Verified Scientific References
                    content.Item().Column(sec =>
                    {
                        SectionHeading(sec, "6. Verified Scientific References");

                        foreach (var rf in analysis.ScientificReferences.Take(3))
                        {
                            sec.Item().PaddingBottom(2).Column(c =>
                            {
                                c.Item().Text($"{rf.Authors} ({rf.Year}). {rf.Title}.").FontSize(7.5f).Bold().FontColor(TextPrimary);
                                c.Item().Text($"{rf.Source} — {rf.KeyTakeaway}").FontSize(7).FontColor(TextSecondary);
                            });
                        }
                    });

                    // Section 7: Educational Wellness Disclaimer
                    content.Item().Background(BackgroundIvory).Border(1).BorderColor(BorderColor).Padding(8).Column(box =>
                    {
                        box.Item().Text("Educational Wellness Note").FontSize(8).Bold().FontColor(TextPrimary);
                        box.Item().PaddingTop(2).Text(
                            "This report is for informational and lifestyle wellness purposes based on your self-reported habits. " +
                            "It is not a medical diagnosis or treatment plan. For clinical sleep concerns, consult a licensed healthcare professional.")
                            .FontSize(7).LineHeight(1.3f).FontColor(TextSecondary);
                    });
                });

                // ── Running Footer ──
                page.Footer().Column(footer =>
                {
                    footer.Item().LineHorizontal(0.5f).LineColor(BorderColor);
                    footer.Item().PaddingTop(4).Row(row =>
                    {
                        row.RelativeItem().Text("SleepSync AI • A Calm Guide to Your Daily Sleep & Energy Rhythm")
                            .FontSize(7.5f).FontColor(TextSecondary);
                        row.RelativeItem().AlignRight().Text(text =>
                        {
                            text.DefaultTextStyle(x => x.FontSize(7.5f).FontColor(TextSecondary));
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
        column.Item().PaddingTop(3).PaddingBottom(3).Row(r =>
        {
            r.AutoItem().Text(title).FontSize(11).Bold().FontColor(TextPrimary);
        });
        column.Item().PaddingBottom(3).LineHorizontal(1).LineColor(SageGreen);
    }

    private static string GetFriendlyPatternName(string displayName)
    {
        if (string.IsNullOrWhiteSpace(displayName)) return "Balanced Daily Rhythm";
        if (displayName.Contains("AM")) return "Morning-Oriented Rhythm";
        if (displayName.Contains("PM")) return "Evening-Oriented Rhythm";
        return "Balanced Daily Rhythm";
    }
}
