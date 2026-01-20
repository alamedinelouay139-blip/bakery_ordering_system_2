# Bakery Management System - Frontend

React + TypeScript + Vite frontend for managing bakery products with JWT authentication.

## ✅ Features

### Phase 1: Setup & Connection
- ✅ Vite + React + TypeScript project
- ✅ Proper folder structure (services, contexts, components, pages)
- ✅ Axios with JWT interceptors
- ✅ CORS enabled in backend

### Phase 2: Authentication
- ✅ Auth service (login/logout)
- ✅ Auth context for state management
- ✅ Login page with form validation

### Phase 3: Routing & Protection
- ✅ React Router setup
- ✅ Protected routes (redirects to login if not authenticated)
- ✅ Routes: `/login`, `/products`

### Phase 4: Products
- ✅ Product service (full CRUD)
- ✅ Products page with table display
- ✅ Add/Edit/Delete functionality
- ✅ Error handling (401 → logout, 403 → inactive user)

### Phase 5: Final Touch
- ✅ Navbar with logout button
- ✅ Modern, premium UI design

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- Backend server running on port 5000

### Installation

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:5173`

### Build for production

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── axios.ts          # Axios instance with JWT interceptors
│   ├── services/
│   │   ├── auth.service.ts   # Authentication API calls
│   │   └── product.service.ts # Product CRUD API calls
│   ├── contexts/
│   │   └── AuthContext.tsx   # Auth state management
│   ├── components/
│   │   ├── ProtectedRoute.tsx # Route protection
│   │   └── Navbar.tsx         # Navigation bar
│   ├── pages/
│   │   ├── Login.tsx          # Login page
│   │   └── Products.tsx       # Products management page
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.tsx                # Main app with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔐 Authentication Flow

1. User enters email & password on login page
2. Frontend calls `POST /api/auth/login`
3. Backend returns JWT token + user data
4. Token stored in localStorage
5. Axios interceptor adds token to all requests
6. Protected routes check for token
7. If 401 error → auto-logout and redirect to login

## 📦 API Integration

All API calls use Axios with automatic JWT token injection:

### Auth Service
- `login(email, password)` - POST `/api/auth/login`
- `register(data)` - POST `/api/auth/register`
- `logout()` - Clears localStorage

### Product Service
- `getProducts()` - GET `/products`
- `createProduct(data)` - POST `/products`
- `updateProduct(id, data)` - PUT `/products/:id`
- `deleteProduct(id)` - DELETE `/products/:id` (soft delete)

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management

## 🔧 Configuration

### Backend URL
Update in `src/api/axios.ts` if backend is not on `localhost:5000`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:5000',
});
```

## 📝 Usage

1. **Login**: Navigate to login page, enter credentials
2. **View Products**: See all products in a table
3. **Add Product**: Click "Add Product" button
4. **Edit Product**: Click "Edit" on any product row
5. **Delete Product**: Click "Delete" (soft delete, sets is_active=0)
6. **Logout**: Click logout button in navbar

## 🧠 Project Explanation

"The frontend is structured with services and protected routes, uses JWT authentication, and connects securely to a backend API to manage login and product CRUD."

---

Built with ❤️ using React + TypeScript + Vite
