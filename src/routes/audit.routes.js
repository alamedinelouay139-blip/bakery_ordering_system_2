import express from "express";
const router = express.Router();
import { getAllAuditLogs } from "../controllers/audit.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

/**
 * @swagger
 * tags:
 *   name: AuditLogs
 *   description: Audit log management (protected)
 */

/**
 * @swagger
 * /api/audit-logs:
 *   get:
 *     summary: Get all audit logs
 *     tags: [AuditLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of audit logs
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getAllAuditLogs);

export default router;
