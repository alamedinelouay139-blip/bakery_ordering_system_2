const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token sent
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Check if token is valid
    jwt.verify(token, process.env.JWT_SECRET);

    // Token exists and is valid → allow
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authGuard;
