const UserService = require("../services/user.service");

const getUserInfo = async (req, res, next) => {
  try {
    const user = req.user;
    const { statusCode, response } = await UserService.getUserInfo(user.email);

    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const addFriend = async (req, res, next) => {
  try {
    const { friendId, add } = req.body;
    const user = req.user;

    const { statusCode, response } = await UserService.addFriend(
      user.email,
      friendId,
      add
    );

    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const getFriends = async (req, res, next) => {
  try {
    const user = req.user;
    const { statusCode, response } = await UserService.getFriends(user.email);

    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const getPhotos = async (req, res, next) => {
  try {
    const user = req.user;
    const { statusCode, response } = await UserService.getPhotos(user.email);

    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const updateProfileText = async (req, res, next) => {
  try {
    const { location, name } = req.body;
    const user = req.user;

    const { statusCode, response } = await UserService.updateProfileText(
      user.email,
      location,
      name
    );

    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const updateProfileDescription = async (req, res, next) => {
  try {
    const { description } = req.body;
    const user = req.user;

    const { statusCode, response } = await UserService.updateProfileDescription(
      user.email,
      description
    );

    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

const updateProfileImage = async (req, res, next) => {
  try {
    const { imageType } = req.body;
    const user = req.user;

    const { statusCode, response } = await UserService.updateProfileImage(
      user.email,
      imageType,
      req.files
    );

    res.status(statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserInfo,
  addFriend,
  getFriends,
  getPhotos,
  updateProfileText,
  updateProfileDescription,
  updateProfileImage,
};
