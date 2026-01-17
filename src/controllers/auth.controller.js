const AuthService = require("../services/auth.service");

const AuthController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await AuthService.register(name, email, password);

      res.status(201).json({
        message: "User registered successfully",
        user
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

const result = await AuthService.login(email, password, req);

      res.json(result);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
};

module.exports = AuthController;
