import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Test connection
pool.getConnection()
  .then((connection) => {
    console.log("✅ MySQL connected to bakery_db");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err);
  });

export default pool;
