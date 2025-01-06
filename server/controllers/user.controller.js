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
    console.log("Body", req.body);

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
    const { location, name, description } = req.body;
    const user = req.user;

    const { statusCode, response } = await UserService.updateProfileText(
      user.email,
      location,
      name,
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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No imae file uploaded",
      });
    }

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
  updateProfileImage,
};
