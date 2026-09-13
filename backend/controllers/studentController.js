const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const Project = require('../models/Project');

// Get Student Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (getIsConnected()) {
      let profile = await StudentProfile.findOne({ userId }).populate('savedProjects');
      if (!profile) {
        profile = await StudentProfile.create({ userId, college: '', degree: '', skills: [] });
      }
      return res.json({ success: true, profile });
    } else {
      await memoryStore.initSeed();
      let profile = memoryStore.studentProfiles.find((p) => p.userId.toString() === userId.toString());
      if (!profile) {
        profile = {
          _id: 'sprof_' + Date.now(),
          userId,
          college: 'University Tech',
          degree: 'B.S. Computer Science',
          gradYear: '2026',
          skills: ['JavaScript', 'React'],
          savedProjects: [],
        };
        memoryStore.studentProfiles.push(profile);
      }

      // Map savedProjects IDs to full project objects
      const savedFull = (profile.savedProjects || [])
        .map((pid) => memoryStore.projects.find((pr) => pr._id.toString() === pid.toString()))
        .filter(Boolean);

      return res.json({ success: true, profile: { ...profile, savedProjects: savedFull } });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Student Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      college,
      degree,
      gradYear,
      semester,
      skills,
      bio,
      resume,
      github,
      linkedin,
      portfolio,
      photo,
      preferredLocation,
      preferredMode,
      experience,
      education,
    } = req.body;

    const skillsArr = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim())
      : undefined;

    if (getIsConnected()) {
      const User = require('../models/User');
      if (name) {
        await User.findByIdAndUpdate(userId, { name });
      }

      let profile = await StudentProfile.findOne({ userId });
      if (!profile) {
        profile = new StudentProfile({ userId });
      }

      if (college !== undefined) profile.college = college;
      if (degree !== undefined) profile.degree = degree;
      if (gradYear !== undefined) profile.gradYear = gradYear;
      if (semester !== undefined) profile.semester = semester;
      if (skillsArr !== undefined) profile.skills = skillsArr;
      if (bio !== undefined) profile.bio = bio;
      if (resume !== undefined) profile.resume = resume;
      if (github !== undefined) profile.github = github;
      if (linkedin !== undefined) profile.linkedin = linkedin;
      if (portfolio !== undefined) profile.portfolio = portfolio;
      if (photo !== undefined) profile.photo = photo;
      if (preferredLocation !== undefined) profile.preferredLocation = preferredLocation;
      if (preferredMode !== undefined) profile.preferredMode = preferredMode;
      if (experience !== undefined) profile.experience = experience;
      if (education !== undefined) profile.education = education;

      await profile.save();
      return res.json({ success: true, profile });
    } else {
      await memoryStore.initSeed();
      let userObj = memoryStore.users.find((u) => u._id.toString() === userId.toString());
      if (userObj && name) {
        userObj.name = name;
      }

      let profile = memoryStore.studentProfiles.find((p) => p.userId.toString() === userId.toString());
      if (!profile) {
        profile = { _id: 'sprof_' + Date.now(), userId, savedProjects: [] };
        memoryStore.studentProfiles.push(profile);
      }

      if (college !== undefined) profile.college = college;
      if (degree !== undefined) profile.degree = degree;
      if (gradYear !== undefined) profile.gradYear = gradYear;
      if (semester !== undefined) profile.semester = semester;
      if (skillsArr !== undefined) profile.skills = skillsArr;
      if (bio !== undefined) profile.bio = bio;
      if (resume !== undefined) profile.resume = resume;
      if (github !== undefined) profile.github = github;
      if (linkedin !== undefined) profile.linkedin = linkedin;
      if (portfolio !== undefined) profile.portfolio = portfolio;
      if (photo !== undefined) profile.photo = photo;
      if (preferredLocation !== undefined) profile.preferredLocation = preferredLocation;
      if (preferredMode !== undefined) profile.preferredMode = preferredMode;
      if (experience !== undefined) profile.experience = experience;

      return res.json({ success: true, profile });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Bookmark / Save Project
exports.toggleSaveProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.body;

    if (!projectId) return res.status(400).json({ success: false, message: 'projectId is required' });

    if (getIsConnected()) {
      let profile = await StudentProfile.findOne({ userId });
      if (!profile) profile = await StudentProfile.create({ userId });

      const exists = profile.savedProjects.some((id) => id.toString() === projectId.toString());
      if (exists) {
        profile.savedProjects = profile.savedProjects.filter((id) => id.toString() !== projectId.toString());
      } else {
        profile.savedProjects.push(projectId);
      }
      await profile.save();
      return res.json({ success: true, isSaved: !exists, savedProjects: profile.savedProjects });
    } else {
      await memoryStore.initSeed();
      let profile = memoryStore.studentProfiles.find((p) => p.userId.toString() === userId.toString());
      if (!profile) {
        profile = { _id: 'sprof_' + Date.now(), userId, savedProjects: [] };
        memoryStore.studentProfiles.push(profile);
      }

      if (!profile.savedProjects) profile.savedProjects = [];
      const exists = profile.savedProjects.some((id) => id.toString() === projectId.toString());
      if (exists) {
        profile.savedProjects = profile.savedProjects.filter((id) => id.toString() !== projectId.toString());
      } else {
        profile.savedProjects.push(projectId);
      }
      return res.json({ success: true, isSaved: !exists, savedProjects: profile.savedProjects });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const { createNotificationHelper } = require('./notificationController');

// Apply to Project
exports.applyToProject = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { projectId, resume, coverLetter, portfolio } = req.body;

    if (!projectId) return res.status(400).json({ success: false, message: 'projectId is required' });

    if (getIsConnected()) {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ success: false, message: 'Opportunity not found' });

      const existingApp = await Application.findOne({ studentId, projectId });
      if (existingApp) {
        return res.status(400).json({ success: false, message: 'You have already applied for this opportunity' });
      }

      const profile = await StudentProfile.findOne({ userId: studentId });

      const application = await Application.create({
        studentId,
        projectId,
        companyId: project.companyId,
        studentName: req.user.name,
        studentEmail: req.user.email,
        college: profile ? profile.college : 'University',
        skills: profile ? profile.skills : [],
        resume: resume || (profile ? profile.resume : ''),
        coverLetter: coverLetter || '',
        portfolio: portfolio || (profile ? profile.portfolio : ''),
        status: 'Applied',
      });

      project.applicantsCount += 1;
      await project.save();

      // Trigger notification to company recruiter
      await createNotificationHelper({
        userId: project.companyId,
        title: 'New Candidate Application',
        message: `${req.user.name} applied for "${project.title}".`,
        type: 'info',
        link: '/company/dashboard?tab=applicants',
      });

      return res.status(201).json({ success: true, application });
    } else {
      await memoryStore.initSeed();
      const project = memoryStore.projects.find((p) => p._id.toString() === projectId.toString());
      if (!project) return res.status(404).json({ success: false, message: 'Opportunity not found' });

      const existingApp = memoryStore.applications.find(
        (a) => a.studentId.toString() === studentId.toString() && a.projectId.toString() === projectId.toString()
      );
      if (existingApp) {
        return res.status(400).json({ success: false, message: 'You have already applied for this opportunity' });
      }

      const profile = memoryStore.studentProfiles.find((p) => p.userId.toString() === studentId.toString());

      const newApp = {
        _id: 'app_' + Date.now(),
        studentId,
        projectId,
        companyId: project.companyId,
        studentName: req.user.name,
        studentEmail: req.user.email,
        college: profile ? profile.college : 'University',
        skills: profile ? profile.skills : ['React', 'Node.js'],
        resume: resume || (profile ? profile.resume : ''),
        coverLetter: coverLetter || 'I am highly interested in contributing to this role.',
        portfolio: portfolio || (profile ? profile.portfolio : ''),
        status: 'Applied',
        appliedDate: new Date(),
      };

      memoryStore.applications.unshift(newApp);
      project.applicantsCount += 1;

      // Trigger notification to company recruiter
      await createNotificationHelper({
        userId: project.companyId,
        title: 'New Candidate Application',
        message: `${req.user.name} applied for "${project.title}".`,
        type: 'info',
        link: '/company/dashboard?tab=applicants',
      });

      return res.status(201).json({ success: true, application: newApp });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Student Applications
exports.getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    if (getIsConnected()) {
      const applications = await Application.find({ studentId }).populate('projectId').sort({ createdAt: -1 });
      return res.json({ success: true, applications });
    } else {
      await memoryStore.initSeed();
      const apps = memoryStore.applications.filter((a) => a.studentId.toString() === studentId.toString());

      // Attach populated project details
      const populatedApps = apps.map((a) => {
        const pr = memoryStore.projects.find((p) => p._id.toString() === a.projectId.toString());
        return { ...a, projectId: pr || { title: 'Opportunity', companyName: 'Company' } };
      });

      return res.json({ success: true, applications: populatedApps });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
