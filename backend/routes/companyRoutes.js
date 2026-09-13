const express = require('express');
const router = express.Router();
const {
  getCompanyProjects,
  getApplicants,
  updateApplicantStatus,
  getCompanyProfile,
  updateCompanyProfile,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('company'));

router.get('/projects', getCompanyProjects);
router.get('/applicants', getApplicants);
router.put('/applicants/:applicationId/status', updateApplicantStatus);
router.get('/profile', getCompanyProfile);
router.put('/profile', updateCompanyProfile);

module.exports = router;
