// User types
export interface User {
    id: number;
    name: string;
    email: string;
    is_active: number;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

// Product types
export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    is_active: number;
    created_by?: number;
    created_at?: string;
    updated_at?: string;
}

export interface ProductFormData {
    name: string;
    description?: string;
    price: number;
    stock: number;
    is_active?: number;
}

// API Response types
export interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export interface ApiError {
    message: string;
    status?: number;
}
