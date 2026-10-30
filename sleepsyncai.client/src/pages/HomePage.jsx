import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

export default function HomePage({ onStartAssessment }) {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 5, sm: 7 }, py: { xs: 2, sm: 4 } }}>
      {/* ======================================================== */}
      {/* Hero Section                                             */}
      {/* ======================================================== */}
      <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', pt: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.6,
            borderRadius: 5,
            backgroundColor: '#E5F0EA',
            border: '1px solid #D1E5DC',
            mb: 2.5,
          }}
        >
          <SpaOutlinedIcon sx={{ fontSize: 16, color: '#5B8C7A' }} />
          <Typography variant="caption" sx={{ color: '#456B5D', fontWeight: 600, letterSpacing: '0.02em' }}>
            A Friendly Guide to Your Daily Energy & Sleep
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            color: '#334155',
            fontSize: { xs: '2rem', sm: '3rem' },
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            mb: 2,
          }}
        >
          Understand Your Natural Sleep Rhythm
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#64748B',
            fontSize: { xs: '1rem', sm: '1.12rem' },
            lineHeight: 1.75,
            mb: 3.5,
            maxWidth: 620,
            mx: 'auto',
          }}
        >
          Discover when you naturally feel most awake, focused, and ready to rest. Answer a few simple questions to receive a personalized sleep rhythm report.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            id="discover-sleep-rhythm-button"
            variant="contained"
            color="secondary"
            size="large"
            onClick={onStartAssessment}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 3.5,
              py: 1.4,
              fontSize: '1rem',
              fontWeight: 700,
              backgroundColor: '#5B8C7A',
              '&:hover': { backgroundColor: '#4A7565' },
            }}
          >
            Discover My Sleep Rhythm
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={scrollToHowItWorks}
            sx={{
              px: 3,
              py: 1.4,
              fontSize: '1rem',
              color: '#334155',
              borderColor: '#E2E8E3',
              backgroundColor: '#FFFFFF',
              '&:hover': { borderColor: '#5B8C7A', backgroundColor: '#F5F7F2' },
            }}
          >
            How It Works
          </Button>
        </Box>
      </Box>

      {/* ======================================================== */}
      {/* What is a Sleep Rhythm?                                  */}
      {/* ======================================================== */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8E3',
        }}
      >
        <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, letterSpacing: '0.06em' }}>
          EVERYDAY SLEEP SCIENCE
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#334155', mt: 0.5, mb: 1.5 }}>
          What is a Natural Sleep Rhythm?
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', lineHeight: 1.8, fontSize: '0.98rem' }}>
          Everyone has an internal 24-hour body clock that gently nudges when to feel energetic and when to wind down.
          Some people feel active and alert as soon as the sun rises. Others hit their mental stride in the late afternoon
          or evening. Learning your natural pattern helps you plan demanding tasks for when your energy is highest and
          rest when your body is truly ready.
        </Typography>
      </Paper>

      {/* ======================================================== */}
      {/* Three Natural Rhythm Patterns                             */}
      {/* ======================================================== */}
      <Box>
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, letterSpacing: '0.06em' }}>
            COMMON PATTERNS
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#334155', mt: 0.5 }}>
            Three Common Sleep & Energy Patterns
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 540, mx: 'auto', mt: 1 }}>
            There is no single &ldquo;best&rdquo; pattern. Each rhythm has natural strengths and benefits when you work with it:
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
          {/* Morning-Oriented */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(51, 65, 85, 0.06)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#E5F0EA' }}>
                <WbSunnyOutlinedIcon sx={{ color: '#5B8C7A', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
                Morning-Oriented
              </Typography>
            </Box>
            <Chip
              label="Early Riser"
              size="small"
              sx={{ alignSelf: 'flex-start', mb: 2, backgroundColor: '#E5F0EA', color: '#456B5D', fontWeight: 600 }}
            />
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, flex: 1 }}>
              You may naturally feel more active earlier in the day. You wake up ready to go and reach your best focus before noon, but feel ready to relax earlier in the evening.
            </Typography>
            <Divider sx={{ my: 2, borderColor: '#E2E8E3' }} />
            <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 600 }}>
              Typical Best Focus: Morning Hours
            </Typography>
          </Paper>

          {/* Balanced Rhythm */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(51, 65, 85, 0.06)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#DCEBEF' }}>
                <BalanceOutlinedIcon sx={{ color: '#0284C7', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
                Balanced Rhythm
              </Typography>
            </Box>
            <Chip
              label="Flexible & Adaptable"
              size="small"
              sx={{ alignSelf: 'flex-start', mb: 2, backgroundColor: '#DCEBEF', color: '#0369A1', fontWeight: 600 }}
            />
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, flex: 1 }}>
              Your energy may be spread more evenly throughout the day. You enjoy solid focus in the late morning, experience a brief dip after lunch, and often catch a fresh second wind in the late afternoon.
            </Typography>
            <Divider sx={{ my: 2, borderColor: '#E2E8E3' }} />
            <Typography variant="caption" sx={{ color: '#0284C7', fontWeight: 600 }}>
              Typical Best Focus: Midday & Late Afternoon
            </Typography>
          </Paper>

          {/* Evening-Oriented */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(51, 65, 85, 0.06)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: '#F3E9DC' }}>
                <NightsStayOutlinedIcon sx={{ color: '#B45309', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
                Evening-Oriented
              </Typography>
            </Box>
            <Chip
              label="Night Thinker"
              size="small"
              sx={{ alignSelf: 'flex-start', mb: 2, backgroundColor: '#F3E9DC', color: '#92400E', fontWeight: 600 }}
            />
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, flex: 1 }}>
              You may naturally feel more active later in the day. Mornings may take a little longer to warm up, but your creative thinking and sharpest focus shine in the afternoon and evening.
            </Typography>
            <Divider sx={{ my: 2, borderColor: '#E2E8E3' }} />
            <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 600 }}>
              Typical Best Focus: Late Afternoon & Evening
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* ======================================================== */}
      {/* How It Works (Three Simple Steps)                        */}
      {/* ======================================================== */}
      <Box id="how-it-works-section">
        <Box sx={{ textAlign: 'center', mb: 3.5 }}>
          <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, letterSpacing: '0.06em' }}>
            SIMPLE 3-STEP PROCESS
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#334155', mt: 0.5 }}>
            How It Works
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#5B8C7A', opacity: 0.35, mb: 1 }}>
              01
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
              Answer a few simple questions
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7 }}>
              Tell us about your usual sleep times, when you feel most awake, and your daily lifestyle habits.
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#0284C7', opacity: 0.35, mb: 1 }}>
              02
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
              Discover your natural pattern
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7 }}>
              Our system identifies your estimated sleep rhythm and shows your 24-hour daily energy curve.
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8E3',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#5B8C7A', opacity: 0.35, mb: 1 }}>
              03
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
              Get practical suggestions
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7 }}>
              Receive helpful ideas for scheduling focus work, handling the afternoon dip, and a downloadable PDF report.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* ======================================================== */}
      {/* Benefits of Knowing Your Daily Energy Curve              */}
      {/* ======================================================== */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8E3',
        }}
      >
        <Typography variant="caption" sx={{ color: '#5B8C7A', fontWeight: 700, letterSpacing: '0.06em' }}>
          EVERYDAY ADVANTAGES
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#334155', mt: 0.5, mb: 2 }}>
          Why Understanding Your Energy Curve Helps
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ mt: 0.3 }}>
              <CheckCircleOutlineIcon sx={{ color: '#5B8C7A', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700 }}>
                Schedule Important Work for Your Best Time
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                Plan your most demanding tasks—like problem-solving or writing—when your mind naturally feels sharpest.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ mt: 0.3 }}>
              <CheckCircleOutlineIcon sx={{ color: '#5B8C7A', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700 }}>
                Handle the Afternoon Energy Dip Gently
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                Understand that a mid-afternoon drop in energy is completely normal, and learn simple ways to refresh without relying heavily on late caffeine.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ mt: 0.3 }}>
              <CheckCircleOutlineIcon sx={{ color: '#5B8C7A', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700 }}>
                Enjoy More Consistent Mornings
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                Keep your sleep and wake times closer together across workdays and weekends so you wake up feeling refreshed instead of groggy.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ mt: 0.3 }}>
              <CheckCircleOutlineIcon sx={{ color: '#5B8C7A', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 700 }}>
                Create a Relaxing Evening Routine
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                Learn how dimming lights and unplugging from bright screens before bed signals to your body that it is time to sleep peacefully.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ======================================================== */}
      {/* Call-to-Action Banner                                    */}
      {/* ======================================================== */}
      <Box
        sx={{
          textAlign: 'center',
          p: { xs: 4, sm: 5 },
          borderRadius: 4,
          backgroundColor: '#E5F0EA',
          border: '1px solid #D1E5DC',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#334155', mb: 1.5 }}>
          Ready to discover your natural rhythm?
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 500, mx: 'auto', mb: 3, lineHeight: 1.7 }}>
          It takes just 2–3 minutes. Answer a few questions about your day and receive your personal sleep report and downloadable PDF.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={onStartAssessment}
          endIcon={<ArrowForwardIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.02rem',
            fontWeight: 700,
            backgroundColor: '#5B8C7A',
            '&:hover': { backgroundColor: '#4A7565' },
          }}
        >
          Begin Free Assessment
        </Button>
      </Box>
    </Box>
  );
}
