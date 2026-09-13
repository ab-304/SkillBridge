const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleSaveProject,
  applyToProject,
  getStudentApplications,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/save-project', toggleSaveProject);
router.post('/apply', applyToProject);
router.get('/applications', getStudentApplications);

module.exports = router;
