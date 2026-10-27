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
} from '@mui/material';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ENERGY_OPTIONS = [
  { value: 'EarlyMorning', label: 'Early Morning (5–8 AM)' },
  { value: 'LateMorning', label: 'Late Morning (8–11 AM)' },
  { value: 'Afternoon', label: 'Afternoon (12–4 PM)' },
  { value: 'Evening', label: 'Evening (5–8 PM)' },
  { value: 'Night', label: 'Night (9 PM+)' },
];

const SCHEDULE_OPTIONS = [
  { value: 'Early', label: 'Early Schedule' },
  { value: 'Flexible', label: 'Flexible Schedule' },
  { value: 'Late', label: 'Late Schedule' },
];

const initialFormData = {
  bedtime: '23:00',
  wakeUpTime: '07:00',
  energyPeak: '',
  preferredSchedule: '',
  averageSleepHours: 7.5,
  notes: '',
};

export default function SleepForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user edits
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.bedtime) newErrors.bedtime = 'Bedtime is required.';
    if (!form.wakeUpTime) newErrors.wakeUpTime = 'Wake-up time is required.';
    if (!form.energyPeak) newErrors.energyPeak = 'Please select when you feel most energetic.';
    if (!form.preferredSchedule) newErrors.preferredSchedule = 'Please select your preferred schedule.';
    if (form.notes && form.notes.length > 500) newErrors.notes = 'Notes must be 500 characters or fewer.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form });
  }

  const notesLength = form.notes?.length || 0;

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        background: 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(20, 184, 166, 0.1)',
        transition: 'border-color 0.3s ease',
        '&:hover': {
          borderColor: 'rgba(20, 184, 166, 0.2)',
        },
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
        Sleep Questionnaire
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Tell us about your typical sleep routine. All fields are required unless marked optional.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Row 1: Bedtime & Wake-up Time */}
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            id="bedtime-input"
            label="Usual Bedtime"
            type="time"
            value={form.bedtime}
            onChange={(e) => handleChange('bedtime', e.target.value)}
            error={!!errors.bedtime}
            helperText={errors.bedtime}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BedtimeOutlinedIcon sx={{ color: '#14B8A6', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            id="wakeup-input"
            label="Usual Wake-up Time"
            type="time"
            value={form.wakeUpTime}
            onChange={(e) => handleChange('wakeUpTime', e.target.value)}
            error={!!errors.wakeUpTime}
            helperText={errors.wakeUpTime}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WbSunnyOutlinedIcon sx={{ color: '#14B8A6', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Row 2: Energy Peak & Preferred Schedule */}
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <FormControl fullWidth error={!!errors.energyPeak} required>
            <InputLabel id="energy-peak-label">When Do You Feel Most Energetic?</InputLabel>
            <Select
              id="energy-peak-select"
              labelId="energy-peak-label"
              value={form.energyPeak}
              label="When Do You Feel Most Energetic?"
              onChange={(e) => handleChange('energyPeak', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <BoltOutlinedIcon sx={{ color: '#14B8A6', fontSize: 20 }} />
                </InputAdornment>
              }
            >
              {ENERGY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {errors.energyPeak && <FormHelperText>{errors.energyPeak}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.preferredSchedule} required>
            <InputLabel id="schedule-label">Preferred Daily Schedule</InputLabel>
            <Select
              id="schedule-select"
              labelId="schedule-label"
              value={form.preferredSchedule}
              label="Preferred Daily Schedule"
              onChange={(e) => handleChange('preferredSchedule', e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <ScheduleOutlinedIcon sx={{ color: '#14B8A6', fontSize: 20 }} />
                </InputAdornment>
              }
            >
              {SCHEDULE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {errors.preferredSchedule && <FormHelperText>{errors.preferredSchedule}</FormHelperText>}
          </FormControl>
        </Box>

        {/* Row 3: Average Sleep Hours (Slider) */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <HotelOutlinedIcon sx={{ color: '#14B8A6', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Average Sleep Duration
            </Typography>
            <Box
              sx={{
                ml: 'auto',
                px: 1.5,
                py: 0.3,
                borderRadius: 2,
                background: 'rgba(20, 184, 166, 0.12)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#14B8A6', fontWeight: 600, fontSize: '0.85rem' }}
              >
                {form.averageSleepHours} hours
              </Typography>
            </Box>
          </Box>
          <Slider
            id="sleep-hours-slider"
            value={form.averageSleepHours}
            onChange={(_, value) => handleChange('averageSleepHours', value)}
            min={1}
            max={16}
            step={0.5}
            marks={[
              { value: 4, label: '4h' },
              { value: 7, label: '7h' },
              { value: 9, label: '9h' },
              { value: 12, label: '12h' },
            ]}
            sx={{
              '& .MuiSlider-markLabel': {
                color: 'text.secondary',
                fontSize: '0.72rem',
              },
            }}
          />
        </Box>

        {/* Row 4: Notes */}
        <TextField
          id="notes-input"
          label="Additional Notes (Optional)"
          placeholder="Anything else about your routine — e.g., naps, shift work, caffeine habits..."
          multiline
          minRows={2}
          maxRows={4}
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          error={!!errors.notes}
          helperText={errors.notes || `${notesLength}/500 characters`}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.2 }}>
                <NotesOutlinedIcon sx={{ color: '#14B8A6', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />

        {/* Submit Button */}
        <Button
          id="analyze-button"
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.7)' }} />
            ) : (
              <AutoAwesomeIcon />
            )
          }
          sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, mt: 1 }}
        >
          {loading ? 'Analyzing...' : 'Analyze My Sleep Pattern'}
        </Button>
      </Box>
    </Paper>
  );
}
