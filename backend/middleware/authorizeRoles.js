const User = require('../models/User');

module.exports = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // req.user is set by the auth middleware
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ msg: 'User not found, authorization denied' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
      }

      // Attach full user role to request for convenience in routes
      req.user.role = user.role;
      next();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
};
