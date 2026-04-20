import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000, 
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('lms_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        // Simple retry logic for 5xx errors (max 2 retries)
        if (err.response?.status >= 500 && !originalRequest._retry) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            if (originalRequest._retryCount <= 2) {
                return api(originalRequest);
            }
        }

        if (err.response?.status === 401) {
            localStorage.removeItem('lms_token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        const message = err.response?.data?.message || err.message || 'An unexpected error occurred';
        if (err.code === 'ECONNABORTED') err.friendlyMessage = 'Request timed out. Please check your connection.';
        else err.friendlyMessage = message;

        return Promise.reject(err);
    }
);

window.addEventListener('storage', (event) => {
    if (event.key === 'lms_token' && !event.newValue) {
        window.location.href = '/login';
    }
});

export default api
