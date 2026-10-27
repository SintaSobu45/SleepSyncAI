import React, { useState, useRef, useCallback } from 'react';
import { Box, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import SleepForm from '../components/SleepForm';
import AnalysisResults from '../components/AnalysisResults';
import { analyzeSleep, downloadReport } from '../services/sleepApi';

export default function HomePage() {
  const [formData, setFormData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef(null);

  const handleAnalyze = useCallback(async (data) => {
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const result = await analyzeSleep(data);
      setFormData(data);
      setAnalysis(result);

      // Smooth scroll to results after a brief delay for render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownloadReport = useCallback(async () => {
    if (!formData) return;
    setPdfLoading(true);
    setError('');

    try {
      await downloadReport(formData);
    } catch (err) {
      setError(err.message || 'Failed to download the report. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }, [formData]);

  return (
    <Box sx={{ py: { xs: 3, sm: 5 } }}>
      {/* Hero / Intro Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.6,
            borderRadius: 5,
            background: 'rgba(20, 184, 166, 0.08)',
            border: '1px solid rgba(20, 184, 166, 0.15)',
            mb: 2.5,
          }}
        >
          <NightsStayOutlinedIcon sx={{ fontSize: 16, color: '#14B8A6' }} />
          <Typography
            variant="caption"
            sx={{ color: '#14B8A6', fontWeight: 600, letterSpacing: '0.04em' }}
          >
            Wellness Insights Powered by AI
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1.5,
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            lineHeight: 1.25,
          }}
        >
          Understand Your{' '}
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Sleep Patterns
          </Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 520,
            mx: 'auto',
            lineHeight: 1.7,
            fontSize: { xs: '0.9rem', sm: '1rem' },
          }}
        >
          Answer a few questions about your sleep routine and receive personalized
          insights with a downloadable PDF report. This is an educational wellness
          tool, not a medical assessment.
        </Typography>
      </Box>

      {/* Sleep Questionnaire Form */}
      <Box sx={{ mb: 4 }}>
        <SleepForm onSubmit={handleAnalyze} loading={loading} />
      </Box>

      {/* Analysis Results */}
      {analysis && (
        <Box ref={resultsRef} sx={{ mb: 3 }}>
          <AnalysisResults analysis={analysis} />

          {/* Download PDF Button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              id="download-report-button"
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleDownloadReport}
              disabled={pdfLoading}
              startIcon={
                pdfLoading ? (
                  <CircularProgress size={20} sx={{ color: 'rgba(255,255,255,0.7)' }} />
                ) : (
                  <PictureAsPdfIcon />
                )
              }
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              {pdfLoading ? 'Generating Report...' : 'Download My Sleep Report'}
            </Button>
            <Typography
              variant="caption"
              display="block"
              sx={{ color: 'text.secondary', mt: 1, fontSize: '0.75rem' }}
            >
              PDF report generated securely on the server
            </Typography>
          </Box>
        </Box>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={8000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
