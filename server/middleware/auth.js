// middleware/auth.js - Simple role-based middleware (No JWT)
// Frontend sends user data in X-User header as JSON

const protect = (req, res, next) => {
  try {
    const userHeader = req.headers['x-user'];
    if (!userHeader) {
      return res.status(401).json({ message: 'Not authenticated. Please login.' });
    }

    const user = JSON.parse(userHeader);
    if (!user || !user.id || !user.role) {
      return res.status(401).json({ message: 'Invalid user data. Please login again.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed. Please login again.' });
  }
};

// Only allows admin users to access the route
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

module.exports = { protect, adminOnly };
