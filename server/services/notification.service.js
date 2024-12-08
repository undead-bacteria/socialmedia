const User = require("../models/user.model");
const Post = require("../models/post.model");
const Notification = require("../models/notification.model");
const { getUserName } = require("./comment.service");
const { postCreationTime } = require("./post.service");

const addNotification = async (type, postId, email, value) => {
  console.log("type", type);
  console.log("postId", postId);
  console.log("email", email);

  try {
    const user = await User.findOne({ email: email }).select({ _id: 1 });
  } catch (error) {
    console.log("Error while adding notification", error);
  }
};
