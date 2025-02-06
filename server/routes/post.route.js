const express = require("express");
const router = express.Router();
const { imageUpload } = require("../middlewares/imageUpload");
const { checkAuth } = require("../middlewares/checkAuth");

const PostController = require("../controllers/post.controller");

router.post("/create-post", checkAuth, imageUpload, PostController.createPost);
router.post("/delete-post", checkAuth, PostController.deletePost);
router.post("/get-user-posts", checkAuth, PostController.getUserPosts);
router.post("/get-all-posts", checkAuth, PostController.getAllPosts);
router.post("/get-saved-posts", checkAuth, PostController.getSavedPosts);
router.post("/save-post", checkAuth, PostController.addSavedPost);
router.post("/like-post", checkAuth, PostController.likePost);
router.post("/hide-post", checkAuth, PostController.hidePost);

module.exports = router;
