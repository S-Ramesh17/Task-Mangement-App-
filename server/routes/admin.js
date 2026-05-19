// routes/admin.js - Admin-only routes

const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require login AND admin role
router.use(protect, adminOnly);

router.get('/users', getAllUsers);        // GET all users
router.delete('/users/:id', deleteUser); // DELETE a user
router.get('/stats', getStats);          // GET dashboard stats

module.exports = router;
