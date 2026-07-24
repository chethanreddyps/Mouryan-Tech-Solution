require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { writeData, CONTENT_FILE_NAME } = require('./driveDataStore');

const localDataPath = path.join(__dirname, 'data.json');

const migrate = async () => {
  if (!fs.existsSync(localDataPath)) {
    throw new Error('server/data.json was not found. Nothing is available to migrate.');
  }

  const data = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
  await writeData(data);
  console.log(`${CONTENT_FILE_NAME} was created in Google Drive.`);
  console.log('After verifying the website, remove server/data.json. It is already ignored by Git.');
};

migrate().catch((error) => {
  console.error(`Migration failed: ${error.message}`);
  process.exitCode = 1;
});
