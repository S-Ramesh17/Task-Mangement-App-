// controllers/taskController.js - Task operations with role-based access

const Task = require('../models/Task');
const User = require('../models/User');

// GET /api/tasks - Students see their tasks, Admins see all
const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      tasks = await Task.find()
        .populate('assignedTo', 'email role')
        .populate('createdBy', 'email')
        .sort({ createdAt: -1 });
    } else {
      // Student only sees tasks assigned to them
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate('createdBy', 'email')
        .sort({ createdAt: -1 });
    }

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/tasks - Admin only creates tasks
const createTask = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create tasks' });
  }

  const { title, description, assignedTo, deadline } = req.body;

  if (!title || !assignedTo) {
    return res.status(400).json({ message: 'Title and assignedTo are required' });
  }

  try {
    // Verify assigned user exists and is a student
    const targetUser = await User.findById(assignedTo);
    if (!targetUser) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: 'pending',
      deadline: deadline || null,
      assignedTo,
      createdBy: req.user.id
    });

    const populated = await task.populate([
      { path: 'assignedTo', select: 'email role' },
      { path: 'createdBy', select: 'email' }
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/tasks/:id - Admin only
const deleteTask = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can delete tasks' });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTasks, createTask, deleteTask };
