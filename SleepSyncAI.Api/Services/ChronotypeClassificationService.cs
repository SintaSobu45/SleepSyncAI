using System.Globalization;
using SleepSyncAI.Api.Models;

namespace SleepSyncAI.Api.Services;

/// <summary>
/// Core scientific classification service for chronotype estimation and circadian rhythm modeling.
/// Implements transparent, multi-dimensional scoring inspired by Munich Chronotype Questionnaire (MCTQ)
/// and Morningness-Eveningness principles, without claiming definitive medical diagnostics.
/// </summary>
public class ChronotypeClassificationService
{
    public SleepAnalysisResponse ClassifyAndBuildReport(SleepAnalysisRequest request)
    {
        // 1. Resolve and parse time parameters
        var bedtime = ParseTime(request.Bedtime, new TimeSpan(23, 0, 0));
        var wakeUp = ParseTime(request.WakeUpTime, new TimeSpan(7, 0, 0));
        var freeBedtime = !string.IsNullOrWhiteSpace(request.PreferredBedtime)
            ? ParseTime(request.PreferredBedtime, bedtime)
            : bedtime;
        var freeWakeTime = !string.IsNullOrWhiteSpace(request.PreferredWakeTime)
            ? ParseTime(request.PreferredWakeTime, wakeUp)
            : wakeUp;

        double calculatedHours = CalculateDuration(bedtime, wakeUp);
        double reportedHours = request.AverageSleepHours > 0 ? request.AverageSleepHours : calculatedHours;

        // 2. Midpoint of Sleep on Free Days (MSF)
        var midpointTime = CalculateMidpoint(freeBedtime, freeWakeTime);
        double midpointDecimalHours = midpointTime.TotalHours;

        // 3. Social Jetlag (difference between work day and free day sleep midpoints)
        var workMidpoint = CalculateMidpoint(bedtime, wakeUp);
        double socialJetlagHours = Math.Abs((midpointTime - workMidpoint).TotalHours);
        if (socialJetlagHours > 12) socialJetlagHours = 24 - socialJetlagHours;
        socialJetlagHours = Math.Round(socialJetlagHours, 1);

        // 4. Multi-dimensional scoring
        var (category, displayName, tagline, confidence, breakdown, strengths, watchOuts) =
            EvaluateChronotype(bedtime, wakeUp, midpointDecimalHours, request);

        // 5. Construct Sleep Profile DTO
        var sleepProfile = new SleepProfileDto
        {
            PreferredBedtime = FormatTime(freeBedtime),
            PreferredWakeTime = FormatTime(freeWakeTime),
            AverageSleepDuration = Math.Round(reportedHours, 1),
            CalculatedSleepWindowHours = Math.Round(calculatedHours, 1),
            MidpointOfSleep = FormatTime(midpointTime),
            SocialJetlagHours = socialJetlagHours,
            SleepQualityAssessment = AssessSleepQuality(request),
            SleepConsistencyRating = AssessConsistency(request, socialJetlagHours)
        };

        // 6. Build Personalized Energy Curve & Phases
        var energyCurve = BuildEnergyPhases(wakeUp, bedtime, category, request);
        var hourlyCurve = BuildHourlyCurve(wakeUp, bedtime, category, energyCurve);

        // 7. Recommendations
        var recommendations = GeneratePersonalizedRecommendations(category, request, calculatedHours, socialJetlagHours);

        // 8. Daily Schedule Matrix
        var dailySchedule = GenerateDailySchedule(wakeUp, bedtime, category, energyCurve, request);

        // 9. Verified Scientific References
        var references = GetVerifiedScientificReferences();

        // 10. Summary description
        string summary = BuildSummaryText(displayName, bedtime, wakeUp, calculatedHours, midpointTime, request);

        // 11. Legacy suggestions
        var suggestions = recommendations.Select(r => $"{r.Title}: {r.Description}").Take(3).ToList();

        var response = new SleepAnalysisResponse
        {
            Chronotype = new ChronotypeResultDto
            {
                Category = category,
                DisplayName = displayName,
                Tagline = tagline,
                Explanation = BuildDetailedExplanation(category, displayName, midpointTime, request),
                Confidence = confidence,
                CalculationBreakdown = breakdown,
                NaturalStrengths = strengths,
                WatchOuts = watchOuts
            },
            SleepProfile = sleepProfile,
            EnergyCurve = energyCurve,
            HourlyCurve = hourlyCurve,
            PersonalizedRecommendations = recommendations,
            DailySchedule = dailySchedule,
            ScientificReferences = references,
            AiGenerated = false,

            // Backwards compatibility
            Summary = summary,
            EstimatedPreference = displayName,
            ReportedSleepDuration = $"{reportedHours:0.#} hours (calculated window: ~{calculatedHours:0.#} hours)",
            Suggestions = suggestions,
            GeneralRecommendations = new List<string>
            {
                "Maintain a consistent wake-up time within a 30-minute window every day to anchor your circadian rhythm.",
                "Prioritize 15–30 minutes of natural outdoor sunlight within the first hour of waking.",
                "Limit bright artificial lighting and blue-spectrum screens for 60 minutes before your planned bedtime.",
                "Cut off caffeine consumption at least 8 hours prior to sleep onset to protect deep slow-wave sleep.",
                "Align demanding analytical tasks with your biological peak alertness window rather than fighting natural dips."
            },
            Disclaimer = "Educational Wellness Disclaimer: SleepSync AI provides informal circadian wellness estimates based on self-reported data. " +
                         "It does not diagnose sleep disorders (such as insomnia or sleep apnea), determine biological genetic chronotypes, or provide medical advice. " +
                         "For clinical sleep concerns, consult a board-certified sleep physician."
        };

        return response;
    }

    private static (string category, string displayName, string tagline, string confidence, string breakdown, List<string> strengths, List<string> watchOuts)
        EvaluateChronotype(TimeSpan bedtime, TimeSpan wakeUp, double midpointHours, SleepAnalysisRequest req)
    {
        int amScore = 0;
        int interScore = 0;
        int pmScore = 0;

        var breakdownPoints = new List<string>();

        // Dimension 1: Sleep Midpoint (MSF)
        if (midpointHours < 3.5 || (midpointHours > 20 && midpointHours <= 24))
        {
            amScore += 3;
            breakdownPoints.Add("Midpoint of sleep occurs before 3:30 AM (+3 Morning orientation)");
        }
        else if (midpointHours >= 3.5 && midpointHours <= 5.0)
        {
            interScore += 3;
            breakdownPoints.Add("Midpoint of sleep occurs between 3:30 AM and 5:00 AM (+3 Intermediate orientation)");
        }
        else
        {
            pmScore += 3;
            breakdownPoints.Add("Midpoint of sleep occurs after 5:00 AM (+3 Evening orientation)");
        }

        // Dimension 2: Peak Energy & Mental Alertness
        if (req.EnergyPeak == "EarlyMorning" || req.MentalAlertnessPeak == "Morning")
        {
            amScore += 3;
            breakdownPoints.Add("Peak mental alertness reported in morning hours (+3 Morning orientation)");
        }
        else if (req.EnergyPeak == "LateMorning" || req.MentalAlertnessPeak == "Midday" || req.EnergyPeak == "Afternoon")
        {
            interScore += 3;
            breakdownPoints.Add("Peak alertness reported in late morning/midday (+3 Intermediate orientation)");
        }
        else if (req.EnergyPeak == "Evening" || req.EnergyPeak == "Night" || req.MentalAlertnessPeak == "Night")
        {
            pmScore += 3;
            breakdownPoints.Add("Peak alertness reported in evening/night (+3 Evening orientation)");
        }

        // Dimension 3: Analytical & Focus Preferences
        if (req.AnalyticalWindow == "EarlyMorning" || req.AnalyticalWindow == "Morning")
        {
            amScore += 2;
        }
        else if (req.AnalyticalWindow == "Afternoon")
        {
            interScore += 2;
        }
        else if (req.AnalyticalWindow == "Evening")
        {
            pmScore += 2;
        }

        // Dimension 4: Subjective Preferred Schedule
        if (req.PreferredSchedule == "Early")
        {
            amScore += 2;
            breakdownPoints.Add("Self-reported early schedule preference (+2 Morning)");
        }
        else if (req.PreferredSchedule == "Flexible")
        {
            interScore += 2;
            breakdownPoints.Add("Self-reported flexible schedule preference (+2 Intermediate)");
        }
        else if (req.PreferredSchedule == "Late")
        {
            pmScore += 2;
            breakdownPoints.Add("Self-reported late schedule preference (+2 Evening)");
        }

        // Dimension 5: Morning Refreshedness & Wake Characteristics
        if (req.MorningRefreshedLevel == "FullyRefreshed" && wakeUp.TotalHours <= 7.0)
        {
            amScore += 2;
        }
        else if (req.MorningRefreshedLevel == "Tired" || req.MorningRefreshedLevel == "Exhausted")
        {
            if (wakeUp.TotalHours <= 7.0)
            {
                // Forced early wake despite wanting late sleep
                pmScore += 2;
                breakdownPoints.Add("Morning grogginess on standard schedule indicates evening delayed circadian phase (+2 Evening)");
            }
            else
            {
                interScore += 1;
            }
        }
        else
        {
            interScore += 1;
        }

        // Dimension 6: Weekend Shift (Social Jetlag Indicator)
        if (req.WeekendSleepShift == "MoreThan2Hours")
        {
            pmScore += 1;
            breakdownPoints.Add("Noticeable sleep schedule shift on free days (+1 Evening tendency)");
        }
        else if (req.WeekendSleepShift == "None")
        {
            amScore += 1;
        }

        int total = amScore + interScore + pmScore;
        if (total == 0) total = 1;

        string category;
        string displayName;
        string tagline;
        List<string> strengths;
        List<string> watchOuts;

        if (amScore >= interScore && amScore > pmScore)
        {
            category = "AM-Shifted";
            displayName = "AM-Shifted (Morning-Oriented)";
            tagline = "Early Riser • Fast Morning Activation • Early Focus Peak";
            strengths = new List<string>
            {
                "Reaches peak cognitive focus early without requiring high caffeine intake",
                "Naturally well-aligned with conventional academic and professional schedules",
                "Consistent morning alertness and earlier evening melatonin onset"
            };
            watchOuts = new List<string>
            {
                "Energy rapidly wanes in late evening; late social events may feel fatiguing",
                "May feel frustrated by late dinners or night-time obligations",
                "Sensitive to noise or light disruption during early evening sleep onset"
            };
        }
        else if (pmScore > interScore && pmScore > amScore)
        {
            category = "PM-Shifted";
            displayName = "PM-Shifted (Evening-Oriented)";
            tagline = "Night Focus • Late-Day Mental Flow • Extended Evening Energy";
            strengths = new List<string>
            {
                "Exceptional mental stamina and creative problem-solving in the evening and night",
                "Lower susceptibility to evening fatigue; thrives during late-day collaboration",
                "Often demonstrates high neurocognitive adaptability for night-time work"
            };
            watchOuts = new List<string>
            {
                "Vulnerable to 'social jetlag' if required to wake up early on workdays",
                "Morning sleep inertia (grogginess) can take 60–90 minutes to fully clear",
                "Screen use and late artificial light can push bedtime even later"
            };
        }
        else
        {
            category = "Intermediate";
            displayName = "Bi-Phasic / Intermediate";
            tagline = "Adaptive Rhythm • Mid-Day Dip & Recovery • Dynamic Schedule";
            strengths = new List<string>
            {
                "Flexible circadian adaptability to both moderately early and slightly late demands",
                "Clear bi-phasic energy rhythm with a strong late-morning peak and an evening recovery window",
                "Easier social alignment across diverse work environments"
            };
            watchOuts = new List<string>
            {
                "Noticeable post-lunch afternoon dip (between 1:00 PM and 3:30 PM)",
                "Schedule drift on weekends can cause 'Sunday Night Insomnia' if sleep times vary widely",
                "Late afternoon caffeine can easily interfere with evening wind-down"
            };
        }

        // Determine confidence
        int topScore = Math.Max(amScore, Math.Max(interScore, pmScore));
        double dominantRatio = (double)topScore / total;

        string confidence;
        if (dominantRatio >= 0.58)
        {
            confidence = "High";
        }
        else if (dominantRatio >= 0.42)
        {
            confidence = "Moderate";
        }
        else
        {
            confidence = "Inconclusive / Mixed";
            breakdownPoints.Add("Contradictory sleep signals detected between preferred timing and reported alertness.");
        }

        string fullBreakdown = string.Join("; ", breakdownPoints);

        return (category, displayName, tagline, confidence, fullBreakdown, strengths, watchOuts);
    }

    private static EnergyCurveDto BuildEnergyPhases(TimeSpan wakeUp, TimeSpan bedtime, string category, SleepAnalysisRequest req)
    {
        // Calculate offsets based on wakeUp time
        TimeSpan peakStart, peakEnd, dipStart, dipEnd, recStart, recEnd, windStart, windEnd;

        if (category == "AM-Shifted")
        {
            peakStart = AddHours(wakeUp, 1.5); // e.g. 6:00 -> 7:30 AM
            peakEnd = AddHours(wakeUp, 5.0);   // e.g. 11:00 AM
            dipStart = AddHours(wakeUp, 6.5);  // e.g. 12:30 PM
            dipEnd = AddHours(wakeUp, 9.0);    // e.g. 3:00 PM
            recStart = AddHours(wakeUp, 9.5);  // e.g. 3:30 PM
            recEnd = AddHours(wakeUp, 12.0);   // e.g. 6:00 PM
            windStart = SubtractHours(bedtime, 2.0);
            windEnd = bedtime;
        }
        else if (category == "PM-Shifted")
        {
            peakStart = AddHours(wakeUp, 3.5); // e.g. 8:30 -> 12:00 PM
            peakEnd = AddHours(wakeUp, 7.5);   // e.g. 4:00 PM
            dipStart = AddHours(wakeUp, 2.0);  // Morning inertia dip e.g. 9:00 - 10:30 AM
            dipEnd = AddHours(wakeUp, 3.5);
            recStart = AddHours(wakeUp, 9.0);  // Late evening flow e.g. 5:30 PM - 10:30 PM
            recEnd = AddHours(wakeUp, 14.0);
            windStart = SubtractHours(bedtime, 1.5);
            windEnd = bedtime;
        }
        else // Intermediate
        {
            peakStart = AddHours(wakeUp, 2.0); // e.g. 7:00 -> 9:00 AM
            peakEnd = AddHours(wakeUp, 6.0);   // e.g. 1:00 PM
            dipStart = AddHours(wakeUp, 6.0);  // e.g. 1:00 PM
            dipEnd = AddHours(wakeUp, 9.0);    // e.g. 4:00 PM
            recStart = AddHours(wakeUp, 9.0);  // e.g. 4:00 PM
            recEnd = AddHours(wakeUp, 13.0);   // e.g. 8:00 PM
            windStart = SubtractHours(bedtime, 2.0);
            windEnd = bedtime;
        }

        return new EnergyCurveDto
        {
            Peak = new EnergyPhaseDto
            {
                Name = "Peak Cognitive Alertness",
                Start = FormatTime(peakStart),
                End = FormatTime(peakEnd),
                TimeWindowFormatted = $"{FormatTime(peakStart)} – {FormatTime(peakEnd)}",
                Description = "Your biological high-water mark for executive function, concentration, and working memory.",
                WhyItHappens = "Core body temperature rises steadily, cortisol levels optimize, and prefrontal cortex neural activation peaks.",
                RecommendedActivities = new List<string>
                {
                    "Complex problem-solving & quantitative analysis",
                    "Strategic writing, report drafting & coding",
                    "High-stakes decision making and crucial negotiations",
                    "Deep-work sessions without email or messaging distractions"
                },
                ThingsToAvoid = new List<string>
                {
                    "Routine administrative tasks or clearing junk email",
                    "Passive meetings that do not require your direct analytical focus",
                    "Multitasking across low-priority requests"
                }
            },
            Dip = new EnergyPhaseDto
            {
                Name = "Afternoon Energy Dip",
                Start = FormatTime(dipStart),
                End = FormatTime(dipEnd),
                TimeWindowFormatted = $"{FormatTime(dipStart)} – {FormatTime(dipEnd)}",
                Description = "A natural, biologically mediated dip in alertness driven by the circadian rhythm's post-prandial signal.",
                WhyItHappens = "Circadian alertness temporarily drops ~7–8 hours after waking, coupled with digestive parasympathetic activation.",
                RecommendedActivities = new List<string>
                {
                    "Routine administrative tasks, filing, inbox triage, or data entry",
                    "15–20 minute outdoor walk in daylight to replenish alertness",
                    "Low-stakes collaborative check-ins or informal team conversations",
                    "10–20 minute restorative power nap (if completed before 3:00 PM)"
                },
                ThingsToAvoid = new List<string>
                {
                    "Consuming heavy caffeine drinks after 2 PM (disrupts slow-wave sleep later)",
                    "Scheduling critical analytical presentations or exams",
                    "Heavy high-glycemic carb lunches that amplify post-meal lethargy"
                }
            },
            Recovery = new EnergyPhaseDto
            {
                Name = "Rebound & Creative Recovery",
                Start = FormatTime(recStart),
                End = FormatTime(recEnd),
                TimeWindowFormatted = $"{FormatTime(recStart)} – {FormatTime(recEnd)}",
                Description = "A secondary circadian wave of alertness, often characterized by broader associative thinking and mental agility.",
                WhyItHappens = "Core body temperature peaks for the day, and inhibitory focus softens slightly, facilitating divergent creative thinking.",
                RecommendedActivities = new List<string>
                {
                    "Creative brainstorming, concept design, and architectural thinking",
                    "Physical exercise, workout sessions, or sports (peak muscle strength & flexibility)",
                    "Strategic planning, weekly reviews, and ideation",
                    "Casual reading and low-pressure learning"
                },
                ThingsToAvoid = new List<string>
                {
                    "High-intensity stress confrontations",
                    "Over-scheduling back-to-back demands that eat into your wind-down transition"
                }
            },
            WindDown = new EnergyPhaseDto
            {
                Name = "Melatonin Onset & Wind-Down",
                Start = FormatTime(windStart),
                End = FormatTime(windEnd),
                TimeWindowFormatted = $"{FormatTime(windStart)} – {FormatTime(windEnd)}",
                Description = "The biological transition where pineal melatonin release begins and core body temperature starts cooling.",
                WhyItHappens = "In darkness, the suprachiasmatic nucleus (SCN) triggers melatonin secretion, signaling physiological preparation for sleep.",
                RecommendedActivities = new List<string>
                {
                    "Dim ambient lighting and activate warm night-shift screen filters",
                    "Gentle stretching, reading physical books, or listening to relaxing audio",
                    "Warm shower or bath 60–90 min before bed (stimulates vascular cooling)",
                    "Journaling next day's to-do list to unload cognitive worry"
                },
                ThingsToAvoid = new List<string>
                {
                    "Bright overhead fluorescent or blue-spectrum light exposure",
                    "Stressful work emails or provocative social media browsing",
                    "Vigorous workouts within 90 minutes of bedtime",
                    "Heavy meals or alcohol right before turning in"
                }
            },
            SleepWindow = new EnergyPhaseDto
            {
                Name = "Restorative Sleep Window",
                Start = FormatTime(bedtime),
                End = FormatTime(wakeUp),
                TimeWindowFormatted = $"{FormatTime(bedtime)} – {FormatTime(wakeUp)}",
                Description = "Crucial physiological rest interval comprising non-REM slow-wave recovery and REM cognitive consolidation.",
                WhyItHappens = "Cellular glymphatic waste clearance, hormone regulation (growth hormone), and memory consolidation take place.",
                RecommendedActivities = new List<string>
                {
                    "Sleep in a pitch-black, silent, and cool room (65–68°F / 18–20°C)",
                    "Consistent sleep posture with supportive ergonomic pillow"
                },
                ThingsToAvoid = new List<string>
                {
                    "Checking clock or phone during brief spontaneous midnight awakenings"
                }
            }
        };
    }

    private static List<HourlyEnergyPointDto> BuildHourlyCurve(TimeSpan wakeUp, TimeSpan bedtime, string category, EnergyCurveDto phases)
    {
        var points = new List<HourlyEnergyPointDto>();
        double wakeHour = wakeUp.TotalHours;
        double bedHour = bedtime.TotalHours;

        for (int h = 0; h < 24; h++)
        {
            var timeSpan = TimeSpan.FromHours(h);
            string timeLabel = FormatTime(timeSpan);
            int energy;
            string phaseName;
            string focus;

            // Is it during sleep window?
            bool isSleeping;
            if (bedHour > wakeHour)
            {
                // Overnight e.g. 23:00 to 07:00
                isSleeping = (h >= bedHour || h < wakeHour);
            }
            else
            {
                isSleeping = (h >= bedHour && h < wakeHour);
            }

            if (isSleeping)
            {
                energy = 10 + (int)(Math.Sin((h + 2) * 0.5) * 5);
                phaseName = "Sleep Window";
                focus = "Physical & Neural Restoration";
            }
            else
            {
                // Relative hours since wake
                double hoursAwake = h >= wakeHour ? (h - wakeHour) : (24 - wakeHour + h);

                if (hoursAwake < 1.0)
                {
                    energy = category == "PM-Shifted" ? 35 : 55;
                    phaseName = "Morning Awakening";
                    focus = "Hydration & Sunlight";
                }
                else if (hoursAwake >= 1.5 && hoursAwake <= 5.5)
                {
                    energy = category == "AM-Shifted" ? 95 : (category == "Intermediate" ? 88 : 78);
                    phaseName = "Peak Alertness";
                    focus = "Deep Analytical Work";
                }
                else if (hoursAwake > 5.5 && hoursAwake <= 8.5)
                {
                    energy = 50 + (int)(Math.Sin(h) * 6);
                    phaseName = "Afternoon Dip";
                    focus = "Admin & Light Tasks";
                }
                else if (hoursAwake > 8.5 && hoursAwake <= 13.0)
                {
                    energy = category == "PM-Shifted" ? 92 : (category == "Intermediate" ? 78 : 65);
                    phaseName = "Creative Recovery";
                    focus = "Brainstorming & Exercise";
                }
                else
                {
                    energy = 30 + (int)(Math.Sin(h) * 5);
                    phaseName = "Wind-Down";
                    focus = "Relaxation & Dim Light";
                }
            }

            if (energy < 5) energy = 5;
            if (energy > 100) energy = 100;

            points.Add(new HourlyEnergyPointDto
            {
                Hour = h,
                TimeLabel = timeLabel,
                EnergyLevel = energy,
                Phase = phaseName,
                SuggestedFocus = focus
            });
        }

        return points;
    }

    private static List<PersonalizedRecommendationDto> GeneratePersonalizedRecommendations(
        string category, SleepAnalysisRequest req, double sleepHours, double socialJetlag)
    {
        var recs = new List<PersonalizedRecommendationDto>();

        // 1. Daylight & Circadian Anchoring
        if (category == "AM-Shifted")
        {
            recs.Add(new PersonalizedRecommendationDto
            {
                Category = "Light Exposure",
                Title = "Anchor Morning Light & Delay Evening Dimming",
                Description = "Get 15 minutes of direct morning sunlight to solidify your active day. In the late afternoon, maintain bright ambient indoor lighting until 7:30 PM to avoid premature sleepiness.",
                ScientificRationale = "Light suppresses daytime melatonin and keeps SCN neural firing rates high until your planned bedtime."
            });
        }
        else if (category == "PM-Shifted")
        {
            recs.Add(new PersonalizedRecommendationDto
            {
                Category = "Light Exposure",
                Title = "High-Lux Morning Light & Aggressive Evening Screen Shielding",
                Description = "Expose your eyes to bright natural light immediately upon waking (open blinds or step outside for 20 min). Crucially, dim screens and lamps after 9:30 PM to avoid phase-delaying your melatonin cycle further.",
                ScientificRationale = "Evening-oriented chronotypes exhibit heightened retinal sensitivity to evening blue light, which can push circadian rhythm onset by 1–2 hours."
            });
        }
        else
        {
            recs.Add(new PersonalizedRecommendationDto
            {
                Category = "Light Exposure",
                Title = "Dual-Phase Circadian Light Hygiene",
                Description = "Absorb natural morning daylight within 30 minutes of waking. Use an afternoon outdoor walk around 2:00 PM to counteract the circadian dip, and shift to warm 2700K lighting 2 hours before bed.",
                ScientificRationale = "Photons captured by intrinsically photosensitive retinal ganglion cells (ipRGCs) project directly to the master circadian pacemaker."
            });
        }

        // 2. Afternoon Dip Mitigation
        recs.Add(new PersonalizedRecommendationDto
        {
            Category = "Afternoon Dip Management",
            Title = "Optimize the Post-Lunch Energy Window",
            Description = req.HasAfternoonDip == "YesNoticeable"
                ? "Your afternoon dip is prominent. Protect this window: avoid heavy carb lunches, take a brisk 10-minute walk in natural daylight, and reserve this slot for administrative tasks rather than high-stakes decisions."
                : "During your afternoon dip window, switch to low-cognitive-load activities (inbox cleanup, organizing notes). A 15-minute relaxation break here prevents end-of-day burnout.",
            ScientificRationale = "The post-prandial dip is an innate physiological feature of human circadian biology, not merely a symptom of diet or lack of motivation."
        });

        // 3. Caffeine & Nutrition Timing
        if (req.CaffeineConsumption != "None")
        {
            recs.Add(new PersonalizedRecommendationDto
            {
                Category = "Caffeine & Nutrition",
                Title = "Implement a Strict Caffeine Cut-Off",
                Description = "Establish a non-negotiable caffeine cutoff time at least 8 hours before sleep onset. If your target sleep is 11:00 PM, finish your last coffee, tea, or soda before 2:00 PM.",
                ScientificRationale = "Caffeine has an average half-life of 5–7 hours. Even when sleep onset occurs, residual adenosine receptor antagonism degrades Stage 3 slow-wave sleep depth."
            });
        }

        // 4. Social Jetlag & Consistency
        if (socialJetlag >= 1.5 || req.WeekendSleepShift == "MoreThan2Hours")
        {
            recs.Add(new PersonalizedRecommendationDto
            {
                Category = "Schedule Consistency",
                Title = "Minimize Weekend Schedule Divergence (Social Jetlag)",
                Description = $"Your free-day sleep schedule shifts by ~{socialJetlag:0.#} hours compared to workdays. Aim to keep weekend wake times within 60 minutes of weekday times to prevent 'Sunday night insomnia'.",
                ScientificRationale = "Shifting sleep timing by more than 90 minutes on weekends mimics transmeridian jet lag, causing metabolic and cognitive grogginess on Monday mornings."
            });
        }
        else
        {
            recs.Add(new PersonalizedRecommendationDto
            {
                Category = "Schedule Consistency",
                Title = "Protect Your Consistent Wake-Up Anchor",
                Description = "Your current consistency is a major biological asset. Continue holding your wake-up time steady across 7 days a week to keep your circadian phase firmly locked.",
                ScientificRationale = "Regular wake times establish predictable daily rhythms in body temperature, cortisol secretion, and heart-rate variability."
            });
        }

        // 5. Pre-Bed Wind-Down Routine
        recs.Add(new PersonalizedRecommendationDto
        {
            Category = "Wind-Down & Environment",
            Title = "Tactical 45-Minute Decompression Protocol",
            Description = "Spend 45 minutes before bed engaged in non-screen activities: reading, journaling, gentle stretching, or listening to calming audio. Ensure your bedroom remains cool (65–68°F / 18–20°C) and completely dark.",
            ScientificRationale = "The core body temperature must drop by approximately 1°C (2–3°F) to initiate and sustain restorative deep sleep."
        });

        return recs;
    }

    private static List<DailyScheduleItemDto> GenerateDailySchedule(
        TimeSpan wakeUp, TimeSpan bedtime, string category, EnergyCurveDto phases, SleepAnalysisRequest req)
    {
        var items = new List<DailyScheduleItemDto>();

        // Wake
        items.Add(new DailyScheduleItemDto
        {
            Time = FormatTime(wakeUp),
            TimeLabel = FormatTime(wakeUp),
            Activity = "Wake Up & Immediate Hydration",
            FocusType = "Rest",
            Notes = "Drink a large glass of water. Avoid snoozing the alarm to prevent fragmented sleep inertia."
        });

        // Morning Light
        var lightTime = AddMinutes(wakeUp, 30);
        items.Add(new DailyScheduleItemDto
        {
            Time = FormatTime(lightTime),
            TimeLabel = FormatTime(lightTime),
            Activity = "Natural Sunlight & Light Movement",
            FocusType = "Rest",
            Notes = "Step outside for 15–20 minutes of natural light to signal your brain that the biological day has begun."
        });

        // Peak Deep Work
        items.Add(new DailyScheduleItemDto
        {
            Time = phases.Peak.Start,
            TimeLabel = phases.Peak.Start,
            Activity = "Deep Focus & Analytical Block",
            FocusType = "Analytical",
            Notes = "Schedule your hardest cognitive challenge, strategy work, coding, or writing during this prime window."
        });

        // Midday / Lunch
        var lunchTime = ParseTime("12:30", AddHours(wakeUp, 5.5));
        items.Add(new DailyScheduleItemDto
        {
            Time = FormatTime(lunchTime),
            TimeLabel = FormatTime(lunchTime),
            Activity = "Nutritious Lunch & Mental Break",
            FocusType = "Rest",
            Notes = "Balanced protein, fiber, and healthy fats. Step away from your computer screen while eating."
        });

        // Afternoon Dip
        items.Add(new DailyScheduleItemDto
        {
            Time = phases.Dip.Start,
            TimeLabel = phases.Dip.Start,
            Activity = "Administrative Tasks & Active Break",
            FocusType = "Administrative",
            Notes = "Handle routine emails, paperwork, or organizing. Take a brief walk or 15-minute power nap if permitted."
        });

        // Rebound / Creative / Exercise
        items.Add(new DailyScheduleItemDto
        {
            Time = phases.Recovery.Start,
            TimeLabel = phases.Recovery.Start,
            Activity = "Creative Work, Collaboration, or Exercise",
            FocusType = "Creative",
            Notes = "Ideal window for creative problem solving, group brainstorming, or afternoon fitness workouts."
        });

        // Dinner
        var dinnerTime = SubtractHours(bedtime, 3.5);
        items.Add(new DailyScheduleItemDto
        {
            Time = FormatTime(dinnerTime),
            TimeLabel = FormatTime(dinnerTime),
            Activity = "Evening Meal & Social Connection",
            FocusType = "Rest",
            Notes = "Allow at least 2.5–3 hours between dinner and bedtime for proper gastrointestinal digestion."
        });

        // Wind-down
        items.Add(new DailyScheduleItemDto
        {
            Time = phases.WindDown.Start,
            TimeLabel = phases.WindDown.Start,
            Activity = "Evening Wind-Down & Dim Lighting",
            FocusType = "Rest",
            Notes = "Dim household lighting, silence notifications, and switch to non-digital relaxation."
        });

        // Sleep
        items.Add(new DailyScheduleItemDto
        {
            Time = FormatTime(bedtime),
            TimeLabel = FormatTime(bedtime),
            Activity = "Lights Out & Restorative Sleep",
            FocusType = "Sleep",
            Notes = "Pitch-black, cool environment. Allow your body to move naturally through restorative sleep cycles."
        });

        return items.OrderBy(i => TimeSpan.Parse(ConvertTo24Hour(i.Time))).ToList();
    }

    private static List<ScientificReferenceDto> GetVerifiedScientificReferences()
    {
        return new List<ScientificReferenceDto>
        {
            new ScientificReferenceDto
            {
                Authors = "Hall, J. C., Rosbash, M., & Young, M. W.",
                Year = 2017,
                Title = "Discoveries of Molecular Mechanisms Controlling the Circadian Rhythm",
                Source = "The Nobel Prize in Physiology or Medicine (Nobel Assembly at Karolinska Institutet)",
                Citation = "Nobel Prize Press Release (2017). Molecular discoveries demonstrating the cell-autonomous transcriptional feedback loops (PER/TIM/CLOCK) regulating biological clocks.",
                KeyTakeaway = "Circadian rhythms are governed by universal molecular feedback mechanisms present in nearly all human tissues."
            },
            new ScientificReferenceDto
            {
                Authors = "Horne, J. A., & Östberg, O.",
                Year = 1976,
                Title = "A self-assessment questionnaire to determine morningness-eveningness in human circadian rhythms",
                Source = "International Journal of Chronobiology, 4(2), 97–110",
                Citation = "Horne, J. A., & Östberg, O. (1976). Int J Chronobiol, 4(2), 97-110.",
                KeyTakeaway = "Foundational scientific paper introducing the Morningness-Eveningness Questionnaire (MEQ) to classify diurnal preferences."
            },
            new ScientificReferenceDto
            {
                Authors = "Roenneberg, T., Wirz-Justice, A., & Merrow, M.",
                Year = 2003,
                Title = "Life between clocks: daily temporal patterns of human chronotypes",
                Source = "Journal of Biological Rhythms, 18(1), 80–90",
                Citation = "Roenneberg, T., et al. (2003). J Biol Rhythms, 18(1), 80-90. DOI: 10.1177/0748730402239679",
                KeyTakeaway = "Established the Munich Chronotype Questionnaire (MCTQ) and coined 'social jetlag'—the discrepancy between biological and social time."
            },
            new ScientificReferenceDto
            {
                Authors = "Facer-Childs, E. R., Boiling, S., & Balanos, G. M.",
                Year = 2018,
                Title = "The effects of time of day and chronotype on cognitive and physical performance in healthy individuals",
                Source = "Sports Medicine - Open, 4(1), 47",
                Citation = "Facer-Childs, E. R., et al. (2018). Sports Med - Open, 4(1):47. DOI: 10.1186/s40798-018-0162-z",
                KeyTakeaway = "Proved that cognitive focus, reaction time, and physical peak performance vary by up to 26% across diurnal phases mapped to chronotype."
            },
            new ScientificReferenceDto
            {
                Authors = "American Academy of Sleep Medicine (AASM)",
                Year = 2021,
                Title = "Clinical Practice Guideline for the Treatment of Intrinsic Circadian Rhythm Sleep-Wake Disorders",
                Source = "Journal of Clinical Sleep Medicine, 17(11), 2263–2284",
                Citation = "Auger, R. R., et al. (2021). J Clin Sleep Med, 17(11):2263–2284.",
                KeyTakeaway = "Outlines clinical evidence regarding timed light exposure, wake consistency, and behavior modification for circadian rhythm alignment."
            }
        };
    }

    private static string BuildSummaryText(string displayName, TimeSpan bedtime, TimeSpan wakeUp, double hours, TimeSpan midpoint, SleepAnalysisRequest req)
    {
        return $"Based on your reported sleep timing ({FormatTime(bedtime)} – {FormatTime(wakeUp)}, ~{hours:0.#} hours) " +
               $"and your self-reported peak energy window ({req.EnergyPeak}), " +
               $"your natural circadian profile closely reflects an {displayName} pattern. " +
               $"Your estimated free-day midpoint of sleep is around {FormatTime(midpoint)}, " +
               $"which shapes your daily energy curve and cognitive peaks.";
    }

    private static string BuildDetailedExplanation(string category, string displayName, TimeSpan midpoint, SleepAnalysisRequest req)
    {
        if (category == "AM-Shifted")
        {
            return "Your assessment reflects an AM-Shifted chronotype. Individuals with this rhythm typically experience earlier endogenous melatonin release in the evening and a rapid morning cortisol awakening response. Your brain clears sleep inertia quickly, enabling high cognitive performance and executive focus in the morning hours. You naturally prefer winding down earlier in the evening.";
        }
        else if (category == "PM-Shifted")
        {
            return "Your assessment indicates a PM-Shifted chronotype. In evening-oriented biology, the central circadian pacemaker delays melatonin onset, meaning you naturally feel wide awake later at night. While morning routines may feel slower due to prolonged sleep inertia, your executive function, divergent creativity, and verbal stamina reach their zenith in the late afternoon and evening.";
        }
        else
        {
            return "Your assessment aligns with the Bi-Phasic / Intermediate chronotype, the most adaptable of human circadian patterns. You enjoy a robust late-morning analytical peak, experience a predictable circadian dip in the early afternoon, and benefit from a secondary cognitive and creative rebound in the late afternoon/early evening. Your rhythm harmonizes comfortably with standard daylight routines while retaining evening flexibility.";
        }
    }

    private static string AssessSleepQuality(SleepAnalysisRequest req)
    {
        if (req.SleepOnsetLatency == "Over60Min" || req.SleepOnsetDifficulty == "Often")
        {
            return "Elevated sleep latency noted. Implementing evening wind-down rituals and early light exposure can help accelerate sleep onset.";
        }
        if (req.MorningRefreshedLevel == "FullyRefreshed")
        {
            return "High restorative quality reported. Current routine is supporting effective slow-wave and REM sleep cycles.";
        }
        return "Moderate restorative sleep quality. Minor adjustments to pre-bed lighting and caffeine cutoffs can yield tangible improvements.";
    }

    private static string AssessConsistency(SleepAnalysisRequest req, double socialJetlag)
    {
        if (socialJetlag >= 2.0 || req.ScheduleConsistency == "Irregular")
        {
            return "Variable schedule consistency detected. Bringing weekend and weekday wake times closer together will stabilize daytime energy.";
        }
        return "Good schedule stability. Maintaining this regular wake-time anchor supports healthy circadian amplitude.";
    }

    // ==========================================
    // Helper Methods
    // ==========================================

    private static TimeSpan CalculateMidpoint(TimeSpan bedtime, TimeSpan wakeUp)
    {
        double duration = CalculateDuration(bedtime, wakeUp);
        double midpointHours = (bedtime.TotalHours + (duration / 2.0)) % 24.0;
        return TimeSpan.FromHours(midpointHours);
    }

    public static double CalculateDuration(TimeSpan bedtime, TimeSpan wakeUp)
    {
        double hours;
        if (wakeUp >= bedtime)
        {
            hours = (wakeUp - bedtime).TotalHours;
        }
        else
        {
            hours = (TimeSpan.FromHours(24) - bedtime + wakeUp).TotalHours;
        }
        return Math.Round(hours, 1);
    }

    private static TimeSpan ParseTime(string? timeStr, TimeSpan fallback)
    {
        if (string.IsNullOrWhiteSpace(timeStr)) return fallback;
        if (TimeSpan.TryParse(timeStr, out var parsed)) return parsed;
        if (DateTime.TryParse(timeStr, out var dt)) return dt.TimeOfDay;
        return fallback;
    }

    private static TimeSpan AddHours(TimeSpan t, double hours)
    {
        double total = (t.TotalHours + hours) % 24.0;
        if (total < 0) total += 24.0;
        return TimeSpan.FromHours(total);
    }

    private static TimeSpan SubtractHours(TimeSpan t, double hours)
    {
        return AddHours(t, -hours);
    }

    private static TimeSpan AddMinutes(TimeSpan t, int minutes)
    {
        double total = (t.TotalMinutes + minutes) % (24 * 60);
        if (total < 0) total += (24 * 60);
        return TimeSpan.FromMinutes(total);
    }

    private static string FormatTime(TimeSpan time)
    {
        int totalMinutes = (int)Math.Round(time.TotalMinutes) % (24 * 60);
        if (totalMinutes < 0) totalMinutes += 24 * 60;
        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;

        int hour12 = hours % 12;
        if (hour12 == 0) hour12 = 12;
        string amPm = hours < 12 ? "AM" : "PM";
        return $"{hour12}:{minutes:D2} {amPm}";
    }

    private static string ConvertTo24Hour(string formattedTime)
    {
        if (DateTime.TryParseExact(formattedTime, "h:mm tt", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt))
        {
            return dt.ToString("HH:mm");
        }
        return "12:00";
    }
}
