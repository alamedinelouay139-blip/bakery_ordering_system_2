import api from '../api/axios';
import { LoginResponse, RegisterData } from '../types';

export const authService = {
    // Login user
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/api/auth/login', {
            email,
            password,
        });

        // Store token and user in localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    // Register new user
    async register(data: RegisterData): Promise<{ message: string }> {
        const response = await api.post('/api/auth/register', data);
        return response.data;
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user from localStorage
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return localStorage.getItem('token') !== null;
    },
};
