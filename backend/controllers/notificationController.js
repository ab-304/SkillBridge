const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const Notification = require('../models/Notification');

// Helper function to create notification
exports.createNotificationHelper = async ({ userId, title, message, type = 'info', link = '' }) => {
  try {
    if (getIsConnected()) {
      await Notification.create({ userId, title, message, type, link });
    } else {
      await memoryStore.initSeed();
      if (!memoryStore.notifications) memoryStore.notifications = [];
      memoryStore.notifications.unshift({
        _id: 'notif_' + Date.now() + Math.random().toString(36).substr(2, 4),
        userId: userId.toString(),
        title,
        message,
        type,
        read: false,
        link,
        createdAt: new Date(),
      });
    }
  } catch (err) {
    console.error('Failed to create notification helper:', err);
  }
};

// Get current user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    if (getIsConnected()) {
      const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
      const unreadCount = await Notification.countDocuments({ userId, read: false });
      return res.json({ success: true, unreadCount, notifications });
    } else {
      await memoryStore.initSeed();
      if (!memoryStore.notifications) memoryStore.notifications = [];
      const userNotifs = memoryStore.notifications.filter((n) => n.userId.toString() === userId.toString());
      const unreadCount = userNotifs.filter((n) => !n.read).length;
      return res.json({ success: true, unreadCount, notifications: userNotifs.slice(0, 30) });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (getIsConnected()) {
      const notification = await Notification.findOne({ _id: id, userId });
      if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
      notification.read = true;
      await notification.save();
      return res.json({ success: true, notification });
    } else {
      await memoryStore.initSeed();
      if (!memoryStore.notifications) memoryStore.notifications = [];
      const notif = memoryStore.notifications.find(
        (n) => n._id.toString() === id.toString() && n.userId.toString() === userId.toString()
      );
      if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });
      notif.read = true;
      return res.json({ success: true, notification: notif });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    if (getIsConnected()) {
      await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
      return res.json({ success: true, message: 'All notifications marked as read' });
    } else {
      await memoryStore.initSeed();
      if (!memoryStore.notifications) memoryStore.notifications = [];
      memoryStore.notifications.forEach((n) => {
        if (n.userId.toString() === userId.toString()) n.read = true;
      });
      return res.json({ success: true, message: 'All notifications marked as read' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
