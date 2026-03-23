
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
  const allowedFacultyRoles = ['faculty', 'faculty member', 'professor']; // adjust after checking actual Omniport role names

  const isFaculty = roles.some((role) =>
    allowedFacultyRoles.includes(String(role).toLowerCase())
  );

  if (!isFaculty) {
    return res.status(403).send('Access denied: only faculty members can access this portal.');
  }

  return next();
}

module.exports = {
  requireAuth,
  requireFaculty
};