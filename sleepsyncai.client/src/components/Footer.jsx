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
        borderTop: '1px solid #E2E8E3',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#64748B',
          fontSize: '0.82rem',
          maxWidth: 680,
          mx: 'auto',
          lineHeight: 1.7,
          mb: 1.5,
        }}
      >
        <strong style={{ color: '#334155' }}>Educational Wellness Note:</strong> SleepSync AI provides helpful, everyday wellness insights based on your self-reported habits. It is not a medical diagnostic tool and does not treat sleep conditions. If you have ongoing sleep concerns, please speak with a qualified doctor or healthcare professional.
      </Typography>
      <Divider sx={{ maxWidth: 140, mx: 'auto', mb: 1.5, borderColor: '#E2E8E3' }} />
      <Typography
        variant="caption"
        sx={{ color: '#94A3B8', fontSize: '0.75rem' }}
      >
        © {new Date().getFullYear()} SleepSync AI • A Calm Guide to Your Daily Sleep & Energy Rhythm
      </Typography>
    </Box>
  );
}
