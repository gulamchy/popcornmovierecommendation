


const { Storage } = require('@google-cloud/storage');
const path = require('path');
require('dotenv').config();


const keyFilename = process.env.NODE_ENV === 'production'
  ? '/etc/secrets/elegant-moment-440103-f0-de59cfcda7e7.json' // Render.com
  : path.join(__dirname, './elegant-moment-440103-f0-de59cfcda7e7.json');

// Initialize Google Cloud Storage
const storage = new Storage({
    // keyFilename: path.join(__dirname, './elegant-moment-440103-f0-de59cfcda7e7.json'),
    keyFilename: keyFilename,
    
    projectId: 'elegant-moment-440103-f0',
});

// Bucket name
const bucketName = 'popcornmovie';

// Function to read JSON file content directly from GCS
async function readFileContent(fileName) {
    try {
        const file = storage.bucket(bucketName).file(fileName);
        const [contents] = await file.download();
        return JSON.parse(contents.toString('utf-8')); // Return parsed JSON
    } catch (error) {
        console.error(`Error reading file ${fileName}:`, error);
        throw new Error("Failed to read file from GCS");
    }
}

// Export the readFileContent function
module.exports = {
    readFileContent,
};