import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";

const AuthService = {

  register: async (name, email, password) => {
    const existing = await User.findByEmail(email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await User.create(name, email, passwordHash);

    return {
      id: result.insertId,
      name,
      email
    };
  },

  login: async (email, password, req) => {
    const user = await User.findByEmail(email);

    // ❌ Email not found
    if (!user) {
      await AuditLog.log({
        user_id: null,
        action: "LOGIN",
        target: "USER",
        status: "FAIL",
        ip: req.ip,
        agent: req.headers["user-agent"],
        old: null,
        new: { email }
      });

      throw new Error("Invalid email or password");
    }

    // ❌ Wrong password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      await AuditLog.log({
        user_id: user.id,
        action: "LOGIN",
        target: "USER",
        status: "FAIL",
        ip: req.ip,
        agent: req.headers["user-agent"],
        old: null,
        new: { email }
      });

      throw new Error("Invalid email or password");
    }

    // ✅ Successful login
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await AuditLog.log({
      user_id: user.id,
      action: "LOGIN",
      target: "USER",
      status: "SUCCESS",
      ip: req.ip,
      agent: req.headers["user-agent"],
      old: null,
      new: { email: user.email }
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
};

export default AuthService;
