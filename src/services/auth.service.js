const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const AuthService = {
  register: async (name, email, password) => {
    // Check if user already exists
    const existing = await User.findByEmail(email);
    if (existing) {
      throw new Error("Email already registered");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Store user
    const result = await User.create(name, email, passwordHash);

    return {
      id: result.insertId,
      name,
      email
    };
  },

  login: async (email, password) => {
    const user = await User.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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

module.exports = AuthService;
