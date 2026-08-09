const express = require('express');
const crypto = require('crypto');
const { omniportBaseUrl, clientId, clientSecret, redirectUri, frontendUrl } = require('../config/oauth');
const { createAuthToken } = require('../config/middleware/auth');

const router = express.Router();

router.get('/omniport/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;

  req.session.save((err) => {
    if (err) {
      console.error('Session save error:', err);
      return res.status(500).send('Session error');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state
    });

    const authUrl = `${omniportBaseUrl}/oauth/authorise/?${params.toString()}`;
    return res.redirect(authUrl);
  });
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state || state !== req.session.oauthState) {
      return res.status(400).send('Invalid OAuth state or missing code.');
    }

    delete req.session.oauthState;

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

    const isFaculty = roles.some((role) => String(role).toLowerCase().includes('faculty'));

    if (!isFaculty) {
      return res.status(403).send('Access denied: only faculty members can log in.');
    }


    const user = {
      userId: profile?.userId,
      username: profile?.username,
      fullName: profile?.person?.fullName || '',
      roles
    };

    req.session.user = user;

    const token = createAuthToken(user);
    return res.redirect(`${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error('Omniport OAuth callback error:', error);
    return res.status(500).send('OAuth login failed.');
  }
});

router.post('/logout', (req, res) => {
  if (!req.session) {
    return res.status(200).json({ success: true });
  }

  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true });
  });
});

module.exports = router;
