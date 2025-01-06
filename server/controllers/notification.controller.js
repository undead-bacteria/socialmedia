const NotificationService = require("../services/notification.service");

const addNotification = async (req, res, next) => {
  try {
    const { type, postId, email, value } = req.body;
    const { statusCode, response } = await NotificationService.addNotification(
      type,
      postId,
      email,
      value
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { statusCode, response } = await NotificationService.getNotifications(
      email
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNotification,
  getNotifications,
};
