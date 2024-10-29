// storage.js
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, './elegant-moment-440103-f0-de59cfcda7e7.json'),
  projectId: 'elegant-moment-440103-f0',
});

// Bucket name
const bucketName = 'popcornmovie';


async function uploadFiles(files) {
    const uploadPromises = files.map(async ({ localFilePath, destinationFileName }) => {
      await storage.bucket(bucketName).upload(localFilePath, {
        destination: destinationFileName,
        gzip: true,
      });
      console.log(`${destinationFileName} uploaded to ${bucketName}`);
    });
  
    await Promise.all(uploadPromises);
  }
  
  // Function to read JSON file content directly from GCS
  async function readFileContent(fileName) {
    const file = storage.bucket(bucketName).file(fileName);
    const [contents] = await file.download();
    return JSON.parse(contents.toString('utf-8')); // Return parsed JSON
  }
  
  // Export functions
  module.exports = {
    uploadFiles,
    readFileContent,
  };
