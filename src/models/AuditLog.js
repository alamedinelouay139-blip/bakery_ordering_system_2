import pool from "../config/db.js";

const log = async (data) => {
  console.log("AUDIT LOG DATA:", data);

  const [result] = await pool.query(
    `INSERT INTO audit_logs 
     (user_id, action, target, status, ip_address, user_agent, old_value, new_value)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.action,
      data.target,
      data.status,
      data.ip,
      data.agent,
      JSON.stringify(data.old),
      JSON.stringify(data.new)
    ]
  );

  return result;
};

const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT al.*, u.name as user_name, u.email as user_email
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ORDER BY al.created_at DESC
     LIMIT 100`
  );
  return rows;
};

export default { log, getAll };
