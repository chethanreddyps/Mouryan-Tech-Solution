require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const redirectUri = 'http://localhost:53682/oauth2callback';

if (!clientId || !clientSecret) {
  console.error('Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in server/.env first.');
  process.exit(1);
}

const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
const authUrl = auth.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/drive.file']
});

console.log('Open this URL in your browser, sign in with the Google account that owns the Drive folder, and approve access:');
console.log(authUrl);

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) return;
  const url = new URL(req.url, redirectUri);
  const code = url.searchParams.get('code');
  if (!code) {
    res.end('Authorization failed. You can close this window.');
    server.close();
    return;
  }

  try {
    const { tokens } = await auth.getToken(code);
    if (!tokens.refresh_token) throw new Error('No refresh token was returned. Remove this app from your Google Account permissions and try again.');
    const envPath = path.join(__dirname, '.env');
    const currentEnv = fs.readFileSync(envPath, 'utf8');
    const nextEnv = /^GOOGLE_OAUTH_REFRESH_TOKEN=.*/m.test(currentEnv)
      ? currentEnv.replace(/^GOOGLE_OAUTH_REFRESH_TOKEN=.*/m, `GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`)
      : `${currentEnv.trimEnd()}\nGOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}\n`;
    fs.writeFileSync(envPath, nextEnv);
    res.end('Google Drive connected. Return to the terminal to copy the refresh token.');
    console.log('Google Drive refresh token saved securely to server/.env.');
  } catch (error) {
    res.end('Authorization failed. Return to the terminal for details.');
    console.error(error.message);
  } finally {
    server.close();
  }
});

server.listen(53682, () => console.log('Waiting for Google approval on http://localhost:53682...'));
