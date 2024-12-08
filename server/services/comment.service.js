const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const PostService = require("./post.service");
const { response } = require("express");

const getUserName = async (id) => {
  const user = await User.findById(id).select({ name: 1 });
  return user.name;
};

const addComment = async (email, postId, message) => {
  try {
    const user = await User.findOne({ email: email }).select({ _id: 1 });
    const post = await Post.findById(postId);

    const comment = new Comment({ message, createdBy: user._id, post });

    await comment.save();

    post.commentCount = (post.commentCount || 0) + 1;

    await post.save();

    return {
      statusCode: 200,
      response: {
        success: true,
        message: "Comment added",
        notification: {
          value: true,
          message: "Comment added",
        },
      },
    };
  } catch (error) {
    console.log("Error while adding comment", e);
  }
};

const getComments = async (postId) => {
  try {
    let comments = await Comment.find({ post: postId }).sort({ createdAt: -1 });

    comments = await Promise.all(
      comments.map(async (item) => {
        const user = await User.findById(item.createdBy).select({
          name: 1,
          profileImage: 1,
        });

        return {
          id: item._id,
          message: item.message,
          time: PostService.postCreationTime(item.createdAt),
          name: user ? user.name : "Unknown User",
          avatar: user ? user.profileImage : "default-avatar.jpg",
        };
      })
    );

    return {
      statusCode: 200,
      response: {
        success: true,
        data: comments,
        notification: { value: false },
      },
    };
  } catch (error) {
    console.log("Error while fetching comments", e);
  }
};

const deleteComment = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return {
        statusCode: 404,
        response: { success: false, message: "Comment not found" },
      };
    }
    await comment.deleteOne();

    return {
      statusCode: 200,
      response: { success: true, message: "Comment deleted" },
    };
  } catch (error) {
    console.log("Error while deleting comment", e);
  }
};

module.exports = {
  getUserName,
  addComment,
  deleteComment,
  getComments,
};
