import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/product.service.js";

/**
 * CREATE product
 */
export const createProduct = async (req, res) => {
  try {
    const productId = await createProductService(req.body, req.user.id);

    return res.status(201).json({
      status: "success",
      data: { id: productId },
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

/**
 * READ all products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();

    return res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
    });
  }
};

/**
 * READ product by id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    return res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};

/**
 * UPDATE product
 */
export const updateProduct = async (req, res) => {
  try {
    await updateProductService(req.params.id, req.body);

    return res.status(200).json({
      status: "success",
      message: "Product updated successfully",
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

/**
 * DELETE product (soft delete)
 */
export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res.status(404).json({
      status: "error",
      message: err.message,
    });
  }
};
