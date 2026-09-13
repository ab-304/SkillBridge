const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Internship', 'Freelance', 'Hackathon', 'Apprenticeship', 'Full-time'],
      default: 'Internship',
    },
    skills: [{ type: String }],
    stipend: { type: String, required: true },
    numericStipend: { type: Number, default: 0 },
    mode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'Onsite'],
      default: 'Remote',
    },
    location: { type: String, default: 'Remote' },
    duration: { type: String, default: '3 Months' },
    deadline: { type: String, default: '2026-10-30' },
    openings: { type: Number, default: 1 },
    experienceLevel: { type: String, default: 'Beginner' },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
    applicantsCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
