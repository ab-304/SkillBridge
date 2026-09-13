const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    gradYear: { type: String, default: '' },
    semester: { type: String, default: '' },
    skills: [{ type: String }],
    bio: { type: String, default: '' },
    resume: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    photo: { type: String, default: '' },
    preferredLocation: { type: String, default: '' },
    preferredMode: { type: String, default: 'Remote' },
    experience: { type: String, default: '' },
    education: { type: String, default: '' },
    certifications: [{ type: String }],
    savedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
