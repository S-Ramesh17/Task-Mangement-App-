// index.js - Main entry point for the Express server

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const { createDefaultUsers } = require('./controllers/authController');

// Load environment variables
dotenv.config();

// Connect to MongoDB, then create default users
connectDB().then(() => {
  createDefaultUsers();
});

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
  res.send('✅ Task Manager API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📌 Default logins: admin@test.com / 1234  |  user@test.com / 1234`);
});
