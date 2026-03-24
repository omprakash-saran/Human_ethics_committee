const express = require('express');
const crypto = require('crypto');
const { omniportBaseUrl, clientId, clientSecret, redirectUri, frontendUrl } = require('../config/oauth');

const router = express.Router();

/**
 * GET /auth/omniport/login
 * Redirects user to Omniport OAuth authorisation page
 */
router.get('/omniport/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state
  });

  const authUrl = `${omniportBaseUrl}/oauth/authorise/?${params.toString()}`;
  return res.redirect(authUrl);
});

/**
 * GET /auth/omniport/callback
 * Omniport redirects here with ?code=...&state=...
 */
router.get('/omniport/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state || state !== req.session.oauthState) {
      return res.status(400).send('Invalid OAuth state or missing code.');
    }

    // one-time use state
    delete req.session.oauthState;

    // 1) Exchange authorisation code for token
    const tokenResponse = await fetch(`${omniportBaseUrl}/open_auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return res.status(401).send('OAuth token exchange failed.');
    }

    // 2) Fetch user profile using access token
    const profileResponse = await fetch(`${omniportBaseUrl}/open_auth/get_user_data/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const profile = await profileResponse.json();
    if (!profileResponse.ok) {
      return res.status(401).send('Unable to fetch user data from Omniport.');
    }

    const roles = (profile?.person?.roles || [])
      .filter((r) => String(r?.activeStatus || '').includes('IS_ACTIVE'))
      .map((r) => String(r?.role || '').toLowerCase());

    const allowedFacultyRoles = ['faculty', 'faculty member', 'professor', 'student']; // adjust exact labels if needed
    const isFaculty = roles.some((role) => allowedFacultyRoles.includes(role));

    if (!isFaculty) {
      return res.status(403).send('Access denied: only faculty members can log in.');
    }


    req.session.user = {
      userId: profile?.userId,
      username: profile?.username,
      fullName: profile?.person?.fullName || '',
      roles
    };

    return res.redirect(`${frontendUrl}/applications`);
  } catch (error) {
    console.error('Omniport OAuth callback error:', error);
    return res.status(500).send('OAuth login failed.');
  }
});

/**
 * POST /auth/logout
 * Destroys local session (optional: token revoke can be added later)
 */
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true });
  });
});

module.exports = router;