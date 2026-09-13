const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser, getAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

module.exports = router;
