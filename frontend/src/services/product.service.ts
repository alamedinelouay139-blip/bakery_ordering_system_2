import api from '../api/axios';
import { Product, ProductFormData, ApiResponse } from '../types';

export const productService = {
    // Get all products
    async getProducts(): Promise<Product[]> {
        const response = await api.get('/products');
        // Handle both response formats: { data: [...] } or { status, data: [...] }
        if (response.data.data) {
            return response.data.data;
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    // Get single product by ID
    async getProduct(id: number): Promise<Product> {
        const response = await api.get(`/products/${id}`);
        return response.data.data || response.data;
    },

    // Create new product
    async createProduct(data: ProductFormData): Promise<Product> {
        const response = await api.post('/products', data);
        return response.data.data || response.data;
    },

    // Update product
    async updateProduct(id: number, data: ProductFormData): Promise<Product> {
        const response = await api.put(`/products/${id}`, data);
        return response.data.data || response.data;
    },

    // Delete product (soft delete)
    async deleteProduct(id: number): Promise<void> {
        await api.delete(`/products/${id}`);
    },
};
