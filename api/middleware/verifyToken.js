const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  // Get token from cookies, or wherever you're sending it from the client
  const token = req.cookies.ACCESS_TOKEN;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Attach decoded token payload to request object for further processing
    req.user = decoded;
    next(); // Move to the next middleware or endpoint handler
  });
}

module.exports = { JWT_SECRET, verifyToken };
