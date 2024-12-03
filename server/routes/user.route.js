const { Router } = require("express");
const router = Router();

const UserController = require("../controllers/user.controller");
const extractUserFromToken = require("../middlewares/extractUserFromToken");

router.use(extractUserFromToken);

router.get("/me", UserController.getUserInfo);
router.get("/getFriends", UserController.getFriends);
router.get("/photos/:email", UserController.getPhotos);
router.post("/addFriends", UserController.addFriend);
router.post("/profile/updateText", UserController.getUserProfileText);
router.post("/profile/updateImage", UserController.getUserProfileImage);

module.exports = router;