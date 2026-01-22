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
app.use("/products", productRoutes);
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
