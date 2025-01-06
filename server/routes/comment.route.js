const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/comment.controller");

router.post("/", CommentController.getComments);
router.post("/add-comment", CommentController.addComment);
router.delete("/delete-comment", CommentController.deleteComment);

module.exports = router;
