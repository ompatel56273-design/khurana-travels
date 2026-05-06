// @desc    Upload files (images/documents)
// @route   POST /api/upload
// @access  Public
const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('No files uploaded');
    }

    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);

    res.json({
      message: 'Files uploaded successfully',
      files: fileUrls,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Public
const uploadSingleFile = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    res.json({
      message: 'File uploaded successfully',
      file: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFiles, uploadSingleFile };
