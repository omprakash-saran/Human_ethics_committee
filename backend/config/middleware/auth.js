
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/auth/omniport/login');
  }
  return next();
}

function requireFaculty(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/auth/omniport/login');
  }

  const roles = req.session.user.roles || [];
  const isFaculty = roles.some((role) => String(role).toLowerCase().includes('faculty'));

  if (!isFaculty) {
    return res.status(403).send('Access denied: only faculty members can access this portal.');
  }

  return next();
}

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  return next();
}

module.exports = {
  requireAuth,
  requireFaculty,
  requireAdmin
};