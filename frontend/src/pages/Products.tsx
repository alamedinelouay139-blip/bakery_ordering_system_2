import React, { useState, useEffect } from 'react';
import { productService } from '../services/product.service';
import { Product, ProductFormData } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import { useLoading } from '../contexts/LoadingContext';
import Navbar from '../components/Navbar';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        is_active: 1,
    });

    const notification = useNotification();
    const { showLoading, hideLoading } = useLoading();

    // Product icons mapping
    const getProductIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('croissant')) return '🥐';
        if (lowerName.includes('bread') || lowerName.includes('baguette')) return '🥖';
        if (lowerName.includes('cake')) return '🍰';
        if (lowerName.includes('donut') || lowerName.includes('doughnut')) return '🍩';
        if (lowerName.includes('cookie')) return '🍪';
        if (lowerName.includes('cupcake')) return '🧁';
        if (lowerName.includes('pie')) return '🥧';
        if (lowerName.includes('pretzel')) return '🥨';
        if (lowerName.includes('bagel')) return '🥯';
        if (lowerName.includes('muffin')) return '🧁';
        return '🍞'; // default bread icon
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts();
            const activeProducts = data.filter((p: any) => p.is_active === 1 || p.is_active === true);
            setProducts(activeProducts);
        } catch (err: any) {
            setError('Failed to load products');
            notification.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            stock: 0,
            is_active: 1,
        });
        setShowModal(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            is_active: product.is_active,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                showLoading('Deleting product...');
                await productService.deleteProduct(id);
                notification.success('Product deleted successfully');
                await loadProducts();
            } catch (err: any) {
                notification.error('Failed to delete product');
            } finally {
                hideLoading();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            showLoading(editingProduct ? 'Updating product...' : 'Creating product...');
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, formData);
                notification.success('Product updated successfully');
            } else {
                await productService.createProduct(formData);
                notification.success('Product created successfully');
            }

            setShowModal(false);
            await loadProducts();
        } catch (err: any) {
            notification.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
        } finally {
            hideLoading();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' || name === 'is_active'
                ? Number(value)
                : value,
        }));
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <div className="flex-center" style={{ padding: '4rem' }}>
                        <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="flex-between mb-3">
                    <div className="page-header">
                        <h1>🥐 Product Management</h1>
                        <p className="text-secondary">Manage your delicious bakery products</p>
                    </div>
                    <button onClick={handleAdd} className="btn btn-primary">
                        <span>➕</span>
                        <span>Add Product</span>
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🥖</div>
                        <h2>No Products Yet</h2>
                        <p className="text-secondary mb-3">Start by adding your first delicious product</p>
                        <button onClick={handleAdd} className="btn btn-primary">
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-icon">{getProductIcon(product.name)}</div>

                                <div className="product-name">{product.name}</div>

                                <div className="product-description">
                                    {product.description || 'No description available'}
                                </div>

                                <div className="product-details">
                                    <div>
                                        <div className="product-price">${Number(product.price).toFixed(2)}</div>
                                        <div className="product-stock">
                                            {product.stock > 0 ? (
                                                <span style={{ color: 'var(--success-color)' }}>
                                                    ✓ {product.stock} in stock
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--error-color)' }}>
                                                    Out of stock
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {product.is_active ? (
                                            <span className="badge badge-success">Active</span>
                                        ) : (
                                            <span className="badge badge-danger">Inactive</span>
                                        )}
                                    </div>
                                </div>

                                <div className="product-actions">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="btn btn-sm btn-secondary"
                                        style={{ flex: 1 }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="btn btn-sm btn-danger"
                                        style={{ flex: 1 }}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="modal active">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{editingProduct ? '✏️ Edit Product' : '➕ Add Product'}</h2>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowModal(false)}
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Product Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Chocolate Croissant"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Brief description of the product"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price">Price ($) *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stock">Stock Quantity *</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="is_active">Status</label>
                                    <select
                                        id="is_active"
                                        name="is_active"
                                        value={formData.is_active}
                                        onChange={handleInputChange}
                                    >
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        {editingProduct ? '💾 Update Product' : '➕ Save Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Products;
