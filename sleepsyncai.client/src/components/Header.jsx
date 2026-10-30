import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export default function Header({ currentView, setView, hasReport }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8E3',
        boxShadow: '0 1px 3px rgba(51, 65, 85, 0.04)',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ py: 1, px: { xs: 2, sm: 4 }, display: 'flex', justifyContent: 'space-between' }}>
        {/* Brand / Logo */}
        <Box
          onClick={() => setView('home')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: '#E5F0EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NightsStayOutlinedIcon sx={{ fontSize: 22, color: '#5B8C7A' }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#334155',
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
              }}
            >
              SleepSync AI
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#64748B', fontSize: '0.7rem', display: { xs: 'none', sm: 'block' } }}
            >
              Natural Sleep & Daily Rhythm Guide
            </Typography>
          </Box>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
          <Button
            size="small"
            startIcon={<HomeOutlinedIcon />}
            onClick={() => setView('home')}
            sx={{
              color: currentView === 'home' ? '#5B8C7A' : '#64748B',
              backgroundColor: currentView === 'home' ? '#E5F0EA' : 'transparent',
              fontWeight: currentView === 'home' ? 700 : 500,
              fontSize: '0.88rem',
              '&:hover': { backgroundColor: '#E5F0EA' },
            }}
          >
            Home
          </Button>

          <Button
            size="small"
            startIcon={<AssessmentOutlinedIcon />}
            onClick={() => setView('assessment')}
            sx={{
              color: currentView === 'assessment' ? '#5B8C7A' : '#64748B',
              backgroundColor: currentView === 'assessment' ? '#E5F0EA' : 'transparent',
              fontWeight: currentView === 'assessment' ? 700 : 500,
              fontSize: '0.88rem',
              '&:hover': { backgroundColor: '#E5F0EA' },
            }}
          >
            Questions
          </Button>

          {hasReport && (
            <Button
              size="small"
              startIcon={<DescriptionOutlinedIcon />}
              onClick={() => setView('report')}
              sx={{
                color: currentView === 'report' ? '#5B8C7A' : '#64748B',
                backgroundColor: currentView === 'report' ? '#E5F0EA' : 'transparent',
                fontWeight: currentView === 'report' ? 700 : 500,
                fontSize: '0.88rem',
                '&:hover': { backgroundColor: '#E5F0EA' },
              }}
            >
              My Report
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
