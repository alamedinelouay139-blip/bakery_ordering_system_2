# 🥐 Bakery Ordering System

A full-stack bakery management application with user authentication, product CRUD operations, and a modern React frontend.

## ✨ Features

- **JWT Authentication** - Secure login with token-based authentication
- **Protected Routes** - Frontend and backend route guards
- **Product Management** - Full CRUD operations for bakery products
- **Toast Notifications** - Real-time feedback for all user actions
- **Loading Indicators** - Visual feedback during API operations
- **Swagger API Docs** - Interactive API documentation at `/api-docs`
- **Modern UI** - Glassmorphism design with dark theme

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Swagger** - API documentation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## 📋 Prerequisites

- Node.js (v16+)
- MySQL Server
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/alamedinelouay139-blip/bakery_ordering_system_2.git
cd bakery_ordering_system_2
```

### 2. Database Setup

Create a MySQL database and run this schema:

```sql
CREATE DATABASE bakery_db;
USE bakery_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 3. Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Edit .env with your database credentials
```

**.env file:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=bakery_db
JWT_SECRET=your_secret_key
PORT=5000
```

```bash
# Start backend server
npm run dev
```

Backend runs on `http://localhost:5000`

### 4. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
bakery_ordering_system_2/
├── src/                    # Backend source
│   ├── config/
│   │   └── db.js          # MySQL connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── product.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   └── active.guard.js       # Active user check
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── product.routes.js
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
│
├── frontend/              # React frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.ts   # HTTP client with interceptors
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── LoadingOverlay.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── NotificationContext.tsx
│   │   │   └── LoadingContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Products.tsx
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── product.service.ts
│   │   └── types/
│   │       └── index.ts
│   └── package.json
│
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Products (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Soft delete product |

## 🔒 Security Features

- **JWT Authentication** - Tokens expire and are verified on each request
- **Password Hashing** - Passwords stored with bcrypt
- **Auth Middleware** - Protects backend routes
- **Active Guard** - Checks if user account is active
- **Protected Routes** - Frontend route guards redirect to login
- **CORS Enabled** - Cross-origin requests configured

## 📖 API Documentation

Access Swagger UI at: `http://localhost:5000/api-docs`

## 🧪 Testing the App

1. **Register a User** (via Swagger or API client)
2. **Login** at `http://localhost:5173`
3. **Manage Products** - Add, edit, delete products
4. **Observe** - Toast notifications and loading spinners

## 📝 License

ISC

---

Built with ❤️ using Node.js, Express, React, and TypeScript
