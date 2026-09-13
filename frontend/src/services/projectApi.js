import API from './api';

export const projectApi = {
  // Fetch all projects with optional query params (search, category, mode, sort, etc.)
  getAllProjects: async (params = {}) => {
    const { data } = await API.get('/projects', { params });
    return data;
  },

  // Fetch featured projects for Landing / Home page
  getFeaturedProjects: async () => {
    const { data } = await API.get('/projects/featured');
    return data;
  },

  // Fetch single project details by ID
  getProjectById: async (id) => {
    const { data } = await API.get(`/projects/${id}`);
    return data;
  },

  // Publish a new project (Company / Admin)
  createProject: async (projectData) => {
    const { data } = await API.post('/projects', projectData);
    return data;
  },

  // Update existing project
  updateProject: async (id, projectData) => {
    const { data } = await API.put(`/projects/${id}`, projectData);
    return data;
  },

  // Delete project
  deleteProject: async (id) => {
    const { data } = await API.delete(`/projects/${id}`);
    return data;
  },

  // Apply to project (Student)
  applyToProject: async (id, applicationData) => {
    const { data } = await API.post(`/student/apply/${id}`, applicationData);
    return data;
  },
};

export default projectApi;
