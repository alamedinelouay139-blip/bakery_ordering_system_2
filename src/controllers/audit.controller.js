import AuditLog from "../models/AuditLog.js";

/**
 * Get all audit logs
 */
export const getAllAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.getAll();
        return res.status(200).json({
            status: "success",
            data: logs,
        });
    } catch (err) {
        console.error("Error fetching audit logs:", err);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch audit logs",
        });
    }
};

export default { getAllAuditLogs };
