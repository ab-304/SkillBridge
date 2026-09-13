const express = require('express');
const router = express.Router();
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const User = require('../models/User');
const Project = require('../models/Project');
const Application = require('../models/Application');
const CompanyProfile = require('../models/CompanyProfile');

// Get public platform statistics
router.get('/stats', async (req, res) => {
  try {
    if (getIsConnected()) {
      const [studentsCount, companiesCount, projectsCount, applicationsCount] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'company' }),
        Project.countDocuments({ status: 'Active' }),
        Application.countDocuments(),
      ]);

      return res.json({
        success: true,
        stats: {
          studentsCount,
          companiesCount,
          projectsCount,
          applicationsCount,
        },
      });
    } else {
      await memoryStore.initSeed();
      const studentsCount = memoryStore.users.filter((u) => u.role === 'student').length;
      const companiesCount = memoryStore.users.filter((u) => u.role === 'company').length;
      const projectsCount = memoryStore.projects.filter((p) => p.status === 'Active').length;
      const applicationsCount = memoryStore.applications.length;

      return res.json({
        success: true,
        stats: {
          studentsCount,
          companiesCount,
          projectsCount,
          applicationsCount,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get registered public company profiles
router.get('/companies', async (req, res) => {
  try {
    if (getIsConnected()) {
      const profiles = await CompanyProfile.find().limit(20);
      const companyUsers = await User.find({ role: 'company' }).select('-password');

      // Map combined list
      const companies = companyUsers.map((user) => {
        const prof = profiles.find((p) => p.userId.toString() === user._id.toString());
        return {
          _id: user._id,
          name: prof?.companyName || user.name,
          logo: prof?.logo || '🏢',
          industry: prof?.industry || 'Technology & Innovation',
          website: prof?.website || '',
          location: prof?.location || 'Remote',
        };
      });

      return res.json({ success: true, companies });
    } else {
      await memoryStore.initSeed();
      const companies = memoryStore.users
        .filter((u) => u.role === 'company')
        .map((u) => {
          const prof = memoryStore.companyProfiles.find((p) => p.userId.toString() === u._id.toString());
          return {
            _id: u._id,
            name: prof?.companyName || u.name,
            logo: prof?.logo || '🏢',
            industry: prof?.industry || 'Technology',
            website: prof?.website || '',
            location: prof?.location || 'Remote',
          };
        });

      return res.json({ success: true, companies });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
