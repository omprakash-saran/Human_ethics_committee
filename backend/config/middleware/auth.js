
const jwt = require('jsonwebtoken');
const config = require('../oauth');

const jwtSecret = process.env.JWT_SECRET || config.sessionSecret;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

function getBearerToken(req) {
  const authHeader = req.get('Authorization') || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function normalizeUser(payload) {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  return {
    userId: payload.userId,
    username: payload.username,
    fullName: payload.fullName || '',
    roles: Array.isArray(payload.roles) ? payload.roles : [],
    isAdmin: Boolean(payload.isAdmin)
  };
}

function createAuthToken(user) {
  return jwt.sign(normalizeUser(user), jwtSecret, { expiresIn: jwtExpiresIn });
}

function attachUserFromToken(req) {
  const token = getBearerToken(req);

  if (!token) {
    return null;
  }

  try {
    const user = normalizeUser(jwt.verify(token, jwtSecret));
    req.user = user;
    return user;
  } catch (error) {
    return null;
  }
}

function getAuthenticatedUser(req) {
  return attachUserFromToken(req) || req.session?.user || null;
}

function requireAuth(req, res, next) {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return res.redirect('/auth/omniport/login');
  }

  req.user = user;
  return next();
}

function requireFaculty(req, res, next) {
  const user = getAuthenticatedUser(req);

  if (!user) {
    return res.redirect('/auth/omniport/login');
  }

  const roles = user.roles || [];
  const isFaculty = roles.some((role) => String(role).toLowerCase().includes('faculty'));

  if (!isFaculty) {
    return res.status(403).send('Access denied: only faculty members can access this portal.');
  }

  req.user = user;
  return next();
}

function requireAdmin(req, res, next) {
  const user = getAuthenticatedUser(req);

  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  req.user = user;
  return next();
}

module.exports = {
  createAuthToken,
  getAuthenticatedUser,
  requireAuth,
  requireFaculty,
  requireAdmin
};
