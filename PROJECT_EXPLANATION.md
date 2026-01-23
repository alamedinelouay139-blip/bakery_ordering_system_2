# Comprehensive Project Explanation

This document explains the entire Bakery Admin System project from scratch. It is designed for a complete beginner.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 1 — BIG PICTURE
## ━━━━━━━━━━━━━━━━━━━━━━

### What problem does this project solve?
Imagine you own a bakery. You have delicious croissants and baguettes, but you are tracking your stock on sticky notes. It's a mess.
This project is a **Digital Admin System** for your bakery. It allows you to:
1.  **Log in** securely (so only you can change things).
2.  **See your products** in a beautiful list.
3.  **Add new products** (like a new "Strawberry Tart").
4.  **Update details** (change price or stock).
5.  **Delete** products you no longer sell.
6.  **Track security** (see who logged in and when).

### The Two Main Parts
This project is split into two separate worlds that talk to each other:

1.  **The Backend (Server)** 🧠
    *   This is the "Brain". It lives on a computer (server) and makes the decisions.
    *   It talks to the **Database** (where data is actually saved).
    *   It has rules: "You can't delete a product unless you are logged in."
    *   It doesn't care about colors or buttons; it only cares about **Data**.

2.  **The Frontend (Client)** 🎨
    *   This is the "Face". It's what you see in your browser.
    *   It has buttons, forms, colors, and animations.
    *   It doesn't save anything permanently. It just shows you what the Backend tells it to show.

### How they talk (The API)
They speak a language called **HTTP** (HyperText Transfer Protocol).
*   **Frontend says:** "Hey Backend, please give me the list of products." (This is a `GET` request).
*   **Backend says:** "Sure, here they are: [Croissant, Baguette]." (This is a `Response`).
*   **Frontend says:** "I want to delete Product #5." (This is a `DELETE` request).
*   **Backend says:** "Done. It's gone."

### What are "Protected Routes"?
Some doors in your bakery are open to everyone (like the front door). others are locked (like the safe).
*   **Public Routes:** Pages anyone can see (e.g., Login Page, Register Page).
*   **Protected Routes:** Pages only a **Logged In** user can see (e.g., Products Page).
*   If you try to go to `/products` without logging in, the Frontend will kick you back to the Login page.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 2 — BACKEND STRUCTURE
## ━━━━━━━━━━━━━━━━━━━━━━

Here is the exact folder structure of the "Brain" (Backend).

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
1.  **config/**: Configuration. `db.js` sets up the connection to the MySQL database. Without this, the app has no memory.
2.  **controllers/**: These handle the incoming requests (`req`) and send back responses (`res`). They are like managers who take an order and tell the workers what to do.
3.  **middleware/**: Code that runs *before* the controller. Like a security guard checking your ID card before letting you into the office.
4.  **models/**: The only files that actually touch the database. They run SQL commands like `SELECT` or `INSERT`.
5.  **routes/**: These define the URLs. If you visit `/api/products`, the route folder sends you to the correct Controller.
6.  **services/**: The "Product Logic". If a controller is a manager, the Service is the skilled worker. It validates data (e.g., "Price cannot be negative") before saving it.

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

**Explanation:**
1.  **`dotenv.config()`**: Loads secret passwords (like database password) from a hidden `.env` file.
2.  **`import app`**: Imports the specific rules of our app from `app.js`.
3.  **`app.listen`**: Starts the server specifically on port 5000. It sits there waiting for the Frontend to call it.

---

### 2. `src/app.js` (The Setup)
This configures the Express application.

```javascript
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import auditRoutes from "./routes/audit.routes.js";

// Middleware
import authMiddleware from "./middleware/auth.middleware.js";
import activeGuard from "./middleware/active.guard.js";

const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json());

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bakery API",
      version: "1.0.0",
      description: "Bakery Authentication & Product API",
    },
    servers: [
      { url: "http://localhost:5000" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/audit-logs", auditRoutes);

// 🔒 Example protected routes
app.get(
  "/api/profile",
  authMiddleware,
  activeGuard,
  (req, res) => {
    res.json({
      message: "You are authenticated and active",
      user: req.user,
    });
  }
);

app.get(
  "/api/secret",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "You passed the routing guard!",
    });
  }
);

export default app;
```

**Explanation:**
1.  **`express()`**: Creates the web server app.
2.  **`app.use(cors())`**: Security setting. Allows the Frontend (on port 5173) to talk to this Backend (on port 5000). Without this, the browser would block the connection.
3.  **`app.use(express.json())`**: Teach the server to understand JSON data (like `{ "name": "Bread" }`).
4.  **Swagger**: Sets up distinct documentation page at `/api-docs` so developers can see available API commands.
5.  **`app.use("/api/auth", ...)`**: connects the routes. Any URL starting with `/api/auth` goes to `authRoutes`.

---

### 3. `src/config/db.js` (The Memory)
Connects to the MySQL database.

```javascript
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
```

**Explanation:**
1.  **`createPool`**: Creates a pool of connections (like having 10 phone lines open) so multiple users can talk to the database at once.
2.  It uses passwords from the environment (`process.env`) for security.
3.  **`getConnection()`**: Tests if the database works. If "MySQL connected" prints, we are good.

---

### 4. `src/models/User.js` (User Data)
Defines how we talk to the `users` table.

```javascript
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
```

**Explanation:**
-   **`create`**: Adds a new row to the `users` table. Note it saves `password_hash` (scrambled), NEVER the real password.
-   **`findByEmail`**: Finds a user to check if they exist during login.

---

### 5. `src/models/Product.js` (Product Data)
Defines how we talk to the `products` table.

```javascript
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
```

**Explanation:**
-   **`createProduct`**: Inserts a new croissant.
-   **`getAllProducts`**: Get the list required for the frontend.
-   **`deleteProduct`**: This is special. It performs a **Soft Delete**. It doesn't actually remove the row. It sets `is_active = 0`. This way, we keep the history, but the product "disappears" from the main list.

---

### 6. `src/routes/product.routes.js` (The URLs)
Maps URLs to Controllers.

```javascript
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
// ... (Swagger docs omitted for brevity) ...

router.post(
  "/",
  authMiddleware,
  activeGuard,
  createProduct
);

router.get(
  "/",
  authMiddleware,
  activeGuard,
  getAllProducts
);

router.get(
  "/:id",
  authMiddleware,
  activeGuard,
  getProductById
);

router.put(
  "/:id",
  authMiddleware,
  activeGuard,
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  activeGuard,
  deleteProduct
);

export default router;
```

**Explanation:**
-   **`router.get("/", ...)`**: When someone sends a GET to `/api/products`...
-   **`authMiddleware`**: First Check: "Are you logged in?"
-   **`activeGuard`**: Second Check: "Is your account active?"
-   **`getAllProducts`**: If yes to both, run the logic to get data.

---

### 7. `src/controllers/product.controller.js` (The Manager)
Handles the result of the logic.

```javascript
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
// ... other functions follow same pattern ...
export const getProductById = async (req, res) => { /* ... */ };
export const updateProduct = async (req, res) => { /* ... */ };
export const deleteProduct = async (req, res) => { /* ... */ };
```

**Explanation:**
-   It receives the `req` (request).
-   It calls the **Service** (`getAllProductsService`) to get the work done.
-   If successful (`try`), it sends `200 OK` (Green light).
-   If it fails (`catch`), it sends `500 Error` or `400 Error` (Red light).

---

### 8. `src/services/product.service.js` (The Business Logic)
The worker that enforces rules.

```javascript
/*Validate input data, Enforce business rules... */
import * as ProductModel from "../models/Product.js";

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

export const getAllProductsService = async () => {
  return await ProductModel.getAllProducts();
};

// ... other services ...
```

**Explanation:**
-   Before creating a product, it checks: "Is the price negative?"
-   If yes, it throws an error immediately; it doesn't even bother talking to the database.
-   If the input is good, it calls `ProductModel.createProduct`.

---

### 9. `src/middleware/auth.middleware.js` (The Security Guard)
Crucial for protection.

```javascript
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid token (user not found)" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authGuard;
```

**Explanation:**
1.  **Check Header**: Checks if the user sent a specific "Authorization" header.
2.  **Bearer Token**: The header looks like `Bearer <token_code>`. It extracts the code.
3.  **Verify**: Uses your Secret Key to check if the token is fake.
4.  **`req.user = user`**: If valid, it attaches the User object to the request. Now subsequent parts (like Controllers) know WHO is engaging.
5.  **`next()`**: Important! It tells Express "Let this person pass to the next stage."

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 4 — DATABASE
## ━━━━━━━━━━━━━━━━━━━━━━

### Why MySQL?
It is a Relational Database. It stores data in tables (like Excel sheets) that link to each other.

### Tables

1.  **users**
    *   `id`: Unique ID for every user (1, 2, 3...).
    *   `name`: "John Doe".
    *   `email`: "john@bakery.com".
    *   `password_hash`: A scrambled code (e.g., `$2a$10$xyz...`). If a hacker steals the DB, they can't read the passwords.
    *   `is_active`: `1` (Active) or `0` (Banned).

2.  **products**
    *   `id`: Unique product ID.
    *   `name`: "Chocolate Croissant".
    *   `price`: `2.50`.
    *   `stock`: `20`.
    *   `is_active`: `1` (Selling) or `0` (Deleted).
    *   `created_by`: Links to `users.id` (Who added this?).

3.  **audit_logs**
    *   Records every major action.
    *   "User John failed to login at 10:00 AM".
    *   This is for security and tracking.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 5 — FRONTEND STRUCTURE
## ━━━━━━━━━━━━━━━━━━━━━━

The "Face" of the application.

```
frontend/src/
├── api/             # API Configuration
│   └── axios.ts     # The "Phone" (calls backend)
├── components/      # Reusable pieces
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── Toast.tsx
│   └── LoadingOverlay.tsx
├── contexts/        # Global State (Data shared everywhere)
│   ├── AuthContext.tsx
│   ├── LoadingContext.tsx
│   └── NotificationContext.tsx
├── pages/           # The Full Screens
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Products.tsx
│   └── AuditLogs.tsx
├── services/        # Organizing API calls
│   ├── auth.service.ts
│   └── product.service.ts
├── App.tsx          # Main Router
└── main.tsx         # Starting point
```

**Key Concepts:**
*   **Components vs Pages:** A `Page` is a full screen (like the Login Page). A `Component` is a piece of a page (like the Navbar or a Button).
*   **Contexts:** A way to share data (like "Is the user logged in?") with the *entire* app, so we don't have to pass it manually to every single button.
*   **tsx:** This means "TypeScript React". It's JavaScript + HTML mixed together.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 6 — FRONTEND FILES (ONE BY ONE)
## ━━━━━━━━━━━━━━━━━━━━━━

### 1. `frontend/src/main.tsx` (Start)
Mounts the React app onto the HTML page.

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

### 2. `frontend/src/App.tsx` (The Router)
The traffic controller of the frontend.

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
// ... imports ...

const App: React.FC = () => {
    return (
        <NotificationProvider>
            <LoadingProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/products"
                                element={
                                    <ProtectedRoute>
                                        <Products />
                                    </ProtectedRoute>
                                }
                            />
                            {/* ... more routes ... */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </BrowserRouter>
                    <Toast />
                    <LoadingOverlay />
                </AuthProvider>
            </LoadingProvider>
        </NotificationProvider>
    );
};
export default App;
```

**Explanation:**
-   **Providers**: `AuthProvider` wraps everything. This means *any* page can ask "Am I logged in?".
-   **Routes**: Defines URLs.
-   **`ProtectedRoute`**: Notice how `<Products />` is wrapped inside it? This means you CANNOT see Products unless the `ProtectedRoute` allows it.

### 3. `frontend/src/components/ProtectedRoute.tsx` (The Bouncer)

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
```

**Explanation:**
-   It asks `useAuth()`: "Is this user authenticated?"
-   If **No**: It forces the browser to go to `/login`.
-   If **Yes**: It renders the `children` (the page you wanted to see).

### 4. `frontend/src/api/axios.ts` (The Phone)
Configures how we call the backend.

```typescript
import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
// ... error handling ...
);

export default api;
```

**Explanation:**
-   **`baseURL`**: Tells pieces of the app "The backend is at localhost:5000".
-   **Interceptor**: Before *every* request (like "Get Products"), it automatically checks local storage for a Token.
-   If it finds a token, it stamps it onto the request header (`Bearer ...`). This is how the backend knows who you are!

### 5. `frontend/src/pages/Products.tsx` (Main Page)
Displays the products. (Truncated for brevity, focusing on key logic).

```tsx
// ... imports ...
const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    // ... other state ...

    // Load products on start
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await productService.getProducts();
        setProducts(data);
    };

    // ... handleAdd, handleEdit, confirmDelete ...

    return (
        <div className="container">
           {/* ... UI for headers, lists, and modals ... */}
        </div>
    );
};
```

**Explanation:**
-   **`useEffect`**: Runs once when the page opens. Calls `loadProducts`.
-   **`productService.getProducts`**: The specialized worker that uses `api/axios` to ask the backend for data.
-   **`useState`**: Stores the list of products in the browser's temporary memory to show them on screen.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 7 — AUTHENTICATION FLOW (THE STORY)
## ━━━━━━━━━━━━━━━━━━━━━━

This is the complete lifecycle of a user accessing your system.

**1. Registration**
*   User goes to `/register`.
*   Enters "John", "john@bakery.com", "secret123".
*   Frontend sends `POST` to Backend.
*   Backend **hashes** "secret123" into "$2b$10$..." and saves it to the database.

**2. Login**
*   User goes to `/login`.
*   Enters email and password.
*   Frontend sends data to Backend.
*   Backend finds the user. It compares the entered password with the hashed password in the DB.
*   **Match!** Backend generates a **JWT (JSON Web Token)**. This is a digital ID card.
*   Backend sends the Token back to the Frontend.

**3. Storage**
*   Frontend (`auth.service.ts`) receives the Token.
*   It saves it into **LocalStorage** (the browser's pocket).
*   `AuthContext` updates: `isAuthenticated = true`.

**4. Accessing a Protected Page**
*   User clicks "Products".
*   `ProtectedRoute` checks `isAuthenticated`. It sees "True". It lets the user in.
*   The `Products` page loads. It tries to fetch the list of products.
*   `axios.ts` wakes up. It grabs the Token from the browser's pocket and stamps it on the request header.
*   The request flies to the Backend.

**5. Verification**
*   Backend receives the request.
*   `auth.middleware.js` intercepts it. It looks at the Token.
*   It validates the digital signature. "Yes, this token was issued by us and hasn't expired."
*   It finds the User ID inside the token.
*   It lets the request pass to the Controller.

**6. Success**
*   The Controller gets the products from the DB.
*   Backend sends the list back.
*   Frontend displays the croissants.

---
**This concludes the explanation of your specific project.**
