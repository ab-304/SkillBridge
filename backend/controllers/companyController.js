const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const Project = require('../models/Project');
const Application = require('../models/Application');
const CompanyProfile = require('../models/CompanyProfile');

// Get company posted projects
exports.getCompanyProjects = async (req, res) => {
  try {
    const companyId = req.user.id;

    if (getIsConnected()) {
      const projects = await Project.find({ companyId }).sort({ createdAt: -1 });
      return res.json({ success: true, projects });
    } else {
      await memoryStore.initSeed();
      const projects = memoryStore.projects.filter((p) => p.companyId.toString() === companyId.toString());
      return res.json({ success: true, projects });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get applicants for company projects
exports.getApplicants = async (req, res) => {
  try {
    const companyId = req.user.id;
    const { projectId } = req.query;

    if (getIsConnected()) {
      let filter = { companyId };
      if (projectId) filter.projectId = projectId;

      const applications = await Application.find(filter).populate('projectId').sort({ createdAt: -1 });
      return res.json({ success: true, applications });
    } else {
      await memoryStore.initSeed();
      let apps = memoryStore.applications.filter((a) => a.companyId.toString() === companyId.toString());
      if (projectId) {
        apps = apps.filter((a) => a.projectId.toString() === projectId.toString());
      }

      const populatedApps = apps.map((a) => {
        const pr = memoryStore.projects.find((p) => p._id.toString() === a.projectId.toString());
        return { ...a, projectId: pr || { title: 'Opportunity' } };
      });

      return res.json({ success: true, applications: populatedApps });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const { createNotificationHelper } = require('./notificationController');

// Update applicant status (Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected)
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, joiningDetails } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Pending', 'Accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (getIsConnected()) {
      const application = await Application.findById(applicationId).populate('projectId');
      if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

      if (application.companyId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized action' });
      }

      application.status = status;
      if (joiningDetails) {
        application.joiningDetails = {
          ...application.joiningDetails,
          ...joiningDetails,
        };
      }
      await application.save();

      // Trigger notification to student
      const projectTitle = application.projectId?.title || 'Opportunity';
      let notifTitle = `Application Status Update: ${status}`;
      let notifMsg = `Your application status for "${projectTitle}" has been updated to "${status}".`;
      let notifType = 'status_update';

      if (status === 'Selected') {
        notifTitle = `🎉 Congratulations! You are Selected for ${projectTitle}`;
        notifMsg = `You have been selected! Check your Student Dashboard for joining schedule and HR contact details.`;
        notifType = 'joining';
      }

      await createNotificationHelper({
        userId: application.studentId,
        title: notifTitle,
        message: notifMsg,
        type: notifType,
        link: '/student/dashboard?tab=applications',
      });

      return res.json({ success: true, application });
    } else {
      await memoryStore.initSeed();
      const application = memoryStore.applications.find((a) => a._id.toString() === applicationId.toString());
      if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

      application.status = status;
      if (joiningDetails) {
        application.joiningDetails = {
          ...(application.joiningDetails || {}),
          ...joiningDetails,
        };
      }

      const project = memoryStore.projects.find((p) => p._id.toString() === application.projectId?.toString()) || { title: 'Opportunity' };
      const projectTitle = project.title;

      let notifTitle = `Application Status Update: ${status}`;
      let notifMsg = `Your application status for "${projectTitle}" has been updated to "${status}".`;
      let notifType = 'status_update';

      if (status === 'Selected') {
        notifTitle = `🎉 Congratulations! You are Selected for ${projectTitle}`;
        notifMsg = `You have been selected! Check your Student Dashboard for joining schedule and HR contact details.`;
        notifType = 'joining';
      }

      await createNotificationHelper({
        userId: application.studentId,
        title: notifTitle,
        message: notifMsg,
        type: notifType,
        link: '/student/dashboard?tab=applications',
      });

      return res.json({ success: true, application });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Company Profile
exports.getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (getIsConnected()) {
      let profile = await CompanyProfile.findOne({ userId });
      if (!profile) {
        profile = await CompanyProfile.create({ userId, companyName: req.user.name });
      }
      return res.json({ success: true, profile });
    } else {
      await memoryStore.initSeed();
      let profile = memoryStore.companyProfiles.find((p) => p.userId.toString() === userId.toString());
      if (!profile) {
        profile = {
          _id: 'cprof_' + Date.now(),
          userId,
          companyName: req.user.name || 'Startup Inc.',
          industry: 'Software',
          website: 'https://example.com',
          logo: '🏢',
          about: 'Leading technology team.',
        };
        memoryStore.companyProfiles.push(profile);
      }
      return res.json({ success: true, profile });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Company Profile
exports.updateCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      companyName,
      industry,
      website,
      logo,
      about,
      location,
      employees,
      companySize,
      hrEmail,
      phone,
      foundedYear,
      linkedin,
      github,
    } = req.body;

    if (getIsConnected()) {
      let profile = await CompanyProfile.findOne({ userId });
      if (!profile) profile = new CompanyProfile({ userId, companyName: companyName || req.user.name });

      if (companyName) profile.companyName = companyName;
      if (industry !== undefined) profile.industry = industry;
      if (website !== undefined) profile.website = website;
      if (logo !== undefined) profile.logo = logo;
      if (about !== undefined) profile.about = about;
      if (location !== undefined) profile.location = location;
      if (employees !== undefined) profile.employees = employees;
      if (companySize !== undefined) profile.companySize = companySize;
      if (hrEmail !== undefined) profile.hrEmail = hrEmail;
      if (phone !== undefined) profile.phone = phone;
      if (foundedYear !== undefined) profile.foundedYear = foundedYear;
      if (linkedin !== undefined) profile.linkedin = linkedin;
      if (github !== undefined) profile.github = github;

      await profile.save();
      return res.json({ success: true, profile });
    } else {
      await memoryStore.initSeed();
      let profile = memoryStore.companyProfiles.find((p) => p.userId.toString() === userId.toString());
      if (!profile) {
        profile = { _id: 'cprof_' + Date.now(), userId, companyName: companyName || 'Company' };
        memoryStore.companyProfiles.push(profile);
      }

      if (companyName) profile.companyName = companyName;
      if (industry !== undefined) profile.industry = industry;
      if (website !== undefined) profile.website = website;
      if (logo !== undefined) profile.logo = logo;
      if (about !== undefined) profile.about = about;
      if (location !== undefined) profile.location = location;
      if (employees !== undefined) profile.employees = employees;
      if (companySize !== undefined) profile.companySize = companySize;
      if (hrEmail !== undefined) profile.hrEmail = hrEmail;
      if (phone !== undefined) profile.phone = phone;
      if (foundedYear !== undefined) profile.foundedYear = foundedYear;
      if (linkedin !== undefined) profile.linkedin = linkedin;
      if (github !== undefined) profile.github = github;

      return res.json({ success: true, profile });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

