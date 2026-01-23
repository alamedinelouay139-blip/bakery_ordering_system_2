import {//bas nusal lal controler huwi yali bysta2bl al req biya3ml call lal service bi2arer lstatus yraj3 biraj3 response lal front
  //muhmtu bas binase22
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,} from "../services/product.service.js";

/**
 * CREATE product
 */
export const createProduct = async (req, res) => {
  try {//htyna try laan klshu juwa mfrud ymshi sa7
    const productId = await createProductService(req.body, req.user.id);
//req.body al data yali ba3ta al user 
//user.id jeyi mnl authguard krml hk ma akhdt al id mnl body laanu mumkn ytzawar 
    return res.status(201).json({
      status: "success",
      data: { id: productId },
    });
  } catch (err) {//al jeye mnl service
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

/**
 * READ all products
 */
export const getAllProducts = async (req, res) => {//mafi req.body laan bas am ntlob data
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
    const product = await getProductByIdService(req.params.id);//params id laan jeye mn route /:id

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
