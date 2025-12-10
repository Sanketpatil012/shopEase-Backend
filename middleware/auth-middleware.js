const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "Access denied, No token provided" }); 
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ msg: "Access denied, Invalid Token" }); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "Secret"); 
    console.log("Decoded Token ", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}

function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    return res.status(403).json({ error: "Access Forbidden" }); 
  }
}

module.exports = { verifyToken, isAdmin };
