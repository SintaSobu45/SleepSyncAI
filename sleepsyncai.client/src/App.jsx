import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Snackbar, Alert } from '@mui/material';
import theme from './theme/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AssessmentWizard from './components/AssessmentWizard';
import ChronotypeReportView from './components/ChronotypeReportView';
import { analyzeSleep, downloadReport, getSavedReport, getSavedFormData } from './services/sleepApi';

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'assessment' | 'report'
  const [formData, setFormData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState('');

  // Load cached report on mount if present
  useEffect(() => {
    const savedRep = getSavedReport();
    const savedData = getSavedFormData();
    if (savedRep) {
      setAnalysis(savedRep);
    }
    if (savedData) {
      setFormData(savedData);
    }
  }, []);

  const handleStartAssessment = () => {
    setView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = useCallback(async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await analyzeSleep(data);
      setFormData(data);
      setAnalysis(result);
      setView('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Unable to complete the analysis. Please check that the server is reachable and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (!formData) {
      setError('Your questionnaire responses are needed to create the PDF report.');
      return;
    }

    setPdfLoading(true);
    setError('');

    try {
      await downloadReport(formData);
    } catch (err) {
      setError(err.message || 'We could not download your report right now. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }, [formData]);

  const handleRetake = () => {
    setView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F5F7F2',
          color: '#334155',
        }}
      >
        <Header currentView={view} setView={setView} hasReport={!!analysis} />

        <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 2, sm: 3 } }}>
          {view === 'home' && (
            <HomePage onStartAssessment={handleStartAssessment} />
          )}

          {view === 'assessment' && (
            <Box sx={{ maxWidth: 840, mx: 'auto' }}>
              <AssessmentWizard
                onSubmit={handleAnalyze}
                loading={loading}
                initialData={formData}
              />
            </Box>
          )}

          {view === 'report' && (
            <Box sx={{ maxWidth: 940, mx: 'auto' }}>
              <ChronotypeReportView
                analysis={analysis}
                onDownloadPdf={handleDownloadPdf}
                pdfLoading={pdfLoading}
                onRetake={handleRetake}
              />
            </Box>
          )}
        </Container>

        <Footer />

        {/* Global Error Notification */}
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
            sx={{ borderRadius: 2, maxWidth: 500, backgroundColor: '#EF4444' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
