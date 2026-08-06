const { Readable } = require('stream');
const { requireDrive } = require('./driveStorage');

const CONTENT_FILE_NAME = 'mouryan-site-content.json';
let contentFileId;

const driveListOptions = {
  supportsAllDrives: true,
  includeItemsFromAllDrives: true,
  corpora: 'allDrives',
  spaces: 'drive'
};

const getContentFileId = async () => {
  if (contentFileId) return contentFileId;

  const drive = requireDrive();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const response = await drive.files.list({
    q: `'${folderId}' in parents and name = '${CONTENT_FILE_NAME}' and trashed = false`,
    fields: 'files(id)',
    pageSize: 1,
    ...driveListOptions
  });
  contentFileId = response.data.files?.[0]?.id;
  return contentFileId;
};

const readData = async () => {
  const fileId = await getContentFileId();
  if (!fileId) {
    throw new Error(`No ${CONTENT_FILE_NAME} file exists in the configured Google Drive folder.`);
  }

  const drive = requireDrive();
  const response = await drive.files.get(
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'arraybuffer' }
  );
  return JSON.parse(Buffer.from(response.data).toString('utf8'));
};

const writeData = async (data) => {
  const drive = requireDrive();
  const body = Buffer.from(JSON.stringify(data, null, 2));
  const fileId = await getContentFileId();
  const media = { mimeType: 'application/json', body: Readable.from(body) };

  if (fileId) {
    await drive.files.update({ fileId, media, supportsAllDrives: true });
    return;
  }

  const created = await drive.files.create({
    requestBody: {
      name: CONTENT_FILE_NAME,
      mimeType: 'application/json',
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    },
    media,
    fields: 'id',
    supportsAllDrives: true
  });
  contentFileId = created.data.id;
};

module.exports = { readData, writeData, CONTENT_FILE_NAME };
