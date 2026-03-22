const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Accept token from cookie OR Authorization header
  const token =
    req.cookies.accessToken ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);
  if (!token) return res.status(401).json({ message: "You are not authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });
    req.userId = payload.id;
    req.role = payload.role;
    next();
  });
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "You are not authorized for this action!" });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
