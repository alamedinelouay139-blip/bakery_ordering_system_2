# Backend Explanation (The Brain)

This document explains ONLY the Backend of your Bakery Admin System.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 1 — BIG PICTURE (BACKEND)
## ━━━━━━━━━━━━━━━━━━━━━━

### What is the Backend?
The Backend is the **"Brain"** of your application.
1.  It lives on the server (your computer, for now).
2.  It listens for commands (like "Get all products" or "Delete ID #5").
3.  It ensures **Security** (checks "Are you allowed to do this?").
4.  It talks to the **Database** (MySQL) to permanently save data.
5.  It speaks **JSON** (data), not HTML (visuals).

### The API (How people talk to it)
The Backend opens a door at `http://localhost:5000`.
*   If you knock on `/api/products` (GET), it gives you the product list.
*   If you knock on `/api/auth/login` (POST), it checks your password.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 2 — BACKEND STRUCTURE
## ━━━━━━━━━━━━━━━━━━━━━━

Here is the folder tree of the Backend:

```
src/
├── config/           # Setup files
│   └── db.js         # Database configuration
├── controllers/      # The "Managers" (handle requests)
│   ├── auth.controller.js
│   ├── product.controller.js
│   └── audit.controller.js
├── middleware/       # The "Security Guards"
│   ├── active.guard.js
│   └── auth.middleware.js
├── models/           # The "Data Blueprints" (talk to SQL)
│   ├── AuditLog.js
│   ├── Product.js
│   └── User.js
├── routes/           # The "Receptionists" (direct traffic)
│   ├── audit.routes.js
│   ├── auth.routes.js
│   └── product.routes.js
├── services/         # The "Workers" (business logic)
│   ├── auth.service.js
│   └── product.service.js
├── app.js            # The Application setup
└── server.js         # The Entry Point (starts the machine)
```

### Folder Explanations
1.  **config/**: `db.js` sets up the connection to the MySQL database. Without this, the app has no memory.
2.  **controllers/**: These are **Managers**. They receive the request from the outside world, ask the Service to do the work, and then send back the answer (Response).
3.  **middleware/**: **Security Guards**. They run *before* the controller. They check tokens, permissions, and status.
4.  **models/**: **SQL Handlers**. The only files that actually touch the database (INSERT, SELECT, UPDATE).
5.  **routes/**: **Receptionists**. They look at the URL (`/api/products`) and send the user to the correct Controller.
6.  **services/**: **Skilled Workers**. They contain the business rules (e.g., "Price cannot be negative").

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 3 — BACKEND FILES (ONE BY ONE)
## ━━━━━━━━━━━━━━━━━━━━━━

### 1. `src/server.js` (The Entry Point)
This is the file you run to start the backend.

```javascript
import dotenv from "dotenv";
dotenv.config();          // 🔥 MUST be first

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
**Keys:** Loads passwords (`dotenv`) and starts listening on Port 5000.

---

### 2. `src/app.js` (The Setup)
This configures the Express application.

```javascript
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
// ... imports ...

const app = express();

// Middleware
app.use(cors()); // Allow Frontend to talk to us
app.use(express.json()); // Understand JSON data

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;
```
**Keys:** Sets up `cors` (security permission) and connects the URL paths to the Route files.

---

### 3. `src/config/db.js` (The Memory)
Connects to the MySQL database.

```javascript
import mysql from "mysql2/promise";
// ... (dotenv) ...

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

export default pool;
```
**Keys:** Creates a "Pool" of connections so multiple users can access the DB at once.

---

### 4. `src/models/Product.js` (Product Data)
Talks to the `products` table in MySQL.

```javascript
export const createProduct = async ({ name, price, stock, ... }) => {
  const [result] = await pool.query(
    `INSERT INTO products (name, price, stock...) VALUES (?, ?, ...)`
  );
  return result.insertId;
};

export const deleteProduct = async (id) => {
  const [result] = await pool.query(
    `UPDATE products SET is_active = 0 WHERE id = ?`
  );
  return result.affectedRows;
};
```
**Keys:** Contains the actual SQL queries. Notice `deleteProduct` does a **Soft Delete** (`is_active = 0`) instead of actually deleting the row.

---

### 5. `src/routes/product.routes.js` (The URLs)
Maps URLs to Controllers.

```javascript
const router = express.Router();

router.get(
  "/",
  authMiddleware,   // 1. Check Login
  activeGuard,      // 2. Check Active Status
  getAllProducts    // 3. Get Data
);

router.delete(
  "/:id",
  authMiddleware,
  activeGuard,
  deleteProduct
);
```
**Keys:** This is where we protect the routes. We put `authMiddleware` *before* the actual action.

---

### 6. `src/controllers/product.controller.js` (The Manager)
Handles the flow.

```javascript
export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService(); // Ask Service for data

    return res.status(200).json({  // Send Valid Response (200 OK)
      status: "success",
      data: products,
    });
  } catch (err) {
    return res.status(500).json({ // Send Error Response
      status: "error",
      message: "Failed to fetch products",
    });
  }
};
```

---

### 7. `src/services/product.service.js` (The Business Logic)
Enforces rules.

```javascript
export const createProductService = async (data, userId) => {
  if (data.price < 0) {
    throw new Error("Price cannot be negative"); // 🛑 Stop here!
  }

  // If safe, call the Model
  return await ProductModel.createProduct({ ...data, created_by: userId });
};
```

---

### 8. `src/middleware/auth.middleware.js` (The Security Guard)
Verifies the User.

```javascript
const authGuard = async (req, res, next) => {
  // 1. Get Token from Header
  const token = req.headers.authorization.split(" ")[1];

  // 2. Verify Token is valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Find User
  const user = await UserModel.findById(decoded.id);

  // 4. Update Request and Pass
  req.user = user;
  next();
};
```

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 4 — DATABASE
## ━━━━━━━━━━━━━━━━━━━━━━

### Why MySQL?
It is a Relational Database. It stores data in tables (like Excel sheets) that link to each other.

### Tables

1.  **users**
    *   `id`: Unique ID.
    *   `email`: User's login email.
    *   `password_hash`: Scrambled password (never plain text).
    *   `is_active`: `1` (Active) or `0` (Banned).

2.  **products**
    *   `id`: Unique product ID.
    *   `name`: "Chocolate Croissant".
    *   `price`: `2.50`.
    *   `stock`: `20`.
    *   `is_active`: `1` (Selling) or `0` (Deleted).
    *   `created_by`: Links to `users.id` (Who added this?).

3.  **audit_logs**
    *   Records every major action (Login success/fail).
    *   This is for security.
