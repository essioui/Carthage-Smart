const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Contact not authorized, no token");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.CONTACT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("Contact not authorized, token invalid");
    }

    req.contact = { id: decoded.id, ...decoded };
    next();
  });
});

module.exports = validateToken;
