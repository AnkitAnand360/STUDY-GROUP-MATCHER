const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    // Support demo/guest/mock tokens gracefully without 401 rejection
    if (
      token.startsWith("demo-token") ||
      token.startsWith("google-token") ||
      token.startsWith("mock-token")
    ) {
      req.user = {
        id: "650000000000000000000001",
        _id: "650000000000000000000001",
        name: "Ankit Anand",
        email: "ankit@aistudymatcher.io",
      };
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "mysecretkey123"
    );

    req.user = decoded;
    if (decoded && decoded.id && !decoded._id) {
      req.user._id = decoded.id;
    }

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};