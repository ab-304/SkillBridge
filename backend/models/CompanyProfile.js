const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: { type: String, required: true },
    industry: { type: String, default: '' },
    website: { type: String, default: '' },
    logo: { type: String, default: '' },
    about: { type: String, default: '' },
    location: { type: String, default: '' },
    employees: { type: String, default: '1-10' },
    companySize: { type: String, default: '1-10' },
    hrEmail: { type: String, default: '' },
    phone: { type: String, default: '' },
    foundedYear: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
