const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');

const generateToken = (id, role, email, name) => {
  return jwt.sign(
    { id, role, email, name },
    process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_production_ready',
    { expiresIn: '30d' }
  );
};

// Register Student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, college, degree, gradYear } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (getIsConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'student',
      });

      const profile = await StudentProfile.create({
        userId: user._id,
        college: college || '',
        degree: degree || '',
        gradYear: gradYear || '',
        skills: [],
      });

      const token = generateToken(user._id, user.role, user.email, user.name);
      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile },
      });
    } else {
      await memoryStore.initSeed();
      const existingUser = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newId = '65' + Date.now().toString().padStart(22, '0').slice(-22);
      const user = {
        _id: newId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'student',
        createdAt: new Date(),
      };
      memoryStore.users.push(user);

      const profile = {
        _id: 'sprof_' + Date.now(),
        userId: user._id,
        college: college || '',
        degree: degree || '',
        gradYear: gradYear || '',
        skills: ['JavaScript', 'React'],
        savedProjects: [],
      };
      memoryStore.studentProfiles.push(profile);

      const token = generateToken(user._id, user.role, user.email, user.name);
      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Register Company
exports.registerCompany = async (req, res) => {
  try {
    const { companyName, email, password, industry, website } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide company name, email, and password' });
    }

    if (getIsConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: companyName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'company',
      });

      const profile = await CompanyProfile.create({
        userId: user._id,
        companyName,
        industry: industry || '',
        website: website || '',
      });

      const token = generateToken(user._id, user.role, user.email, user.name);
      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile },
      });
    } else {
      await memoryStore.initSeed();
      const existingUser = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newId = '65' + Date.now().toString().padStart(22, '0').slice(-22);
      const user = {
        _id: newId,
        name: companyName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'company',
        createdAt: new Date(),
      };
      memoryStore.users.push(user);

      const profile = {
        _id: 'cprof_' + Date.now(),
        userId: user._id,
        companyName,
        industry: industry || 'Tech',
        website: website || 'https://example.com',
        logo: '🏢',
        about: 'Innovative tech startup.',
      };
      memoryStore.companyProfiles.push(profile);

      const token = generateToken(user._id, user.role, user.email, user.name);
      return res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (getIsConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect password.' });
      }

      let profile = null;
      if (user.role === 'student') {
        profile = await StudentProfile.findOne({ userId: user._id });
      } else if (user.role === 'company') {
        profile = await CompanyProfile.findOne({ userId: user._id });
      }

      const token = generateToken(user._id, user.role, user.email, user.name);
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile },
      });
    } else {
      await memoryStore.initSeed();
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect password.' });
      }

      let profile = null;
      if (user.role === 'student') {
        profile = memoryStore.studentProfiles.find((p) => p.userId.toString() === user._id.toString());
      } else if (user.role === 'company') {
        profile = memoryStore.companyProfiles.find((p) => p.userId.toString() === user._id.toString());
      }

      const token = generateToken(user._id, user.role, user.email, user.name);
      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    if (getIsConnected()) {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      let profile = null;
      if (user.role === 'student') {
        profile = await StudentProfile.findOne({ userId: user._id });
      } else if (user.role === 'company') {
        profile = await CompanyProfile.findOne({ userId: user._id });
      }

      return res.json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile },
      });
    } else {
      await memoryStore.initSeed();
      const user = memoryStore.users.find((u) => u._id.toString() === userId.toString());
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      let profile = null;
      if (user.role === 'student') {
        profile = memoryStore.studentProfiles.find((p) => p.userId.toString() === user._id.toString());
      } else if (user.role === 'company') {
        profile = memoryStore.companyProfiles.find((p) => p.userId.toString() === user._id.toString());
      }

      return res.json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, profile },
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    if (getIsConnected()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return res.json({ success: true, message: 'Password updated successfully' });
    } else {
      await memoryStore.initSeed();
      const user = memoryStore.users.find((u) => u._id.toString() === userId.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      return res.json({ success: true, message: 'Password updated successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Preferences / Notification Settings
exports.updatePreferences = async (req, res) => {
  try {
    const preferences = req.body;
    return res.json({ success: true, message: 'Notification preferences saved successfully', preferences });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    if (getIsConnected()) {
      await User.findByIdAndDelete(userId);
      await StudentProfile.deleteMany({ userId });
      await CompanyProfile.deleteMany({ userId });
      return res.json({ success: true, message: 'Account deleted successfully' });
    } else {
      await memoryStore.initSeed();
      memoryStore.users = memoryStore.users.filter((u) => u._id.toString() !== userId.toString());
      memoryStore.studentProfiles = memoryStore.studentProfiles.filter((p) => p.userId.toString() !== userId.toString());
      memoryStore.companyProfiles = memoryStore.companyProfiles.filter((p) => p.userId.toString() !== userId.toString());
      return res.json({ success: true, message: 'Account deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const { sendOtpEmail } = require('../config/emailService');

// Request OTP for Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    if (getIsConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      user.resetPasswordOtp = otp;
      user.resetPasswordExpires = expires;
      await user.save();

      await sendOtpEmail(cleanEmail, otp);

      return res.json({
        success: true,
        message: 'A 6-digit OTP code has been sent to your email address.',
        devOtp: otp,
      });
    } else {
      await memoryStore.initSeed();
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      user.resetPasswordOtp = otp;
      user.resetPasswordExpires = expires;

      await sendOtpEmail(cleanEmail, otp);

      return res.json({
        success: true,
        message: 'A 6-digit OTP code has been sent to your email address.',
        devOtp: otp,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify 6-digit OTP Code
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and 6-digit OTP' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (getIsConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      if (!user.resetPasswordOtp || user.resetPasswordOtp !== cleanOtp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
      }

      if (new Date() > new Date(user.resetPasswordExpires)) {
        return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });
      }

      return res.json({ success: true, message: 'OTP verified successfully.' });
    } else {
      await memoryStore.initSeed();
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      if (!user.resetPasswordOtp || user.resetPasswordOtp !== cleanOtp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
      }

      if (new Date() > new Date(user.resetPasswordExpires)) {
        return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });
      }

      return res.json({ success: true, message: 'OTP verified successfully.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Reset Password with Verified OTP
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (getIsConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      if (!user.resetPasswordOtp || user.resetPasswordOtp !== cleanOtp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
      }

      if (new Date() > new Date(user.resetPasswordExpires)) {
        return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetPasswordOtp = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.json({ success: true, message: 'Password updated successfully. Please log in.' });
    } else {
      await memoryStore.initSeed();
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: 'No account found with this email.' });
      }

      if (!user.resetPasswordOtp || user.resetPasswordOtp !== cleanOtp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
      }

      if (new Date() > new Date(user.resetPasswordExpires)) {
        return res.status(400).json({ success: false, message: 'OTP expired. Request a new one.' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetPasswordOtp = null;
      user.resetPasswordExpires = null;

      return res.json({ success: true, message: 'Password updated successfully. Please log in.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


