const PostService = require("../services/post.service");

const createPost = async (req, res, next) => {
  try {
    const { statusCode, response } = await PostService.createPost(
      req.body,
      req.files
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { statusCode, response } = await PostService.getUserPosts(email);
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { email, postId } = req.body;
    const { statusCode, response } = await PostService.deletePost(
      email,
      postId
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const getSavedPosts = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { statusCode, response } = await PostService.getSavedPosts(email);
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// gets all posts that user liked or saved
const getAllPosts = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { statusCode, response } = await PostService.getAllPosts(email);
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const { email, postId, like } = req.body;
    const { statusCode, response } = await PostService.likePost(
      email,
      postId,
      like
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const addSavedPost = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { statusCode, response } = await PostService.addSavedPost(
      email,
      postId,
      saved
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const hidePost = async (req, res, next) => {
  try {
    const { email, postId, hide } = req.body;
    const { statusCode, response } = await PostService.hidePost(
      email,
      postId,
      hide
    );
    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  deletePost,
  getUserPosts,
  getSavedPosts,
  getAllPosts,
  likePost,
  addSavedPost,
  hidePost,
};
