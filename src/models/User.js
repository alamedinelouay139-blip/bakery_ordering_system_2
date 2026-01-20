import pool from "../config/db.js";

const User = {
  // Create new user
  create: async (name, email, passwordHash) => {
    const sql = `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.query(sql, [name, email, passwordHash]);
    return result;
  },

  // Find user by email (for login)
  findByEmail: async (email) => {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;

    const [rows] = await pool.query(sql, [email]);
    return rows[0];
  },

  // Find user by id (for JWT)
  findById: async (id) => {
    const sql = `SELECT * FROM users WHERE id = ?`;

    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  },

  // Alias for backwards compatibility
  getUserById: async (id) => {
    const sql = `SELECT * FROM users WHERE id = ?`;

    const [rows] = await pool.query(sql, [id]);
    return rows[0];
  }
};

export default User;
