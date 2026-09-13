const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const User = require('../models/User');
const Project = require('../models/Project');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');

// Get overall platform metrics
exports.getStats = async (req, res) => {
  try {
    if (getIsConnected()) {
      const studentsCount = await User.countDocuments({ role: 'student' });
      const companiesCount = await User.countDocuments({ role: 'company' });
      const projectsCount = await Project.countDocuments();
      const applicationsCount = await Application.countDocuments();

      return res.json({
        success: true,
        metrics: {
          students: studentsCount,
          companies: companiesCount,
          projects: projectsCount,
          applications: applicationsCount,
        },
      });
    } else {
      await memoryStore.initSeed();
      const studentsCount = memoryStore.users.filter((u) => u.role === 'student').length;
      const companiesCount = memoryStore.users.filter((u) => u.role === 'company').length;
      const projectsCount = memoryStore.projects.length;
      const applicationsCount = memoryStore.applications.length;

      return res.json({
        success: true,
        metrics: {
          students: studentsCount,
          companies: companiesCount,
          projects: projectsCount,
          applications: applicationsCount,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get user list
exports.getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (role && role !== 'All') query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const users = await User.find(query).select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, users });
    } else {
      await memoryStore.initSeed();
      let list = [...memoryStore.users];

      if (role && role !== 'All') {
        list = list.filter((u) => u.role === role);
      }

      if (search) {
        const s = search.toLowerCase();
        list = list.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
      }

      const safeUsers = list.map(({ password, ...rest }) => rest);
      return res.json({ success: true, count: safeUsers.length, users: safeUsers });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user account
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot delete primary admin account' });
      }

      await User.findByIdAndDelete(id);
      await StudentProfile.deleteMany({ userId: id });
      await CompanyProfile.deleteMany({ userId: id });

      return res.json({ success: true, message: 'User account deleted successfully' });
    } else {
      await memoryStore.initSeed();
      const index = memoryStore.users.findIndex((u) => u._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });

      if (memoryStore.users[index].role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot delete primary admin account' });
      }

      memoryStore.users.splice(index, 1);
      return res.json({ success: true, message: 'User account deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get system analytics data for charts
exports.getAnalytics = async (req, res) => {
  try {
    // Generate analytics breakdown for Recharts
    const registrationData = [
      { month: 'May', students: 45, companies: 12 },
      { month: 'Jun', students: 82, companies: 24 },
      { month: 'Jul', students: 140, companies: 38 },
      { month: 'Aug', students: 210, companies: 55 },
      { month: 'Sep', students: 340, companies: 85 },
    ];

    const applicationStatusData = [
      { name: 'Pending', value: 45 },
      { name: 'Shortlisted', value: 28 },
      { name: 'Accepted', value: 18 },
      { name: 'Rejected', value: 12 },
    ];

    const topSkillsDemand = [
      { skill: 'React', count: 120 },
      { skill: 'Node.js', count: 95 },
      { skill: 'Python', count: 88 },
      { skill: 'Tailwind CSS', count: 75 },
      { skill: 'Figma', count: 50 },
    ];

    return res.json({
      success: true,
      analytics: {
        registrations: registrationData,
        applicationStatus: applicationStatusData,
        topSkills: topSkillsDemand,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
