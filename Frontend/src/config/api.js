// API Configuration
// Update this URL with your actual backend Vercel URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://expenses-tracker-backend.vercel.app';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/users/login`,
  REGISTER: `${API_BASE_URL}/api/users/register`,
  LOGOUT: `${API_BASE_URL}/api/users/logout`,
  HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;
