import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(180deg, #0F172A 0%, #0B1220 100%)',
        borderBottom: '1px solid rgba(20, 184, 166, 0.15)',
      }}
    >
      <Toolbar sx={{ py: 1.5, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <NightsStayIcon
            sx={{
              fontSize: 32,
              color: '#14B8A6',
              filter: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.4))',
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #F1F5F9 0%, #14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            SleepSync AI
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
