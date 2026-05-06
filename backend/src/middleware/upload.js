const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploader = (folderName) => {
  const dir = path.join(__dirname, `../../${folderName}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (JPEG, PNG, WebP) and PDF files are allowed'));
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },
  });
};

const upload = createUploader('uploads');
const uploadHomeImage = createUploader('Home-images');
const uploadHomeSecondImage = createUploader('Home-second-image');

module.exports = { upload, uploadHomeImage, uploadHomeSecondImage };
