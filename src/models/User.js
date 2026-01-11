const pool = require("../config/db");

const User = {
  // Create new user
  create: (name, email, passwordHash) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
      `;

      pool.query(sql, [name, email, passwordHash], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Find user by email (for login)
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;

      pool.query(sql, [email], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  },

  // Find user by id (for JWT)
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE id = ?`;

      pool.query(sql, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  }
};

module.exports = User;
