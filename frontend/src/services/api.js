import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3004';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getMonthlyAttendance: (year, month) => api.get(`/attendance/monthly/${year}/${month}`),
  getMonthlyCost: (year, month) => api.get(`/attendance/cost/${year}/${month}`),
};

export default api;