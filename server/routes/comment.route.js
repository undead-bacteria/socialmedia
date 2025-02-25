const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");
const CommentController = require("../controllers/comment.controller");

router.post("/", checkAuth, CommentController.getComments);
router.post("/add-comment", checkAuth, CommentController.addComment);
router.post("/delete-comment", checkAuth, CommentController.deleteComment);

module.exports = router;
