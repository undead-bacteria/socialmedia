const User = require("../models/user.model");
const Post = require("../models/post.model");
const Notification = require("../models/notification.model");
const { getUserName } = require("./comment.service");
const { postCreationTime } = require("./post.service");

const addNotification = async (type, postId, email, value) => {
  try {
    const user = await User.findOne({ email: email }).select({ _id: 1 });

    if (value) {
      const post = await Post.findById(postId);
      const notification = new Notification({
        type,
        postId,
        actionPerformedUser: user,
        postOwnedUser: post.createdBy,
      });

      await notification.save();

      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Notification added",
          notification: {
            value: true,
          },
        },
      };
    } else {
      await Notification.deleteOne({
        type,
        postId,
        actionPerformedUser: user,
      });

      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Notification deleted",
          notification: {
            value: false,
          },
        },
      };
    }
  } catch (error) {
    console.log("Error while adding notification", error);

    return {
      statusCode: 500,
      response: {
        success: false,
        message: "An error occureed while adding the notification",
        notification: {
          value: false,
        },
      },
    };
  }
};

const getNotifications = async (email) => {
  try {
    const user = await User.findOne({ email: email }).select({ _id: 1 });

    let notifications = await Notification.find({
      postOwnedUser: user._id,
    }).sort({ createdAt: -1 });

    notifications = await Promise.all(
      notifications.map(async (item) => {
        const notificationUser = await User.findById(
          item.actionPerformedUser
        ).select({ name: 1, profileImage: 1 });

        const name = notificationUser.name;
        const message =
          item.type === "like"
            ? `liked your post`
            : item.type === "comment"
            ? `commented on your post`
            : `started following you`;

        return {
          type: item.type,
          name,
          message,
          time: postCreationTime(item.createdAt),
          avatar: notificationUser.profileImage,
          id: item.id,
          value: true,
        };
      })
    );

    return {
      statusCode: 200,
      response: {
        success: true,
        data: notifications,
        notification: {
          value: true,
        },
      },
    };
  } catch (error) {
    console.log("Error while getting notification", error);

    return {
      statusCode: 500,
      response: {
        success: false,
        message: "An error occureed while getting the notification",
        notification: {
          value: false,
        },
      },
    };
  }
};

module.exports = {
  addNotification,
  getNotifications,
};
