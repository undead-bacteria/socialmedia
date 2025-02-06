const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");

const Notification = require("../controllers/notification.controller");

router.post("/", checkAuth, Notification.getNotifications);
router.post("/add-notification", checkAuth, Notification.addNotification);

module.exports = router;
