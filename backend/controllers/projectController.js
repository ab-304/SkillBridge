const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const Project = require('../models/Project');

// Get all projects with search & filtering
exports.getAllProjects = async (req, res) => {
  try {
    const { search, category, mode, skill, minStipend, sort } = req.query;

    if (getIsConnected()) {
      let query = { status: 'Active' };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (mode && mode !== 'All') {
        query.mode = mode;
      }

      if (skill && skill !== 'All') {
        query.skills = { $in: [new RegExp(skill, 'i')] };
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'highestStipend') sortOption = { numericStipend: -1 };
      if (sort === 'deadline') sortOption = { deadline: 1 };
      if (sort === 'popular') sortOption = { applicantsCount: -1 };

      const projects = await Project.find(query).sort(sortOption);
      return res.json({ success: true, count: projects.length, projects });
    } else {
      await memoryStore.initSeed();
      let list = [...memoryStore.projects].filter((p) => p.status === 'Active');

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.title.toLowerCase().includes(s) ||
            p.companyName.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.skills.some((sk) => sk.toLowerCase().includes(s))
        );
      }

      if (category && category !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (mode && mode !== 'All') {
        list = list.filter((p) => p.mode.toLowerCase() === mode.toLowerCase());
      }

      if (skill && skill !== 'All') {
        list = list.filter((p) => p.skills.some((sk) => sk.toLowerCase().includes(skill.toLowerCase())));
      }

      if (minStipend) {
        list = list.filter((p) => (p.numericStipend || 0) >= parseInt(minStipend));
      }

      if (sort === 'highestStipend') {
        list.sort((a, b) => (b.numericStipend || 0) - (a.numericStipend || 0));
      } else if (sort === 'deadline') {
        list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      } else if (sort === 'popular') {
        list.sort((a, b) => b.applicantsCount - a.applicantsCount);
      } else {
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return res.json({ success: true, count: list.length, projects: list });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured projects
exports.getFeaturedProjects = async (req, res) => {
  try {
    if (getIsConnected()) {
      const projects = await Project.find({ featured: true, status: 'Active' }).limit(6);
      return res.json({ success: true, projects });
    } else {
      await memoryStore.initSeed();
      const projects = memoryStore.projects.filter((p) => p.featured && p.status === 'Active').slice(0, 6);
      return res.json({ success: true, projects });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project details
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const project = await Project.findById(id);
      if (!project) return res.status(404).json({ success: false, message: 'Opportunity not found' });
      return res.json({ success: true, project });
    } else {
      await memoryStore.initSeed();
      const project = memoryStore.projects.find((p) => p._id.toString() === id.toString());
      if (!project) return res.status(404).json({ success: false, message: 'Opportunity not found' });
      return res.json({ success: true, project });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create new project (Company only)
exports.createProject = async (req, res) => {
  try {
    const companyId = req.user.id;
    const {
      title,
      description,
      category,
      skills,
      stipend,
      mode,
      location,
      duration,
      deadline,
      openings,
      experienceLevel,
      responsibilities,
      requirements,
      companyName,
    } = req.body;

    if (!title || !description || !stipend) {
      return res.status(400).json({ success: false, message: 'Title, description, and stipend are required' });
    }

    const numericStipend = parseInt(stipend.replace(/[^0-9]/g, '')) || 1000;
    const skillsArr = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim())
      : [];

    if (getIsConnected()) {
      const project = await Project.create({
        companyId,
        companyName: companyName || req.user.name || 'Company Recruiter',
        companyLogo: '🏢',
        title,
        description,
        category: category || 'Internship',
        skills: skillsArr,
        stipend,
        numericStipend,
        mode: mode || 'Remote',
        location: location || 'Remote',
        duration: duration || '3 Months',
        deadline: deadline || '2026-12-31',
        openings: openings || 1,
        experienceLevel: experienceLevel || 'Beginner',
        responsibilities: responsibilities || [description],
        requirements: requirements || ['Relevant skill proficiency'],
        status: 'Active',
      });
      return res.status(201).json({ success: true, project });
    } else {
      await memoryStore.initSeed();
      const newId = '65' + Date.now().toString().padStart(22, '0').slice(-22);
      const project = {
        _id: newId,
        companyId,
        companyName: companyName || req.user.name || 'Tech Company',
        companyLogo: '🏢',
        title,
        description,
        category: category || 'Internship',
        skills: skillsArr.length ? skillsArr : ['JavaScript', 'React'],
        stipend,
        numericStipend,
        mode: mode || 'Remote',
        location: location || 'Remote',
        duration: duration || '3 Months',
        deadline: deadline || '2026-12-31',
        openings: openings || 1,
        experienceLevel: experienceLevel || 'Beginner',
        responsibilities: responsibilities || [description],
        requirements: requirements || ['Hands-on interest and technical skill'],
        status: 'Active',
        applicantsCount: 0,
        featured: false,
        createdAt: new Date(),
      };
      memoryStore.projects.unshift(project);
      return res.status(201).json({ success: true, project });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const project = await Project.findById(id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      if (project.companyId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      Object.assign(project, req.body);
      await project.save();
      return res.json({ success: true, project });
    } else {
      await memoryStore.initSeed();
      const project = memoryStore.projects.find((p) => p._id.toString() === id.toString());
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      Object.assign(project, req.body);
      return res.json({ success: true, project });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const project = await Project.findById(id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      await Project.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Project deleted successfully' });
    } else {
      await memoryStore.initSeed();
      const index = memoryStore.projects.findIndex((p) => p._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ success: false, message: 'Project not found' });

      memoryStore.projects.splice(index, 1);
      return res.json({ success: true, message: 'Project deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
