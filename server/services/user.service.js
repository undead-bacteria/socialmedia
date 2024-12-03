const User = require("../models/user.model");
const Post = require("../models/post.model");
const path = require("path");
const { removeFile } = require("./post.service");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

// cloudinary configuration
cloudinary.config({
  cloud_name: "",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// utility function to handle errors
const handleError = (message, statusCode = 500) => {
  return {
    statusCode,
    response: {
      success: false,
      message,
      notification: { value: true, message },
    },
  };
};

// calculate mutual friends between 2 arrays
const calculateMutualFriends = (array1, array2) => {
  const set1 = new Set(array1.map(String));
  const set2 = new Set(array2.map(String));

  let count = 0;

  // Iterate through set1 and count the common elements in set2
  for (let element of set1) {
    if (set2.has(element)) {
      count++;
    }
  }

  return count;
};

// get user info by email
const getUserInfo = async (email) => {
  try {
    const user = await User.findOne({ email }).select({
      description: 1,
      location: 1,
      name: 1,
      profileImage: 1,
      coverImage: 1,
    });
    if (!user) return handleError("User not found", 404);

    return {
      statusCode: 200,
      response: {
        success: true,
        data: user,
        notification: { value: false },
      },
    };
  } catch (e) {
    console.error("Error fetching user info:", e);
    return handleError("An error occurred while fetching user info");
  }
};

// add or remove friends
const addFriend = async (email, friendId, add) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return handleError("User not found", 404);

    const friend = await User.findById(friendId);
    if (!friend) return handleError("Friend does not exist", 400);

    const friendIndex = user.friends.indexOf(friendId);

    if (add) {
      if (friendIndex === -1) {
        user.friends.unshift(friendId);
        await user.save();

        return {
          statusCode: 200,
          response: {
            success: true,
            message: "Friend added",
            data: user.friends,
            notification: { value: true, message: "Your friend is added" },
          },
        };
      }

      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Already friends",
          data: user.friends,
          notification: { value: false },
        },
      };
    } else {
      if (friendIndex >= 0) {
        user.friends.splice(friendIndex, 1);
        await user.save();

        return {
          statusCode: 200,
          response: {
            success: true,
            message: "Friend removed",
            data: user.friends,
            notification: { value: true, message: "Your friend is removed" },
          },
        };
      }

      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Already unfollowed",
          data: user.friends,
          notification: { value: false },
        },
      };
    }
  } catch (e) {
    console.error("Error adding/removing friend:", e);
    return handleError("An error occurred while adding/removing friend");
  }
};

// get user's friends and calculate mutual friends
const getFriends = async (email) => {
  try {
    const user = await User.findOne({ email }).populate(
      "friends",
      "name profileImage friends"
    );
    if (!user) return handleError("User not found", 404);

    const friends = user.friends.map((friend) => ({
      name: friend.name,
      avatar: friend.profileImage,
      mutualFriends: calculateMutualFriends(user.friends, friend.friends),
    }));

    return {
      statusCode: 200,
      response: {
        success: true,
        data: friends,
        notification: { value: false },
      },
    };
  } catch (e) {
    console.error("Error fetching friends:", e);
    return handleError("An error occurred while fetching friends");
  }
};

// get user's photos
const getPhotos = async (email) => {
  try {
    const user = await user.findOne({ email });
    if (!user) return handleError("User not found", 404);

    const posts = await Post.find({ createdBy: user._id })
      .sort({ createdAt: -1 })
      .select("images");
    const images = posts.flatMap((post) => post.images);

    return {
      statusCode: 200,
      response: {
        success: true,
        data: images,
        notification: { value: false },
      },
    };
  } catch (e) {
    console.error("Error fetching photos:", e);
    return handleError("An error occurred while fetching photos");
  }
};

// update profile text (name, location, description)
const updateProfileText = async (email, location, name, description) => {
  try {
    const user = await user.findOne({ email });
    if (!user) return handleError("User not found", 404);

    user.location = location;
    user.name = name;
    user.description = description;
    await user.save();

    return {
      statusCode: 200,
      response: {
        success: true,
        message: "Profile updated successfully.",
        notification: { value: true, message: "Profile updated successfully." },
      },
    };
  } catch (e) {
    console.error("Error updating profile text:", e);
    return handleError("An error occurred while updating profile text");
  }
};

// update profile image (cover or profile)
const updateProfileImage = async (email, imageType, files) => {
  try {
    const user = await user.findOne({ email });
    if (!user) return handleError("User not found", 404);

    const file = files[0];
    const imagePath = path.join("./uploads", file.filename);
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      public_id: file.filename,
    });
    removeFile(file.filename);

    if (imageType === "cover") {
      user.coverImage = uploadResult.url;
    } else if (imageType === "profile") {
      user.profileImage = uploadResult.url;
    }

    await user.save();

    return {
      statusCode: 200,
      response: {
        success: true,
        message: "Profile image updated successfully.",
        notification: {
          value: true,
          message: "Profile image updated successfully.",
        },
      },
    };
  } catch (e) {
    console.error("Error updating profile image:", e);
    return handleError("An error occurred while updating profile image");
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
