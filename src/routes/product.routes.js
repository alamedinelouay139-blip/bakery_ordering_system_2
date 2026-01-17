import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import activeGuard from "../middleware/active.guard.js";

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Chocolate Croissant
 *         description:
 *           type: string
 *           example: Fresh baked croissant with chocolate
 *         price:
 *           type: number
 *           format: float
 *           example: 2.50
 *         stock:
 *           type: integer
 *           example: 20
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * Product CRUD routes
 * All routes are protected
 */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */

// CREATE product
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 */
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 */

router.post(
  "/",
  authMiddleware,
  activeGuard,
  createProduct
);

// READ all products
router.get(
  "/",
  authMiddleware,
  activeGuard,
  getAllProducts
);

// READ product by id
router.get(
  "/:id",
  authMiddleware,
  activeGuard,
  getProductById
);

// UPDATE product
router.put(
  "/:id",
  authMiddleware,
  activeGuard,
  updateProduct
);

// DELETE product (soft delete)
router.delete(
  "/:id",
  authMiddleware,
  activeGuard,
  deleteProduct
);

export default router;
