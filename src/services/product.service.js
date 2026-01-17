/*Validate input data

Enforce business rules

Check if product exists

Decide when to create / update / delete

Call the Product Model */
import * as ProductModel from "../models/Product.js";

/**
 * Create product
 */
export const createProductService = async (data, userId) => {
  const { name, price, stock } = data;

  // Business validations
  if (!name) {
    throw new Error("Product name is required");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  // Attach creator
  const productId = await ProductModel.createProduct({
    ...data,
    created_by: userId,
  });

  return productId;
};

/**
 * Get all products
 */
export const getAllProductsService = async () => {
  return await ProductModel.getAllProducts();
};

/**
 * Get product by id
 */
export const getProductByIdService = async (id) => {
  const product = await ProductModel.getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

/**
 * Update product
 */
export const updateProductService = async (id, data) => {
  const product = await ProductModel.getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  if (data.price !== undefined && data.price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (data.stock !== undefined && data.stock < 0) {
    throw new Error("Stock cannot be negative");
  }

  const affectedRows = await ProductModel.updateProduct(id, {
    name: data.name ?? product.name,
    description: data.description ?? product.description,
    price: data.price ?? product.price,
    stock: data.stock ?? product.stock,
    is_active: data.is_active ?? product.is_active,
  });

  return affectedRows;
};

/**
 * Soft delete product
 */
export const deleteProductService = async (id) => {
  const product = await ProductModel.getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return await ProductModel.deleteProduct(id);
};
