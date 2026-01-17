const db = require("../config/db");

exports.log = async (data) => {
  console.log("AUDIT LOG DATA:", data);

  return db.query(
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
};
