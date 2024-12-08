const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/comment.controller");

router.post("/", CommentController.getComments);
router.post("/addComment", CommentController.addComment);
router.post("/deleteComment", CommentController.deleteComment);

module.exports = router;
