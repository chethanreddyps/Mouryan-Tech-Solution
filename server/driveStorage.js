const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const { google } = require('googleapis');

const readCredentials = () => {
  const value = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    const credentialsPath = path.resolve(value);
    if (fs.existsSync(credentialsPath)) {
      return JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    }
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON must be JSON or a valid JSON key-file path.');
  }
};

const getDrive = () => {
  const credentials = readCredentials();
  if (!credentials || !process.env.GOOGLE_DRIVE_FOLDER_ID) return null;

  const auth = new google.auth.GoogleAuth({
    credentials,
    // A Service Account needs full Drive scope to discover existing files
    // shared from another account. drive.file only exposes files created or
    // explicitly opened by this app, so it cannot find the existing content JSON.
    scopes: ['https://www.googleapis.com/auth/drive']
  });
  return google.drive({ version: 'v3', auth });
};

const requireDrive = () => {
  const drive = getDrive();
  if (!drive) throw new Error('Google Drive storage is not configured.');
  return drive;
};

const extractDriveFileId = (value) => {
  if (!value || typeof value !== 'string') return null;
  const text = value.trim();

  if (/^[a-zA-Z0-9_-]{20,}$/.test(text)) return text;

  try {
    const parsed = new URL(text);
    const byQuery = parsed.searchParams.get('id');
    if (byQuery) return byQuery;

    const pathMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]{20,})/);
    if (pathMatch?.[1]) return pathMatch[1];
  } catch {
    return null;
  }

  return null;
};

const uploadToDrive = async (file) => {
  const drive = requireDrive();
  const extension = path.extname(file.originalname || '') || '.img';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      mimeType: file.mimetype
    },
    media: { mimeType: file.mimetype, body: Readable.from(file.buffer) },
    fields: 'id',
    supportsAllDrives: true
  });

  await drive.permissions.create({
    fileId: created.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
    supportsAllDrives: true
  });

  return created.data.id;
};

module.exports = { getDrive, requireDrive, uploadToDrive, extractDriveFileId };
