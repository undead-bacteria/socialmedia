const express = require("express");
const router = express.Router();

const Notification = require("../controllers/notification.controller");

router.post("/", Notification.getNotifications);
router.post("/add-notification", Notification.addNotification);

module.exports = router;
