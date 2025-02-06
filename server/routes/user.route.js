const { Router } = require("express");
const router = Router();
const { imageUpload } = require("../middlewares/imageUpload");
const { checkAuth } = require("../middlewares/checkAuth");
const UserController = require("../controllers/user.controller");

router.get("/me", checkAuth, UserController.getUserInfo);
router.get("/get-friends", checkAuth, UserController.getFriends);
router.get("/get-photos/", checkAuth, UserController.getPhotos);
router.post("/add-friends", checkAuth, UserController.addFriend);
router.post(
  "/profile/update-profile-text",
  checkAuth,
  UserController.updateProfileText
);
router.post(
  "/profile/update-profile-description",
  checkAuth,
  UserController.updateProfileDescription
);
router.post(
  "/profile/update-profile-image",
  checkAuth,
  imageUpload,
  UserController.updateProfileImage
);

module.exports = router;
