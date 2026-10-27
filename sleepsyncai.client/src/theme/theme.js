import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0F172A',
      light: '#1E293B',
      dark: '#0B1220',
    },
    secondary: {
      main: '#14B8A6',
      light: '#2DD4BF',
      dark: '#0D9488',
    },
    background: {
      default: '#0B1220',
      paper: '#1E293B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
    },
    error: {
      main: '#F87171',
    },
    success: {
      main: '#34D399',
    },
    divider: 'rgba(148, 163, 184, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
          transition: 'all 0.25s ease',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px rgba(20, 184, 166, 0.35)',
          },
          '&:disabled': {
            background: 'rgba(20, 184, 166, 0.3)',
            color: 'rgba(255,255,255,0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(148, 163, 184, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(148, 163, 184, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: '#14B8A6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#14B8A6',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(148, 163, 184, 0.2)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#14B8A6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#14B8A6',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#14B8A6',
        },
      },
    },
  },
});

export default theme;
