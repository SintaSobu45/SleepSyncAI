import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

export default function SuggestionCard({ number, text }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 2.5,
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        borderLeft: '3px solid #14B8A6',
        border: '1px solid rgba(148, 163, 184, 0.06)',
        borderLeftColor: '#14B8A6',
        transition: 'all 0.25s ease',
        '&:hover': {
          background: 'rgba(30, 41, 59, 0.7)',
          transform: 'translateX(4px)',
          boxShadow: '0 4px 16px rgba(20, 184, 166, 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box
          sx={{
            minWidth: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(20, 184, 166, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {number ? (
            <Typography
              variant="body2"
              sx={{ color: '#14B8A6', fontWeight: 700, fontSize: '0.85rem' }}
            >
              {number}
            </Typography>
          ) : (
            <LightbulbOutlinedIcon sx={{ color: '#14B8A6', fontSize: 18 }} />
          )}
        </Box>
        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.7, pt: 0.3 }}>
          {text}
        </Typography>
      </Box>
    </Paper>
  );
}
