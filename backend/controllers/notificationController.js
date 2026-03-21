const Notification = require('../models/Notification');

/**
 * Get all notifications for the authenticated user.
 */
const getNotifications = async (req, res) => {
  try {
    const { read, limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { user_id: req.userId };
    if (read !== undefined) query.read = read === 'true';

    const notifications = await Notification.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user_id: req.userId, read: false });

    res.status(200).json({
      notifications,
      unread_count: unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Mark a notification as read.
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found!" });

    if (notification.user_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Mark all notifications as read for the authenticated user.
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "All notifications marked as read." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
