// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// POST /api/auth/register - Only students can register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  if (password.length < 4) {
    return res.status(400).json({ message: 'Password must be at least 4 characters' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ FORCE student role
    const user = await User.create({
      name, // ✅ NEW FIELD
      email,
      password: hashedPassword,
      role: 'student'
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name, // ✅ RETURN NAME
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name, // ✅ INCLUDE NAME
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create default admin + student users
const createDefaultUsers = async () => {
  try {
    const adminEmail = 'admin@test.com';
    const userEmail = 'user@test.com';

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashed = await bcrypt.hash('1234', 10);

      await User.create({
        name: 'Admin', // ✅ ADD NAME
        email: adminEmail,
        password: hashed,
        role: 'admin'
      });

      console.log('✅ Default admin created');
    }

    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      const hashed = await bcrypt.hash('1234', 10);

      await User.create({
        name: 'Student', // ✅ ADD NAME
        email: userEmail,
        password: hashed,
        role: 'student'
      });

      console.log('✅ Default student created');
    }

  } catch (error) {
    console.error('❌ Error creating default users:', error.message);
  }
};

module.exports = { register, loginUser, createDefaultUsers };