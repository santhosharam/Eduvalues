import axios from 'axios'
import { supabase } from '../supabaseClient'

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000, 
})

api.interceptors.request.use(async (config) => {
    let token = localStorage.getItem('lms_token');
    
    if (!token) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            token = session?.access_token;
        } catch (e) {}
    }

    if (token) {
        // Use .set() for Axios 1.x compatibility
        if (typeof config.headers.set === 'function') {
            config.headers.set('Authorization', `Bearer ${token}`);
            config.headers.set('x-auth-token', token);
        } else {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['x-auth-token'] = token;
        }

        // Emergency fallback: Append to query string
        const separator = config.url.includes('?') ? '&' : '?';
        config.url = `${config.url}${separator}token=${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

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
            // localStorage.removeItem('lms_token');
            // if (window.location.pathname !== '/login') {
            //     window.location.href = '/login';
            // }
            console.warn('Unauthorized request detected')
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
