import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#334155', // Primary text & strong elements
      light: '#64748B',
      dark: '#1E293B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#5B8C7A', // Primary action sage green
      light: '#7AAFA0',
      dark: '#456B5D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7F2', // Main background
      paper: '#FFFFFF',   // Card background
    },
    text: {
      primary: '#334155',
      secondary: '#64748B',
    },
    custom: {
      sage: '#E5F0EA',
      softBlue: '#DCEBEF',
      warmSand: '#F3E9DC',
      border: '#E2E8E3',
    },
    divider: '#E2E8E3',
    success: {
      main: '#5B8C7A',
    },
    warning: {
      main: '#D97706',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 800, color: '#334155', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, color: '#334155', letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, color: '#334155', letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, color: '#334155', letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, color: '#334155' },
    h6: { fontWeight: 600, color: '#334155' },
    subtitle1: { fontWeight: 500, color: '#334155' },
    subtitle2: { fontWeight: 600, color: '#334155' },
    body1: { color: '#334155', lineHeight: 1.7 },
    body2: { color: '#64748B', lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 22px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
        },
        containedSecondary: {
          backgroundColor: '#5B8C7A',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#4A7565',
            boxShadow: '0 4px 12px rgba(91, 140, 122, 0.25)',
          },
          '&:disabled': {
            backgroundColor: '#CBD5E1',
            color: '#94A3B8',
          },
        },
        outlined: {
          borderColor: '#E2E8E3',
          color: '#334155',
          backgroundColor: '#FFFFFF',
          '&:hover': {
            borderColor: '#5B8C7A',
            backgroundColor: '#F5F7F2',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8E3',
          boxShadow: '0 2px 8px rgba(51, 65, 85, 0.04)',
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#E2E8E3',
            },
            '&:hover fieldset': {
              borderColor: '#5B8C7A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5B8C7A',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E2E8E3',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5B8C7A',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5B8C7A',
            borderWidth: 2,
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#5B8C7A',
        },
        thumb: {
          backgroundColor: '#5B8C7A',
          boxShadow: '0 2px 6px rgba(91, 140, 122, 0.3)',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: '0 0 0 8px rgba(91, 140, 122, 0.16)',
          },
        },
        track: {
          backgroundColor: '#5B8C7A',
          border: 'none',
        },
        rail: {
          backgroundColor: '#E2E8E3',
          opacity: 1,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
