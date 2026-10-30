import axios from 'axios';

// Dynamically select API URL:
// 1. Vite environment variable if configured (VITE_API_BASE_URL)
// 2. Localhost if accessing from localhost/127.0.0.1
// 3. Render production backend fallback
const getBaseUrl = () => {
  if (import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5062/api/sleep';
    }
  }
  return 'https://sleepsyncai.onrender.com/api/sleep';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout for cold starts or AI processing
});

/**
 * Sends questionnaire data to backend for chronotype classification and circadian analysis.
 * Returns the comprehensive SleepAnalysisResponse object.
 */
export async function analyzeSleep(data) {
  try {
    const response = await apiClient.post('/analyze', data);
    // Optionally cache the latest report in localStorage for user convenience
    try {
      localStorage.setItem('sleepsync_last_report', JSON.stringify(response.data));
      localStorage.setItem('sleepsync_last_submission', JSON.stringify(data));
    } catch {
      // Ignore localStorage errors (e.g. private browsing storage quota)
    }
    return response.data;
  } catch (error) {
    throw extractError(error);
  }
}

/**
 * Requests an executive multi-page PDF Chronotype Report from the backend
 * and triggers a browser file download.
 */
export async function downloadReport(data) {
  try {
    const response = await apiClient.post('/report', data, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'SleepSync-Chronotype-Report.pdf';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 200);
  } catch (error) {
    throw extractError(error);
  }
}

/**
 * Retrieves cached report from localStorage if available.
 */
export function getSavedReport() {
  try {
    const saved = localStorage.getItem('sleepsync_last_report');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Retrieves cached submission form data from localStorage if available.
 */
export function getSavedFormData() {
  try {
    const saved = localStorage.getItem('sleepsync_last_submission');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Clears saved report and data from browser storage.
 */
export function clearSavedReport() {
  try {
    localStorage.removeItem('sleepsync_last_report');
    localStorage.removeItem('sleepsync_last_submission');
  } catch {
    // ignore
  }
}

/**
 * Extracts a friendly error message from Axios errors.
 */
function extractError(error) {
  if (error.response) {
    const data = error.response.data;

    // Handle ASP.NET Core ValidationProblem (400)
    if (data?.errors) {
      const messages = Object.values(data.errors).flat();
      return new Error(messages.join(' '));
    }

    if (data?.error) {
      return new Error(data.error);
    }

    if (data instanceof Blob) {
      return new Error('Failed to generate the PDF report. Please verify backend service availability.');
    }

    return new Error(`Server returned an error (${error.response.status}). Please try again.`);
  }

  if (error.code === 'ECONNABORTED') {
    return new Error('The request timed out. If the server is waking up from idle on Render, please allow a few seconds and try again.');
  }

  if (error.request) {
    return new Error('Unable to connect to the SleepSync AI server. Please check your internet connection or verify the backend service is active.');
  }

  return new Error(error.message || 'An unexpected error occurred.');
}
