const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProjectById);

router.post('/', protect, authorize('company', 'admin'), createProject);
router.put('/:id', protect, authorize('company', 'admin'), updateProject);
router.delete('/:id', protect, authorize('company', 'admin'), deleteProject);

module.exports = router;
