// API Configuration
// Update this URL with your actual backend Vercel URL
// The URL below is a placeholder - replace with your actual backend Vercel URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Debug: Log the API base URL to help with troubleshooting
console.log('API Base URL:', API_BASE_URL);

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/users/login`,
  REGISTER: `${API_BASE_URL}/api/users/register`,
  LOGOUT: `${API_BASE_URL}/api/users/logout`,
  HEALTH: `${API_BASE_URL}/api/health`,
  
  // Email verification endpoints
  VERIFY_EMAIL: `${API_BASE_URL}/api/users/verify-email`,
  RESEND_VERIFICATION: `${API_BASE_URL}/api/users/resend-verification`,
  
  // Password reset endpoints
  FORGOT_PASSWORD: `${API_BASE_URL}/api/users/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/users/reset-password`,
  
  // Expense endpoints
  ADD_EXPENSE: `${API_BASE_URL}/api/users/expenses`,
  GET_EXPENSES: `${API_BASE_URL}/api/users/expenses`,
  UPDATE_EXPENSE: `${API_BASE_URL}/api/users/expenses`,
  DELETE_EXPENSE: `${API_BASE_URL}/api/users/expenses`,
  
  // AI endpoint
  AI_GENERATE: `${API_BASE_URL}/api/users/ai/generate`,
};

export default API_BASE_URL;
