import React from 'react';
import { ThemeProvider, CssBaseline, Container, Box } from '@mui/material';
import theme from './theme/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #0B1220 0%, #0F172A 50%, #0B1220 100%)',
        }}
      >
        <Header />
        <Container maxWidth="md" sx={{ flex: 1 }}>
          <HomePage />
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
