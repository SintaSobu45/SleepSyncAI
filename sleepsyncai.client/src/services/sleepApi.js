import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5062/api/sleep';

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });


const API_BASE_URL = 'https://sleepsyncai.onrender.com/api/sleep';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


/**
 * Sends sleep questionnaire data to the backend for analysis.
 * Returns the structured analysis response.
 */
export async function analyzeSleep(data) {
  try {
    const response = await apiClient.post('/analyze', data);
    return response.data;
  } catch (error) {
    throw extractError(error);
  }
}

/**
 * Requests a PDF report from the backend and triggers a browser download.
 * The PDF is generated server-side and returned as a blob.
 */
export async function downloadReport(data) {
  try {
    const response = await apiClient.post('/report', data, {
      responseType: 'blob',
    });

    // Create a temporary object URL for the blob
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // Create a hidden link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SleepSync-Report.pdf';
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw extractError(error);
  }
}

/**
 * Extracts a user-friendly error message from an Axios error.
 */
function extractError(error) {
  if (error.response) {
    const data = error.response.data;

    // Handle validation errors (400)
    if (data?.errors) {
      const messages = Object.values(data.errors).flat();
      return new Error(messages.join(' '));
    }

    // Handle generic error messages
    if (data?.error) {
      return new Error(data.error);
    }

    // Handle blob error responses (from PDF endpoint)
    if (data instanceof Blob) {
      return new Error('Failed to generate the PDF report. Please try again.');
    }

    return new Error(`Server error (${error.response.status}). Please try again.`);
  }

  // if (error.request) {
  //   return new Error(
  //     'Cannot reach the server. Please ensure the backend is running on http://localhost:5062.'
  //   );
  // }

  if (error.request) {
  return new Error(
    'Cannot reach the server. Please try again later.'
  );
}
  return new Error(error.message || 'An unexpected error occurred.');
}
