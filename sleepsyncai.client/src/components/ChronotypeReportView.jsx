import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import PrintIcon from '@mui/icons-material/Print';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import EnergyCurveChart from './EnergyCurveChart';

export default function ChronotypeReportView({
  analysis,
  onDownloadPdf,
  pdfLoading,
  onRetake,
}) {
  const [scienceExpanded, setScienceExpanded] = useState(false);

  if (!analysis) return null;

  const {
    chronotype = {},
    sleepProfile = {},
    energyCurve = {},
    hourlyCurve = [],
    personalizedRecommendations = [],
    dailySchedule = [],
    scientificReferences = [],
    aiGenerated = false,
  } = analysis;

  const { peak = {}, dip = {}, recovery = {}, windDown = {}, sleepWindow = {} } = energyCurve;

  // Simple, friendly display names
  const getFriendlyTitle = (displayName) => {
    if (!displayName) return 'Balanced Daily Rhythm';
    if (displayName.includes('AM')) return 'Morning-Oriented Rhythm';
    if (displayName.includes('PM')) return 'Evening-Oriented Rhythm';
    return 'Balanced Daily Rhythm';
  };

  const friendlyTitle = getFriendlyTitle(chronotype.displayName);

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 2 }}>
        {/* Top Action & Status Bar */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            p: 2,
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8E3',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#5B8C7A',
              }}
            />
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Your Personalized Sleep Rhythm Report
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={onRetake}
              startIcon={<RefreshIcon />}
              sx={{ color: '#334155', borderColor: '#E2E8E3', backgroundColor: '#FFFFFF' }}
            >
              Retake Questions
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => window.print()}
              startIcon={<PrintIcon />}
              sx={{ color: '#334155', borderColor: '#E2E8E3', backgroundColor: '#FFFFFF' }}
            >
              Print
            </Button>
            <Button
              id="download-report-button"
              variant="contained"
              color="secondary"
              size="small"
              onClick={onDownloadPdf}
              disabled={pdfLoading}
              startIcon={
                pdfLoading ? (
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                ) : (
                  <PictureAsPdfIcon />
                )
              }
              sx={{ backgroundColor: '#5B8C7A', '&:hover': { backgroundColor: '#4A7565' } }}
            >
              {pdfLoading ? 'Preparing PDF...' : 'Download PDF Report'}
            </Button>
          </Box>
        </Paper>

        {/* ======================================================== */}
        {/* 1. Your Sleep Rhythm (Main Summary)                      */}
        {/* ======================================================== */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8E3',
            boxShadow: '0 4px 16px rgba(51, 65, 85, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <SpaOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
            <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, letterSpacing: '0.06em' }}>
              YOUR ESTIMATED PATTERN
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#334155', letterSpacing: '-0.01em' }}>
                {friendlyTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                Estimated based on your natural sleep habits, energy peaks, and preferred schedule.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`Pattern: ${chronotype.confidence || 'Moderate'} Consistency`}
                sx={{
                  backgroundColor: '#E5F0EA',
                  color: '#456B5D',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                }}
              />
              <Chip
                label={`Ideal Rest: ~${sleepProfile.calculatedSleepWindowHours || 8}h`}
                sx={{
                  backgroundColor: '#DCEBEF',
                  color: '#0369A1',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                }}
              />
            </Box>
          </Box>

          <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '1rem', mb: 3 }}>
            {chronotype.explanation}
          </Typography>

          {/* Quick Schedule Overview Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
              gap: 2,
              p: 2.5,
              borderRadius: 3,
              backgroundColor: '#F5F7F2',
              border: '1px solid #E2E8E3',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                Ideal Bedtime
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155', fontWeight: 700 }}>
                {sleepProfile.preferredBedtime || '11:00 PM'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                Natural Wake Time
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155', fontWeight: 700 }}>
                {sleepProfile.preferredWakeTime || '7:00 AM'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                Sleep Window
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155', fontWeight: 700 }}>
                ~{sleepProfile.calculatedSleepWindowHours || 8} hours
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                Day-Off Shift
              </Typography>
              <Typography variant="body1" sx={{ color: '#334155', fontWeight: 700 }}>
                ~{sleepProfile.socialJetlagHours || 0.5} hours
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ======================================================== */}
        {/* 2. Your Strengths & Things to Be Aware Of                */}
        {/* ======================================================== */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
          {/* Strengths */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  backgroundColor: '#E5F0EA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleOutlineIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#334155', fontWeight: 700 }}>
                Your Natural Strengths
              </Typography>
            </Box>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {(chronotype.naturalStrengths || []).map((strength, i) => (
                <Box
                  component="li"
                  key={i}
                  sx={{ color: '#64748B', fontSize: '0.92rem', mb: 1.2, lineHeight: 1.6 }}
                >
                  <strong style={{ color: '#334155' }}>{strength.split(';')[0]}</strong>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Things to Be Aware Of */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  backgroundColor: '#F3E9DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <InfoOutlinedIcon sx={{ color: '#B45309', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ color: '#334155', fontWeight: 700 }}>
                Things to Keep in Mind
              </Typography>
            </Box>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {(chronotype.watchOuts || []).map((item, i) => (
                <Box
                  component="li"
                  key={i}
                  sx={{ color: '#64748B', fontSize: '0.92rem', mb: 1.2, lineHeight: 1.6 }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* ======================================================== */}
        {/* 3. Your Daily Energy Pattern (Interactive Chart)         */}
        {/* ======================================================== */}
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, letterSpacing: '0.06em' }}>
              HOURLY ENERGY ESTIMATE
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155', mt: 0.5 }}>
              Your Daily Energy Pattern
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Here is how your alertness is estimated to rise and dip throughout the day.
            </Typography>
          </Box>

          <EnergyCurveChart hourlyData={hourlyCurve} />
        </Box>

        {/* ======================================================== */}
        {/* 4. Focus, Afternoon Dip & Recovery Breakdown             */}
        {/* ======================================================== */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
          {/* Best Focus Time */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ color: '#334155', fontWeight: 700 }}>
                Best Focus Time
              </Typography>
              <Chip
                label={peak.timeWindowFormatted || 'Morning'}
                size="small"
                sx={{ backgroundColor: '#E5F0EA', color: '#456B5D', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, mb: 2, flex: 1 }}>
              {peak.description}
            </Typography>
            <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>
              Helpful Activities:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {(peak.recommendedActivities || []).slice(0, 3).map((act, i) => (
                <Box component="li" key={i} sx={{ color: '#334155', fontSize: '0.85rem', mb: 0.6, lineHeight: 1.5 }}>
                  {act}
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Afternoon Energy Dip */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ color: '#334155', fontWeight: 700 }}>
                Afternoon Energy Dip
              </Typography>
              <Chip
                label={dip.timeWindowFormatted || 'Early Afternoon'}
                size="small"
                sx={{ backgroundColor: '#F3E9DC', color: '#92400E', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, mb: 2, flex: 1 }}>
              {dip.description}
            </Typography>
            <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>
              Gentle Suggestions:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <Box component="li" sx={{ color: '#334155', fontSize: '0.85rem', mb: 0.6, lineHeight: 1.5 }}>
                Take a short 10–15 minute walk in natural daylight
              </Box>
              <Box component="li" sx={{ color: '#334155', fontSize: '0.85rem', mb: 0.6, lineHeight: 1.5 }}>
                Drink a glass of water and enjoy a light, balanced snack
              </Box>
              <Box component="li" sx={{ color: '#334155', fontSize: '0.85rem', mb: 0.6, lineHeight: 1.5 }}>
                Save easy administrative work or organizing for this time
              </Box>
            </Box>
          </Paper>

          {/* Energy Recovery */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ color: '#334155', fontWeight: 700 }}>
                Energy Recovery
              </Typography>
              <Chip
                label={recovery.timeWindowFormatted || 'Late Afternoon'}
                size="small"
                sx={{ backgroundColor: '#DCEBEF', color: '#0369A1', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, mb: 2, flex: 1 }}>
              {recovery.description}
            </Typography>
            <Typography variant="caption" sx={{ color: '#0284C7', fontWeight: 700, mb: 1, textTransform: 'uppercase' }}>
              Great For:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {(recovery.recommendedActivities || []).slice(0, 3).map((act, i) => (
                <Box component="li" key={i} sx={{ color: '#334155', fontSize: '0.85rem', mb: 0.6, lineHeight: 1.5 }}>
                  {act}
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* ======================================================== */}
        {/* 5. Your Personal Daily Routine (Schedule Table)          */}
        {/* ======================================================== */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8E3',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, letterSpacing: '0.06em' }}>
              A SUGGESTED DAILY FLOW
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155', mt: 0.5 }}>
              Your Personal Daily Routine
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              An example routine built around your natural alertness peaks, meal times, and bedtime wind-down.
            </Typography>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <Box component="thead">
                <Box component="tr" sx={{ borderBottom: '2px solid #E2E8E3' }}>
                  <Box component="th" sx={{ py: 1.2, px: 2, color: '#334155', fontWeight: 700, fontSize: '0.88rem' }}>
                    Time
                  </Box>
                  <Box component="th" sx={{ py: 1.2, px: 2, color: '#334155', fontWeight: 700, fontSize: '0.88rem' }}>
                    Suggested Activity
                  </Box>
                  <Box component="th" sx={{ py: 1.2, px: 2, color: '#334155', fontWeight: 700, fontSize: '0.88rem' }}>
                    Focus Type
                  </Box>
                  <Box component="th" sx={{ py: 1.2, px: 2, color: '#334155', fontWeight: 700, fontSize: '0.88rem' }}>
                    Helpful Tip
                  </Box>
                </Box>
              </Box>
              <Box component="tbody">
                {dailySchedule.map((item, idx) => (
                  <Box
                    component="tr"
                    key={idx}
                    sx={{
                      borderBottom: '1px solid #F1F5F9',
                      '&:hover': { backgroundColor: '#F8FAF6' },
                    }}
                  >
                    <Box component="td" sx={{ py: 1.4, px: 2, color: '#334155', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                      {item.timeLabel}
                    </Box>
                    <Box component="td" sx={{ py: 1.4, px: 2, color: '#334155', fontWeight: 600, fontSize: '0.88rem' }}>
                      {item.activity}
                    </Box>
                    <Box component="td" sx={{ py: 1.4, px: 2 }}>
                      <Chip
                        label={item.focusType}
                        size="small"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor:
                            item.focusType === 'Analytical'
                              ? '#E5F0EA'
                              : item.focusType === 'Creative'
                              ? '#DCEBEF'
                              : item.focusType === 'Administrative'
                              ? '#F3E9DC'
                              : '#F1F5F9',
                          color:
                            item.focusType === 'Analytical'
                              ? '#456B5D'
                              : item.focusType === 'Creative'
                              ? '#0369A1'
                              : item.focusType === 'Administrative'
                              ? '#92400E'
                              : '#64748B',
                        }}
                      />
                    </Box>
                    <Box component="td" sx={{ py: 1.4, px: 2, color: '#64748B', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {item.notes}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* ======================================================== */}
        {/* 6. Understanding Your Results (Simple Plain English)     */}
        {/* ======================================================== */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8E3',
          }}
        >
          <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, letterSpacing: '0.06em' }}>
            HELPFUL DEFINITIONS
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155', mt: 0.5, mb: 2 }}>
            Understanding Your Results in Plain English
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#F5F7F2' }}>
              <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700, mb: 0.5 }}>
                What does &ldquo;Chronotype&rdquo; mean?
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                It is simply a way of describing whether your body naturally leans towards waking earlier, resting later, or somewhere in the middle.
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#F5F7F2' }}>
              <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700, mb: 0.5 }}>
                What does &ldquo;Sleep Midpoint&rdquo; mean?
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                This is the exact halfway point of your sleep window on a free day. For example, if you sleep from 11:00 PM to 7:00 AM, your sleep midpoint is 3:00 AM.
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#F5F7F2' }}>
              <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700, mb: 0.5 }}>
                What is &ldquo;Social Jetlag&rdquo;?
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                It is the difference between your sleep times on workdays versus your sleep times on free days. Keeping these close together helps you wake up refreshed.
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#F5F7F2' }}>
              <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700, mb: 0.5 }}>
                What does &ldquo;Confidence&rdquo; mean?
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                It indicates how consistently your reported sleep times and daily alertness answers align with one of the standard patterns.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ======================================================== */}
        {/* 7. Optional Expandable: Learn the Science Behind Results */}
        {/* ======================================================== */}
        <Accordion
          expanded={scienceExpanded}
          onChange={() => setScienceExpanded(!scienceExpanded)}
          elevation={0}
          sx={{
            borderRadius: '16px !important',
            border: '1px solid #E2E8E3',
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#5B8C7A' }} />} sx={{ px: 3, py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  backgroundColor: '#E5F0EA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ScheduleOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155' }}>
                  Learn the Science Behind Your Results (Optional)
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  Click to explore the scientific research and verified medical references supporting this model
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 3, pb: 3, pt: 1, borderTop: '1px solid #E2E8E3' }}>
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, mb: 2 }}>
              SleepSync AI draws upon foundational peer-reviewed studies in circadian biology:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {scientificReferences.map((ref, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#F5F7F2',
                    borderLeft: '3px solid #5B8C7A',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700 }}>
                    {ref.authors} ({ref.year}). {ref.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#0284C7', display: 'block', mt: 0.3 }}>
                    {ref.source}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.84rem', mt: 0.5, lineHeight: 1.5 }}>
                    <strong>Key Finding:</strong> {ref.keyTakeaway}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* ======================================================== */}
        {/* 8. Mandatory Educational Wellness Disclaimer             */}
        {/* ======================================================== */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            backgroundColor: '#F5F7F2',
            border: '1px solid #E2E8E3',
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem', lineHeight: 1.7, display: 'block' }}>
            <strong style={{ color: '#334155' }}>Educational Wellness Disclaimer:</strong> This Sleep Rhythm Report is created solely for personal learning, wellness, and lifestyle planning based on your self-reported habits. It does not provide medical diagnoses, clinical sleep assessments, or treatment for medical conditions. If you have chronic insomnia, daytime sleepiness, or sleep apnea symptoms, please consult a licensed healthcare physician.
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
}
