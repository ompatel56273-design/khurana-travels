const express = require('express');
const router = express.Router();
const {
  getPackages,
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getPackages);
router.get('/all', protect, getAllPackages);
router.get('/:id', getPackageById);

// Protected routes
router.post('/', protect, createPackage);
router.put('/:id', protect, updatePackage);
router.delete('/:id', protect, deletePackage);

module.exports = router;
