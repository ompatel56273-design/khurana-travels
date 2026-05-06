const express = require('express');
const router = express.Router();
const { upload, uploadHomeImage, uploadHomeSecondImage } = require('../middleware/upload');
const { uploadFiles, uploadSingleFile } = require('../controllers/uploadController');

// Helper wrapper for different directories
const createUploadHandler = (baseUrl) => async (req, res, next) => {
  try {
    if (!req.file && (!req.files || req.files.length === 0)) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    if (req.file) {
      res.json({
        message: 'File uploaded successfully',
        file: `${baseUrl}/${req.file.filename}`,
      });
    } else {
      const fileUrls = req.files.map((file) => `${baseUrl}/${file.filename}`);
      res.json({
        message: 'Files uploaded successfully',
        files: fileUrls,
      });
    }
  } catch (error) {
    next(error);
  }
};

// General uploads (for users, documents, etc)
router.post('/', upload.array('files', 10), createUploadHandler('/uploads'));
router.post('/single', upload.single('file'), createUploadHandler('/uploads'));

// Home Page Images
router.post('/home-image', uploadHomeImage.single('file'), createUploadHandler('/Home-images'));

// Home Second Images (Itinerary slides)
router.post('/home-second-image', uploadHomeSecondImage.single('file'), createUploadHandler('/Home-second-image'));

module.exports = router;
