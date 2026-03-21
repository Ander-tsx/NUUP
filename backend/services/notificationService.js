const Notification = require('../models/Notification');

/**
 * Creates a notification for a user.
 * @param {string} userId - The user to notify
 * @param {string} type - 'event' | 'project' | 'payment' | 'dispute' | 'system'
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {string|null} referenceId - Optional ID of related entity
 */
async function createNotification(userId, type, title, body, referenceId = null) {
  try {
    const notification = new Notification({
      user_id: userId,
      type,
      title,
      body,
      reference_id: referenceId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error.message);
    // Non-blocking: don't throw, just log
    return null;
  }
}

/**
 * Creates notifications for multiple users at once.
 */
async function createBulkNotifications(userIds, type, title, body, referenceId = null) {
  const promises = userIds.map(userId => createNotification(userId, type, title, body, referenceId));
  return Promise.allSettled(promises);
}

module.exports = { createNotification, createBulkNotifications };
