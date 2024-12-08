const express = require(express);
const router = express.Router();
const { imageUpload } = require("../middlewares/imageUpload");

const PostController = require("../controllers/post.controller");

router.post("/createPost", imageUpload, PostController.createPost);
router.post("/deletePost", PostController.deletePost);
router.post("/getUserPosts", PostController.getUserPosts);
router.post("/getAllPosts", PostController.getAllPosts);
router.post("/getSavedPosts", PostController.getSavedPosts);
router.post("/savePost", PostController.addSavedPost);
router.post("/likePost", PostController.likePost);
router.post("/hidePost", PostController.hidePost);

module.exports = router;
