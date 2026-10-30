import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  Box,
  CircularProgress,
  FormHelperText,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
} from '@mui/material';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const STEPS = [
  'Sleep Times',
  'Daily Energy',
  'Habits & Routine',
  'Sleep Quality',
  'Review & Submit',
];

const initialFormData = {
  // Section A
  bedtime: '23:00',
  wakeUpTime: '07:00',
  naturalSleepyTime: '23:00',
  preferredBedtime: '23:30',
  naturalWakeTime: '07:00',
  preferredWakeTime: '07:30',
  averageSleepHours: 7.5,
  weekendSleepShift: 'Under1Hour',

  // Section B
  energyPeak: 'LateMorning',
  mentalAlertnessPeak: 'Morning',
  lowestEnergyTime: 'EarlyAfternoon',
  analyticalWindow: 'Morning',
  creativeWindow: 'Evening',
  hasAfternoonDip: 'YesNoticeable',

  // Section C
  workSchedule: 'StandardDay',
  exerciseFrequency: 'SeveralTimesAWeek',
  exerciseTiming: 'Afternoon',
  caffeineConsumption: 'Moderate',
  caffeineCutoffTime: 'EarlyAfternoon',
  screenBeforeBed: 'Often',
  nightAwakenings: 'Rarely',
  napHabit: 'Never',
  daytimeFatigue: 'Occasionally',

  // Section D
  sleepOnsetLatency: '15To30Min',
  sleepOnsetDifficulty: 'Sometimes',
  morningRefreshedLevel: 'ModeratelyRefreshed',
  scheduleConsistency: 'ModeratelyConsistent',
  daytimeSleepiness: 'Sometimes',
  preferredSchedule: 'Flexible',
  notes: '',
};

export default function AssessmentWizard({ onSubmit, loading, initialData = null }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialData || initialFormData);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Keep legacy fields synchronized
      if (field === 'preferredBedtime') updated.bedtime = value;
      if (field === 'preferredWakeTime') updated.wakeUpTime = value;
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }

  function validateStep(stepIndex) {
    const errs = {};
    if (stepIndex === 0) {
      if (!formData.naturalSleepyTime) errs.naturalSleepyTime = 'Please select the time you usually feel sleepy.';
      if (!formData.naturalWakeTime) errs.naturalWakeTime = 'Please select the time you wake up naturally.';
    } else if (stepIndex === 1) {
      if (!formData.energyPeak) errs.energyPeak = 'Please select when your energy feels highest.';
      if (!formData.mentalAlertnessPeak) errs.mentalAlertnessPeak = 'Please select when your mind feels sharpest.';
    } else if (stepIndex === 2) {
      if (!formData.workSchedule) errs.workSchedule = 'Please select your typical schedule.';
    } else if (stepIndex === 3) {
      if (!formData.preferredSchedule) errs.preferredSchedule = 'Please select your preferred daily rhythm.';
      if (formData.notes && formData.notes.length > 500) errs.notes = 'Notes must be 500 characters or fewer.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleBack() {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(3)) {
      setActiveStep(3);
      return;
    }
    onSubmit(formData);
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8E3',
        boxShadow: '0 2px 12px rgba(51, 65, 85, 0.04)',
      }}
    >
      {/* Title & Progress Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#334155', mb: 0.5 }}>
          Sleep Rhythm Questionnaire
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          Step {activeStep + 1} of {STEPS.length}:{' '}
          <strong style={{ color: '#5B8C7A' }}>{STEPS[activeStep]}</strong>
        </Typography>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mt: 2.5,
            mb: 3,
            '& .MuiStepLabel-label': {
              color: '#64748B',
              fontSize: { xs: '0.72rem', sm: '0.82rem' },
              '&.Mui-active': { color: '#5B8C7A', fontWeight: 700 },
              '&.Mui-completed': { color: '#5B8C7A' },
            },
            '& .MuiStepIcon-root': {
              color: '#E2E8E3',
              '&.Mui-active': { color: '#5B8C7A' },
              '&.Mui-completed': { color: '#5B8C7A' },
            },
          }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step Content */}
      <Box component="form" onSubmit={handleSubmit}>
        {/* ========================================== */}
        {/* Step 1: Sleep Times                        */}
        {/* ========================================== */}
        {activeStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#E5F0EA' }}>
              <Typography variant="subtitle2" sx={{ color: '#456B5D', fontWeight: 600 }}>
                Part 1: Your Natural Sleep and Wake-Up Times
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                These questions help us understand when your body naturally prefers to rest.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                id="natural-sleepy-input"
                label="When do you naturally start feeling sleepy? *"
                type="time"
                value={formData.naturalSleepyTime}
                onChange={(e) => handleChange('naturalSleepyTime', e.target.value)}
                error={!!errors.naturalSleepyTime}
                helperText={errors.naturalSleepyTime || 'When tiredness arrives naturally in the evening'}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BedtimeOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="preferred-bedtime-input"
                label="Ideal bedtime if you had tomorrow completely off? *"
                type="time"
                value={formData.preferredBedtime}
                onChange={(e) => handleChange('preferredBedtime', e.target.value)}
                helperText="If no alarm or morning duties were waiting"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NightsStayOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                id="natural-wake-input"
                label="When do you wake up naturally without an alarm? *"
                type="time"
                value={formData.naturalWakeTime}
                onChange={(e) => handleChange('naturalWakeTime', e.target.value)}
                error={!!errors.naturalWakeTime}
                helperText={errors.naturalWakeTime || 'Your body waking up spontaneously on its own'}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WbSunnyOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="preferred-wake-input"
                label="Ideal wake-up time on a free day? *"
                type="time"
                value={formData.preferredWakeTime}
                onChange={(e) => handleChange('preferredWakeTime', e.target.value)}
                helperText="Your preferred time to start a restful day"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScheduleOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Average Sleep Duration */}
            <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #E2E8E3', backgroundColor: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HotelOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                    About how many hours of sleep do you usually get? *
                  </Typography>
                </Box>
                <Chip
                  label={`${formData.averageSleepHours} hours`}
                  size="small"
                  sx={{ backgroundColor: '#E5F0EA', color: '#456B5D', fontWeight: 700 }}
                />
              </Box>
              <Slider
                value={formData.averageSleepHours}
                onChange={(_, val) => handleChange('averageSleepHours', val)}
                min={4}
                max={12}
                step={0.5}
                marks={[
                  { value: 5, label: '5h' },
                  { value: 7, label: '7h' },
                  { value: 8, label: '8h' },
                  { value: 9, label: '9h' },
                  { value: 11, label: '11h' },
                ]}
              />
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1 }}>
                Move the slider to select your average nightly rest.
              </Typography>
            </Box>

            {/* Weekend Shift */}
            <FormControl fullWidth>
              <InputLabel id="weekend-shift-label">Does your sleep schedule change on weekends or days off?</InputLabel>
              <Select
                labelId="weekend-shift-label"
                value={formData.weekendSleepShift}
                label="Does your sleep schedule change on weekends or days off?"
                onChange={(e) => handleChange('weekendSleepShift', e.target.value)}
              >
                <MenuItem value="None">No shift (I sleep and wake at the same times every day)</MenuItem>
                <MenuItem value="Under1Hour">Minor shift (Less than 1 hour difference)</MenuItem>
                <MenuItem value="1To2Hours">Moderate shift (1 to 2 hours later on days off)</MenuItem>
                <MenuItem value="MoreThan2Hours">Big shift (More than 2 hours later on days off)</MenuItem>
              </Select>
              <FormHelperText>
                Helps us estimate whether your work schedule causes a difference compared to your free days.
              </FormHelperText>
            </FormControl>
          </Box>
        )}

        {/* ========================================== */}
        {/* Step 2: Daily Energy Patterns              */}
        {/* ========================================== */}
        {activeStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#DCEBEF' }}>
              <Typography variant="subtitle2" sx={{ color: '#0369A1', fontWeight: 600 }}>
                Part 2: Your Daily Energy and Focus Patterns
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                These questions show when your focus is highest and when you naturally slow down.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth error={!!errors.energyPeak} required>
                <InputLabel id="energy-peak-label">When do you feel most physically energetic? *</InputLabel>
                <Select
                  labelId="energy-peak-label"
                  value={formData.energyPeak}
                  label="When do you feel most physically energetic? *"
                  onChange={(e) => handleChange('energyPeak', e.target.value)}
                >
                  <MenuItem value="EarlyMorning">Early Morning (5:00 AM – 8:00 AM)</MenuItem>
                  <MenuItem value="LateMorning">Late Morning (8:00 AM – 11:30 AM)</MenuItem>
                  <MenuItem value="Afternoon">Afternoon (12:00 PM – 4:00 PM)</MenuItem>
                  <MenuItem value="Evening">Evening (5:00 PM – 8:30 PM)</MenuItem>
                  <MenuItem value="Night">Late Night (9:00 PM or later)</MenuItem>
                </Select>
                {errors.energyPeak && <FormHelperText>{errors.energyPeak}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={!!errors.mentalAlertnessPeak} required>
                <InputLabel id="mental-alert-label">When does your mind feel sharpest? *</InputLabel>
                <Select
                  labelId="mental-alert-label"
                  value={formData.mentalAlertnessPeak}
                  label="When does your mind feel sharpest? *"
                  onChange={(e) => handleChange('mentalAlertnessPeak', e.target.value)}
                >
                  <MenuItem value="Morning">Morning (Fresh and quick to grasp ideas)</MenuItem>
                  <MenuItem value="Midday">Midday (Late morning through lunchtime)</MenuItem>
                  <MenuItem value="LateAfternoon">Late Afternoon (3:30 PM – 6:30 PM)</MenuItem>
                  <MenuItem value="Night">Quiet Night (Peaceful late hours)</MenuItem>
                </Select>
                {errors.mentalAlertnessPeak && <FormHelperText>{errors.mentalAlertnessPeak}</FormHelperText>}
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth>
                <InputLabel id="analytical-window-label">When do you prefer tackling difficult, focus-heavy tasks?</InputLabel>
                <Select
                  labelId="analytical-window-label"
                  value={formData.analyticalWindow}
                  label="When do you prefer tackling difficult, focus-heavy tasks?"
                  onChange={(e) => handleChange('analyticalWindow', e.target.value)}
                >
                  <MenuItem value="EarlyMorning">Early Morning (Right after waking up)</MenuItem>
                  <MenuItem value="Morning">Mid-Morning (9:00 AM – 12:00 PM)</MenuItem>
                  <MenuItem value="Afternoon">Afternoon (1:00 PM – 4:30 PM)</MenuItem>
                  <MenuItem value="Evening">Evening (6:00 PM or later)</MenuItem>
                </Select>
                <FormHelperText>For tasks like studying, calculating, or writing complex documents</FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="creative-window-label">When do you feel most creative?</InputLabel>
                <Select
                  labelId="creative-window-label"
                  value={formData.creativeWindow}
                  label="When do you feel most creative?"
                  onChange={(e) => handleChange('creativeWindow', e.target.value)}
                >
                  <MenuItem value="Morning">Morning hours</MenuItem>
                  <MenuItem value="Afternoon">Afternoon</MenuItem>
                  <MenuItem value="Evening">Evening (5:00 PM – 9:00 PM)</MenuItem>
                  <MenuItem value="LateNight">Late night (Past 10:00 PM)</MenuItem>
                </Select>
                <FormHelperText>For brainstorming, design, or exploring new ideas</FormHelperText>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth>
                <InputLabel id="lowest-energy-label">When do you usually feel your energy dropping?</InputLabel>
                <Select
                  labelId="lowest-energy-label"
                  value={formData.lowestEnergyTime}
                  label="When do you usually feel your energy dropping?"
                  onChange={(e) => handleChange('lowestEnergyTime', e.target.value)}
                >
                  <MenuItem value="EarlyMorning">Early Morning (Slow to get moving)</MenuItem>
                  <MenuItem value="EarlyAfternoon">Early Afternoon (1:00 PM – 3:30 PM)</MenuItem>
                  <MenuItem value="LateAfternoon">Late Afternoon (4:00 PM – 6:00 PM)</MenuItem>
                  <MenuItem value="Evening">Evening (Right after dinner)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="afternoon-dip-label">Do you regularly experience an afternoon energy dip?</InputLabel>
                <Select
                  labelId="afternoon-dip-label"
                  value={formData.hasAfternoonDip}
                  label="Do you regularly experience an afternoon energy dip?"
                  onChange={(e) => handleChange('hasAfternoonDip', e.target.value)}
                >
                  <MenuItem value="YesNoticeable">Yes, a clear dip in energy or focus</MenuItem>
                  <MenuItem value="YesModerate">Yes, a mild or easily managed slowdown</MenuItem>
                  <MenuItem value="RarelyOrNone">Rarely or no noticeable dip</MenuItem>
                </Select>
                <FormHelperText>A mid-afternoon drop in alertness is very common</FormHelperText>
              </FormControl>
            </Box>
          </Box>
        )}

        {/* ========================================== */}
        {/* Step 3: Habits & Routine                   */}
        {/* ========================================== */}
        {activeStep === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#F3E9DC' }}>
              <Typography variant="subtitle2" sx={{ color: '#92400E', fontWeight: 600 }}>
                Part 3: Daily Habits and Lifestyle
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Lifestyle habits like light exercise, caffeine, and evening screen time gently shape your sleep quality.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth required>
                <InputLabel id="work-schedule-label">What is your typical work or study schedule? *</InputLabel>
                <Select
                  labelId="work-schedule-label"
                  value={formData.workSchedule}
                  label="What is your typical work or study schedule? *"
                  onChange={(e) => handleChange('workSchedule', e.target.value)}
                >
                  <MenuItem value="StandardDay">Standard daytime (e.g. 9 AM – 5 PM)</MenuItem>
                  <MenuItem value="Flexible">Flexible or remote hours</MenuItem>
                  <MenuItem value="ShiftWork">Shift work or rotating hours</MenuItem>
                  <MenuItem value="Student">Student schedule</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="exercise-freq-label">How often do you exercise or do physical activity?</InputLabel>
                <Select
                  labelId="exercise-freq-label"
                  value={formData.exerciseFrequency}
                  label="How often do you exercise or do physical activity?"
                  onChange={(e) => handleChange('exerciseFrequency', e.target.value)}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="SeveralTimesAWeek">A few times a week (3–5 days)</MenuItem>
                  <MenuItem value="OnceAWeek">1–2 times a week</MenuItem>
                  <MenuItem value="RarelyOrNever">Rarely or never</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth>
                <InputLabel id="exercise-timing-label">When do you usually exercise?</InputLabel>
                <Select
                  labelId="exercise-timing-label"
                  value={formData.exerciseTiming}
                  label="When do you usually exercise?"
                  onChange={(e) => handleChange('exerciseTiming', e.target.value)}
                >
                  <MenuItem value="Morning">Morning (Before starting the day)</MenuItem>
                  <MenuItem value="Afternoon">Midday or afternoon</MenuItem>
                  <MenuItem value="Evening">Evening (5:00 PM – 8:00 PM)</MenuItem>
                  <MenuItem value="None">Not currently exercising regularly</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="caffeine-cons-label">How much caffeine do you usually drink?</InputLabel>
                <Select
                  labelId="caffeine-cons-label"
                  value={formData.caffeineConsumption}
                  label="How much caffeine do you usually drink?"
                  onChange={(e) => handleChange('caffeineConsumption', e.target.value)}
                >
                  <MenuItem value="None">None (No coffee, tea, or energy drinks)</MenuItem>
                  <MenuItem value="Low">Low (1 cup in the morning)</MenuItem>
                  <MenuItem value="Moderate">Moderate (2–3 cups during the day)</MenuItem>
                  <MenuItem value="High">High (4 or more cups throughout the day)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth>
                <InputLabel id="caffeine-cutoff-label">At what time do you have your last caffeine drink?</InputLabel>
                <Select
                  labelId="caffeine-cutoff-label"
                  value={formData.caffeineCutoffTime}
                  label="At what time do you have your last caffeine drink?"
                  onChange={(e) => handleChange('caffeineCutoffTime', e.target.value)}
                >
                  <MenuItem value="BeforeNoon">Before 12:00 PM (Noon)</MenuItem>
                  <MenuItem value="EarlyAfternoon">Early Afternoon (12:00 PM – 2:30 PM)</MenuItem>
                  <MenuItem value="LateAfternoon">Late Afternoon (3:00 PM – 5:00 PM)</MenuItem>
                  <MenuItem value="Evening">Evening (After 6:00 PM)</MenuItem>
                  <MenuItem value="NoCaffeine">I don&rsquo;t drink caffeine</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="screen-bed-label">Do you look at phones, laptops, or TVs before bed?</InputLabel>
                <Select
                  labelId="screen-bed-label"
                  value={formData.screenBeforeBed}
                  label="Do you look at phones, laptops, or TVs before bed?"
                  onChange={(e) => handleChange('screenBeforeBed', e.target.value)}
                >
                  <MenuItem value="Always">Almost always (Right up until sleep)</MenuItem>
                  <MenuItem value="Often">Often (Browse in bed)</MenuItem>
                  <MenuItem value="Sometimes">Sometimes</MenuItem>
                  <MenuItem value="Never">Rarely or never (Screen-free wind-down)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth>
                <InputLabel id="nap-habit-label">Do you take afternoon naps?</InputLabel>
                <Select
                  labelId="nap-habit-label"
                  value={formData.napHabit}
                  label="Do you take afternoon naps?"
                  onChange={(e) => handleChange('napHabit', e.target.value)}
                >
                  <MenuItem value="Never">Never or rarely</MenuItem>
                  <MenuItem value="OccasionalPowerNap">Occasional short power nap (15–20 min)</MenuItem>
                  <MenuItem value="RegularNaps">Regular longer naps (40+ min)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="night-awakenings-label">How often do you wake up during the night?</InputLabel>
                <Select
                  labelId="night-awakenings-label"
                  value={formData.nightAwakenings}
                  label="How often do you wake up during the night?"
                  onChange={(e) => handleChange('nightAwakenings', e.target.value)}
                >
                  <MenuItem value="Rarely">Rarely / Sleep straight through</MenuItem>
                  <MenuItem value="OncePerNight">Once per night</MenuItem>
                  <MenuItem value="MultipleTimes">Multiple times per night</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {/* ========================================== */}
        {/* Step 4: Sleep Quality                      */}
        {/* ========================================== */}
        {activeStep === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#E5F0EA' }}>
              <Typography variant="subtitle2" sx={{ color: '#456B5D', fontWeight: 600 }}>
                Part 4: Sleep Quality and Daily Preferences
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Helps tailor practical ideas to your current sleep experience.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth>
                <InputLabel id="latency-label">How long does it usually take you to fall asleep?</InputLabel>
                <Select
                  labelId="latency-label"
                  value={formData.sleepOnsetLatency}
                  label="How long does it usually take you to fall asleep?"
                  onChange={(e) => handleChange('sleepOnsetLatency', e.target.value)}
                >
                  <MenuItem value="Under15Min">Under 15 minutes (Quick)</MenuItem>
                  <MenuItem value="15To30Min">15 to 30 minutes (Normal)</MenuItem>
                  <MenuItem value="30To60Min">30 to 60 minutes (A bit slow)</MenuItem>
                  <MenuItem value="Over60Min">More than an hour (Often takes long)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="refreshed-label">How refreshed do you feel when waking up?</InputLabel>
                <Select
                  labelId="refreshed-label"
                  value={formData.morningRefreshedLevel}
                  label="How refreshed do you feel when waking up?"
                  onChange={(e) => handleChange('morningRefreshedLevel', e.target.value)}
                >
                  <MenuItem value="FullyRefreshed">Fully refreshed & ready for the day</MenuItem>
                  <MenuItem value="ModeratelyRefreshed">Moderately refreshed after a short while</MenuItem>
                  <MenuItem value="Tired">Somewhat tired / Lingering grogginess</MenuItem>
                  <MenuItem value="Exhausted">Exhausted / Hard to get out of bed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth required error={!!errors.preferredSchedule}>
                <InputLabel id="pref-sched-label">Overall, which schedule feels best for you? *</InputLabel>
                <Select
                  labelId="pref-sched-label"
                  value={formData.preferredSchedule}
                  label="Overall, which schedule feels best for you? *"
                  onChange={(e) => handleChange('preferredSchedule', e.target.value)}
                >
                  <MenuItem value="Early">Early-Oriented (Prefer morning hours)</MenuItem>
                  <MenuItem value="Flexible">Flexible / Balanced (Comfortable with a steady rhythm)</MenuItem>
                  <MenuItem value="Late">Late-Oriented (Prefer afternoon and evening hours)</MenuItem>
                </Select>
                {errors.preferredSchedule && <FormHelperText>{errors.preferredSchedule}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="consistency-label">How consistent is your day-to-day schedule?</InputLabel>
                <Select
                  labelId="consistency-label"
                  value={formData.scheduleConsistency}
                  label="How consistent is your day-to-day schedule?"
                  onChange={(e) => handleChange('scheduleConsistency', e.target.value)}
                >
                  <MenuItem value="VeryConsistent">Very consistent (Same times every day)</MenuItem>
                  <MenuItem value="ModeratelyConsistent">Moderately consistent (Varies by less than an hour)</MenuItem>
                  <MenuItem value="Variable">Variable (Changes by 1–2 hours)</MenuItem>
                  <MenuItem value="Irregular">Irregular (Varies widely)</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Optional Notes */}
            <TextField
              id="notes-input"
              label="Additional Notes (Optional)"
              placeholder="Anything else you would like to note about your daily routine or sleep..."
              multiline
              minRows={2}
              maxRows={4}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              error={!!errors.notes}
              helperText={errors.notes || `${formData.notes?.length || 0}/500 characters • Optional`}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2 }}>
                    <EditNoteOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        )}

        {/* ========================================== */}
        {/* Step 5: Review & Submit                    */}
        {/* ========================================== */}
        {activeStep === 4 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#E5F0EA' }}>
              <Typography variant="subtitle2" sx={{ color: '#456B5D', fontWeight: 600 }}>
                Review Your Responses
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Please take a quick look to make sure your answers reflect your typical day. You can click &ldquo;Previous&rdquo; to adjust anything.
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8E3',
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#5B8C7A', fontWeight: 700, mb: 1.5 }}>
                Sleep and Wake Times
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Naturally Sleepy: <strong style={{ color: '#334155' }}>{formData.naturalSleepyTime}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Naturally Wake Up: <strong style={{ color: '#334155' }}>{formData.naturalWakeTime}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Ideal Bedtime: <strong style={{ color: '#334155' }}>{formData.preferredBedtime}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Average Sleep: <strong style={{ color: '#334155' }}>{formData.averageSleepHours} hours</strong>
                </Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: '#E2E8E3' }} />

              <Typography variant="subtitle2" sx={{ color: '#5B8C7A', fontWeight: 700, mb: 1.5 }}>
                Daily Energy & Alertness
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Most Physically Energetic: <strong style={{ color: '#334155' }}>{formData.energyPeak}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Mind Sharpest: <strong style={{ color: '#334155' }}>{formData.mentalAlertnessPeak}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Focus Work Window: <strong style={{ color: '#334155' }}>{formData.analyticalWindow}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Afternoon Dip: <strong style={{ color: '#334155' }}>{formData.hasAfternoonDip}</strong>
                </Typography>
              </Box>

              <Divider sx={{ my: 2, borderColor: '#E2E8E3' }} />

              <Typography variant="subtitle2" sx={{ color: '#5B8C7A', fontWeight: 700, mb: 1.5 }}>
                Lifestyle & Habits
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Work Schedule: <strong style={{ color: '#334155' }}>{formData.workSchedule}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Caffeine Cutoff: <strong style={{ color: '#334155' }}>{formData.caffeineCutoffTime}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Screens Before Bed: <strong style={{ color: '#334155' }}>{formData.screenBeforeBed}</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Preferred Rhythm: <strong style={{ color: '#334155' }}>{formData.preferredSchedule}</strong>
                </Typography>
              </Box>
            </Paper>

            <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic', display: 'block' }}>
              Clicking &ldquo;Create My Sleep Report&rdquo; will generate your personalized 24-hour rhythm curve and routine recommendations.
            </Typography>
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2.5, borderTop: '1px solid #E2E8E3' }}>
          {activeStep > 0 ? (
            <Button
              variant="outlined"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{ color: '#334155', borderColor: '#E2E8E3' }}
            >
              Previous
            </Button>
          ) : (
            <Box />
          )}

          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              sx={{ backgroundColor: '#5B8C7A', '&:hover': { backgroundColor: '#4A7565' } }}
            >
              Next Step
            </Button>
          ) : (
            <Button
              id="analyze-button"
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <AutoAwesomeIcon />
                )
              }
              sx={{ px: 3.5, backgroundColor: '#5B8C7A', '&:hover': { backgroundColor: '#4A7565' } }}
            >
              {loading ? 'Creating Your Report...' : 'Create My Sleep Report'}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
