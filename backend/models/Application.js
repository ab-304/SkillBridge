const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    college: { type: String, default: '' },
    skills: [{ type: String }],
    resume: { type: String, default: '' },
    coverLetter: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Pending', 'Accepted'],
      default: 'Applied',
    },
    joiningDetails: {
      joiningDate: { type: String, default: '' },
      joiningTime: { type: String, default: '' },
      reportingAddress: { type: String, default: '' },
      workMode: { type: String, default: '' },
      hrName: { type: String, default: '' },
      hrEmail: { type: String, default: '' },
      hrPhone: { type: String, default: '' },
      welcomeMessage: { type: String, default: '' },
    },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
