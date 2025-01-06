const express = require("express");
const router = express.Router();
const { imageUpload } = require("../middlewares/imageUpload");

const PostController = require("../controllers/post.controller");

router.post("/create-post", imageUpload, PostController.createPost);
router.delete("/delete-post", PostController.deletePost);
router.post("/get-user-posts", PostController.getUserPosts);
router.post("/get-all-posts", PostController.getAllPosts);
router.post("/get-saved-posts", PostController.getSavedPosts);
router.post("/save-post", PostController.addSavedPost);
router.post("/like-post", PostController.likePost);
router.post("/hide-post", PostController.hidePost);

module.exports = router;
