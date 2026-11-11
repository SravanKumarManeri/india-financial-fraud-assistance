import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('fraudassist_tokens');
    if (tokens) {
      try {
        const parsed = JSON.parse(tokens);
        if (parsed.access) {
          config.headers.Authorization = `Bearer ${parsed.access}`;
        }
      } catch (e) {
        console.error('Error parsing auth tokens', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = localStorage.getItem('fraudassist_tokens');
      if (tokens) {
        try {
          const parsed = JSON.parse(tokens);
          if (parsed.refresh) {
            const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
              refresh: parsed.refresh,
            });
            if (res.data.access) {
              parsed.access = res.data.access;
              localStorage.setItem('fraudassist_tokens', JSON.stringify(parsed));
              originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
              return apiClient(originalRequest);
            }
          }
        } catch (refreshErr) {
          localStorage.removeItem('fraudassist_tokens');
          localStorage.removeItem('fraudassist_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
