const JWT_SECRET = process.env.JWT_SECRET || "[{Q#2'[q]-0i";

function verifyToken(req, res, next) {
  // Get token from request headers, cookies, or wherever you're sending it from the client
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

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
