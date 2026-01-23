# Frontend Explanation (The Face)

This document explains ONLY the Frontend of your Bakery Admin System.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 1 — BIG PICTURE (FRONTEND)
## ━━━━━━━━━━━━━━━━━━━━━━

### What is the Frontend?
The Frontend is the **"Face"** of your application.
1.  It runs in the **Web Browser** (Chrome/Edge).
2.  It handles **User Interaction** (clicks, typing, reading).
3.  It manages **State** (what is currently shown on screen).
4.  It talks to the Backend API to get or save data.
5.  It does NOT save data permanently. It relies on the Backend for that.

### Key Technologies
*   **React**: The library used to build the interface.
*   **TypeScript (tsx)**: JavaScript with superpowers (types) to prevent bugs.
*   **Vite**: The build tool that runs the dev server (that fast update when you save).

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 2 — FRONTEND STRUCTURE
## ━━━━━━━━━━━━━━━━━━━━━━

Here is the folder tree of the Frontend:

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

### Folder Explanations
1.  **api/**: Contains `axios.ts`, which sets up the connection to the backend. It's like programming "Speed Dial 1" to be your Backend.
2.  **components/**: Small building blocks used on multiple pages.
    *   `Navbar`: Top bar with links.
    *   `ProtectedRoute`: A special component that checks if you are logged in.
3.  **contexts/**: "Global Variables". Instead of passing `user` data down from parent to child to grandchild, we put it in a "Context" so everyone can see "Who is logged in?".
4.  **pages/**: These are the actual screens.
    *   `Login.tsx`: The login form.
    *   `Products.tsx`: The dashboard.
5.  **services/**: Files that specifically handle asking for data. `product.service.ts` has functions like `getProducts()`.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 3 — FRONTEND FILES (ONE BY ONE)
## ━━━━━━━━━━━━━━━━━━━━━━

### 1. `src/main.tsx` (Start)
This file takes your React App and "injects" it into the HTML webpage. It's the spark plug.

### 2. `src/App.tsx` (The Router)
This determines which page to show based on the URL.

```tsx
<Routes>
    <Route path="/login" element={<Login />} />
    <Route
        path="/products"
        element={
            <ProtectedRoute>
                <Products />
            </ProtectedRoute>
        }
    />
</Routes>
```
**Key Concept:** Notice `<ProtectedRoute>`. We wrap the Products page inside it. This means "You shall not pass" unless you are logged in.

---

### 3. `src/components/ProtectedRoute.tsx` (The Bouncer)

```tsx
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Ask AuthContext

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // Kick out
    }

    return <>{children}</>; // Let in
};
```
**Explanation:** If `isAuthenticated` is false, it forces the browser to go to `/login`.

---

### 4. `src/api/axios.ts` (The Phone)
This is where we configure the calls to the backend.

```typescript
const api = axios.create({
    baseURL: 'http://localhost:5000', // Calling the Backend
});

// Interceptor: Runs before every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Check pocket for ID
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Show ID
    }
    return config;
});
```
**Explanation:** This automates the security. You don't have to manually attach the token every time you ask for products. This file does it automatically for every request.

---

### 5. `src/pages/Products.tsx` (The Dashboard)

```tsx
const Products = () => {
    const [products, setProducts] = useState([]); // Database in memory

    // Run this when page loads
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await productService.getProducts();
        setProducts(data); // Save data to state -> Screen updates
    };

    return (
        <div>
            {products.map(product => (
                <div className="card">{product.name}</div>
            ))}
        </div>
    );
};
```
**Explanation:**
1.  **`useEffect`**: Triggers the data fetch immediately when you open the page.
2.  **`setProducts`**: When data comes back, this function updates the screen.

---

## ━━━━━━━━━━━━━━━━━━━━━━
## STEP 4 — AUTHENTICATION FLOW (The User Story)
## ━━━━━━━━━━━━━━━━━━━━━━

This is how a user enters and uses the system.

**1. Registration (`/register`)**
*   User enters details.
*   Frontend sends data to Backend.
*   User is created.

**2. Login (`/login`)**
*   User enters email/password.
*   Frontend sends to Backend.
*   Backend replies with a **Token** (a long string of characters).
*   Frontend saves this Token in **LocalStorage** (Browser's built-in safe).

**3. Using the App**
*   User goes to **Products**.
*   `ProtectedRoute` sees the Token exists -> Allows entry.
*   Page loads.
*   `axios` takes the Token, attaches it to the request header.
*   Request goes to Backend: "Get Products (Here is my ID)".
*   Backend verifies ID -> Sends Products.
*   **Result:** User sees the product list.

**4. Logout**
*   User clicks Logout.
*   Frontend removes Token from LocalStorage.
*   Frontend redirects to Login page.
*   Now, `ProtectedRoute` will block access again.
