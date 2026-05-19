// models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true,
    default: ''
  },

  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },

  deadline: {
    type: Date,
    default: null
  },

  // ✅ MULTIPLE STUDENTS SUPPORT
  assignedTo: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],

  // ✅ ADMIN WHO CREATED TASK
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);