const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env'),
  override: true
});

console.log('OMNIPORT_BASE_URL:', process.env.OMNIPORT_BASE_URL);

const requiredVars = [
  'OMNIPORT_BASE_URL',
  'OMNIPORT_CLIENT_ID',
  'OMNIPORT_CLIENT_SECRET',
  'OMNIPORT_REDIRECT_URI',
  'SESSION_SECRET'
];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  omniportBaseUrl: process.env.OMNIPORT_BASE_URL.replace(/\/+$/, ''),
  clientId: process.env.OMNIPORT_CLIENT_ID,
  clientSecret: process.env.OMNIPORT_CLIENT_SECRET,
  redirectUri: process.env.OMNIPORT_REDIRECT_URI,
  sessionSecret: process.env.SESSION_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
  port: process.env.PORT || 3000
};