const { Router } = require("express");
const router = Router();
const { imageUpload } = require("../middlewares/imageUpload");

const UserController = require("../controllers/user.controller");
const extractUserFromToken = require("../middlewares/extractUserFromToken");

router.use(extractUserFromToken);

router.get("/me", UserController.getUserInfo);
router.get("/get-friends", UserController.getFriends);
router.get("/photos/:email", UserController.getPhotos);
router.post("/add-friends", UserController.addFriend);
router.post("/profile/update-text", UserController.updateProfileText);
router.post(
  "/profile/update-image",
  imageUpload,
  UserController.updateProfileImage
);

module.exports = router;
