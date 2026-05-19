// routes/tasks.js - Task routes

const express = require('express');
const router = express.Router();
const { getTasks, createTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All task routes require authentication
router.use(protect);

router.get('/', getTasks);          // GET all tasks (filtered by role)
router.post('/', createTask);       // POST create task (admin only — enforced in controller)
router.delete('/:id', deleteTask);  // DELETE task (admin only — enforced in controller)

module.exports = router;
