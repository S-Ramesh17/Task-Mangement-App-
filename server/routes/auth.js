// routes/auth.js - Authentication routes

const express = require('express');
const router = express.Router();
const { register, loginUser } = require('../controllers/authController');

// Public routes — no auth required
router.post('/register', register);
router.post('/login', loginUser);

module.exports = router;
