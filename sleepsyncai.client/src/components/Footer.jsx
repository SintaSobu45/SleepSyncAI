import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        pt: 4,
        pb: 3,
        px: 3,
        textAlign: 'center',
        borderTop: '1px solid rgba(148, 163, 184, 0.08)',
        background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.5) 100%)',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: '0.78rem',
          maxWidth: 600,
          mx: 'auto',
          lineHeight: 1.7,
          mb: 1.5,
        }}
      >
        <strong>Wellness Disclaimer:</strong> SleepSync AI provides informal wellness
        estimates based on self-reported data. It does not diagnose sleep disorders,
        determine biological chronotypes, or provide medical advice. For sleep-related
        health concerns, please consult a qualified healthcare professional.
      </Typography>
      <Divider sx={{ maxWidth: 120, mx: 'auto', mb: 1.5, borderColor: 'rgba(148,163,184,0.12)' }} />
      <Typography
        variant="caption"
        sx={{ color: 'rgba(148, 163, 184, 0.5)', fontSize: '0.72rem' }}
      >
        © {new Date().getFullYear()} SleepSync AI — Educational Wellness Tool
      </Typography>
    </Box>
  );
}
