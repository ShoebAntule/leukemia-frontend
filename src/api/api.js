import axios from 'axios';
// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com/api',  // Update with deployed backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Prediction API instance for FastAPI
const predictionApi = axios.create({
  baseURL: process.env.REACT_APP_PREDICTION_API_URL || 'https://your-fastapi-url.onrender.com',  // Update with deployed FastAPI URL
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // User endpoints
  getCurrentUser: () => api.get('/user/'),
  getUserProfile: (userId) => api.get(`/user/${userId}`),
  updateUserProfile: (userId, data) => api.put(`/user/${userId}`, data),

  // Reports endpoints
  getUserReports: (userId) => api.get(`/reports?user_id=${userId}`),
  getReportDetails: (reportId) => api.get(`/reports/${reportId}`),
  sendReportToPatient: (reportId) => api.patch(`/send-report-to-patient/${reportId}/`),

  // Doctor endpoints
  getDoctorPatients: () => api.get('/doctor/patients/'),
  removePatient: (patientId) => api.delete(`/doctor/patients/${patientId}/remove/`),

  // Contact doctor
  contactDoctor: (data) => api.post('/contact-doctor', data),
  // Doctor linking
  linkDoctor: (doctorCode) => api.post('/patients/link-doctor/', { doctor_code: doctorCode }),

  // Patient Messages
  getPatientMessages: () => api.get('/patient-messages/'),
  sendMessage: (messageData) => api.post('/send-message/', messageData),
  markMessageRead: (messageId) => api.put(`/mark-message-read/${messageId}/`),

  // Patient report upload
  uploadPatientReport: (formData) => api.post('/upload-patient-report/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Doctor reports
  getDoctorReports: () => api.get('/doctor-reports/'),
  getPatientReports: () => api.get('/patient-reports/'),
  verifyPatientReport: (reportId, data = {}) => api.patch(`/verify-patient-report/${reportId}/`, data),

  // Create report from analysis
  createReportFromAnalysis: (formData) => api.post('/create-report-from-analysis/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Get patient microscopic reports
  getPatientMicroscopicReports: () => api.get('/patient-microscopic-reports/'),

  // Get doctor report stats
  getDoctorReportStats: () => api.get('/doctor-report-stats/'),

  // Authentication
  register: (userData) => api.post('/register/', userData),
  login: (credentials) => api.post('/login/', credentials),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
};

export { predictionApi };
export default api;
