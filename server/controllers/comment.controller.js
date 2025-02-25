const CommentService = require("../services/comment.service");
const User = require("../models/user.model");

const addComment = async (req, res, next) => {
  try {
    const { email, postId, message } = req.body;
    const { statusCode, response } = await CommentService.addComment(
      email,
      postId,
      message
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { statusCode, response } = await CommentService.getComments(postId);
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.body;
    const firebaseUid = req.user.uid;
    const user = await User.findOne({ firebaseUid });

    const userId = user._id.toString();

    const { statusCode, response } = await CommentService.deleteComment(
      commentId,
      userId
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments, deleteComment };
