const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateContactToken = asyncHandler(async (req, res, next) => {
  let token;

    // Check for the authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    try {
        // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.CONTACT_SECRET);
      req.contact = { _id: decoded.id, ...decoded };
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Contact not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Contact not authorized, no token");
  }
});

module.exports = validateContactToken;
