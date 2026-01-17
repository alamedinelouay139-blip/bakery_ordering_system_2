import pool from "../config/db.js";


export const createProduct = async ({
  name,
  description,
  price,
  stock,
  is_active = 1,
  created_by = null,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO products
      (name, description, price, stock, is_active, created_by)
    VALUES
      (?, ?, ?, ?, ?, ?)
    `,
    [name, description, price, stock, is_active, created_by]
  );

  return result.insertId;
};

/**
 * READ all products
 */
export const getAllProducts = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM products`
  );
  return rows;
};

/**
 * READ single product by id
 */
export const getProductById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM products WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

/**
 * UPDATE product
 */
export const updateProduct = async (id, {
  name,
  description,
  price,
  stock,
  is_active,
}) => {
  const [result] = await pool.query(
    `
    UPDATE products
    SET
      name = ?,
      description = ?,
      price = ?,
      stock = ?,
      is_active = ?
    WHERE id = ?
    `,
    [name, description, price, stock, is_active, id]
  );

  return result.affectedRows;
};

/**
 * SOFT DELETE product
 */
export const deleteProduct = async (id) => {
  const [result] = await pool.query(
    `
    UPDATE products
    SET is_active = 0
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};
