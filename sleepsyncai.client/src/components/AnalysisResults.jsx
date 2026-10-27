import React from 'react';
import { Box, Typography, Paper, Chip, Fade } from '@mui/material';
import SuggestionCard from './SuggestionCard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function AnalysisResults({ analysis }) {
  if (!analysis) return null;

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Section Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TipsAndUpdatesOutlinedIcon sx={{ color: '#14B8A6' }} />
          Your Sleep Analysis
        </Typography>

        {/* Summary Card */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(30, 41, 59, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(20, 184, 166, 0.15)',
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: 'text.primary', lineHeight: 1.8, fontSize: '1rem' }}
          >
            {analysis.summary}
          </Typography>
        </Paper>

        {/* Schedule Preference & Sleep Duration */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              flex: '1 1 220px',
              borderRadius: 2.5,
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148, 163, 184, 0.06)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccessTimeIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Estimated Schedule Preference
              </Typography>
            </Box>
            <Chip
              label={analysis.estimatedPreference}
              sx={{
                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                color: '#FFF',
                fontWeight: 600,
                fontSize: '0.88rem',
                height: 32,
                px: 1,
              }}
            />
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              flex: '1 1 220px',
              borderRadius: 2.5,
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148, 163, 184, 0.06)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccessTimeIcon sx={{ color: '#94A3B8', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Reported Sleep Duration
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {analysis.reportedSleepDuration}
            </Typography>
          </Paper>
        </Box>

        {/* Personalized Suggestions */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2,
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FavoriteOutlinedIcon sx={{ color: '#14B8A6', fontSize: 20 }} />
            Personalized Suggestions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {analysis.suggestions.map((suggestion, index) => (
              <SuggestionCard key={index} number={index + 1} text={suggestion} />
            ))}
          </Box>
        </Box>

        {/* General Recommendations */}
        {analysis.generalRecommendations && analysis.generalRecommendations.length > 0 && (
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <InfoOutlinedIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
              General Recommendations
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(148, 163, 184, 0.06)',
              }}
            >
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {analysis.generalRecommendations.map((rec, index) => (
                  <Box
                    component="li"
                    key={index}
                    sx={{
                      color: 'text.secondary',
                      mb: 1,
                      lineHeight: 1.7,
                      fontSize: '0.9rem',
                      '&::marker': { color: '#14B8A6' },
                    }}
                  >
                    {rec}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        {/* Disclaimer */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'rgba(148, 163, 184, 0.05)',
            border: '1px solid rgba(148, 163, 184, 0.08)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            {analysis.disclaimer}
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
}
