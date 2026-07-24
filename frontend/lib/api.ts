import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication
export const auth = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    
    // Store token and user
    localStorage.setItem('authToken', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Lessons
export const lessons = {
  getAll: async (filters?: { lesson_type?: string; grade_level?: string }) => {
    const response = await api.get('/lessons', { params: filters });
    return response.data;
  },
  
  getById: async (lessonId: string) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/lessons', data);
    return response.data;
  },
  
  publish: async (lessonId: string) => {
    const response = await api.patch(`/lessons/${lessonId}/publish`);
    return response.data;
  },
};

// Quizzes
export const quizzes = {
  getByLesson: async (lessonId: string) => {
    const response = await api.get(`/quizzes/lesson/${lessonId}`);
    return response.data;
  },
  
  submit: async (data: any) => {
    const response = await api.post('/quizzes/submit', data);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/quizzes', data);
    return response.data;
  },
};

// Progress
export const progress = {
  getStudentProgress: async (studentId: string) => {
    const response = await api.get(`/progress/student/${studentId}`);
    return response.data;
  },
  
  updateProgress: async (data: any) => {
    const response = await api.post('/progress/update', data);
    return response.data;
  },
};

// Teacher
export const teacher = {
  getClassInsights: async (classId: string) => {
    const response = await api.get(`/teacher/class-insights/${classId}`);
    return response.data;
  },
  
  getGradebook: async () => {
    const response = await api.get('/teacher/gradebook');
    return response.data;
  },
};

// Parent
export const parent = {
  getChildren: async () => {
    const response = await api.get('/parent/children');
    return response.data;
  },
};

// Analytics
export const analytics = {
  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
};

// Schools
export const schools = {
  create: async (data: any) => {
    const response = await api.post('/schools', data);
    return response.data;
  },
  
  getById: async (schoolId: string) => {
    const response = await api.get(`/schools/${schoolId}`);
    return response.data;
  },
};

export default api;
