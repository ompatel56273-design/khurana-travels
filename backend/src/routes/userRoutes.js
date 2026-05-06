const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth'); // Admin auth

// All user routes are protected by admin auth
router.route('/')
  .get(protect, getUsers);

router.route('/:id')
  .put(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;
