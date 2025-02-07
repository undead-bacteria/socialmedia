const User = require("../models/user.model");
const Post = require("../models/post.model");
const fs = require("fs");
const path = require("path");

const cloudinary = require("../config/cloudinaryConfig");

const postCreationTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const secondsDifference = diff / 1000;
  const minutesDifference = secondsDifference / 60;
  const hoursDifference = minutesDifference / 60;
  const daysDifference = hoursDifference / 24;
  const weeksDifference = daysDifference / 7;
  const monthsDifference = weeksDifference / 30;
  const yearsDifference = monthsDifference / 365;

  const formatTimeUnit = (value, unit) => {
    const roundedValue = Math.floor(value);
    return `${roundedValue} ${unit}${roundedValue === 1 ? "" : "s"}`;
  };

  if (yearsDifference >= 1) return formatTimeUnit(yearsDifference, "year");
  else if (monthsDifference >= 1)
    return formatTimeUnit(monthsDifference, "month");
  else if (weeksDifference >= 1) return formatTimeUnit(weeksDifference, "week");
  else if (hoursDifference >= 1) return formatTimeUnit(hoursDifference, "hour");
  else if (minutesDifference >= 1)
    return formatTimeUnit(minutesDifference, "minute");
  else return formatTimeUnit(secondsDifference, "second");
};

const removeFile = (filename) => {
  // use fs.unlink to delete the file synchronously
  const filePath = path.join("./uploads/", filename);
  try {
    fs.unlinkSync(filePath);
    console.log("File successfully deleted!");
  } catch (err) {
    console.error(`Error deleting the file: ${err.message}`);
  }
};

const isUserOwner = (userId, postId) => {
  return String(userId) === String(postId);
};

const isUserFriend = (arrayOfFriends, friendId) => {
  return arrayOfFriends.includes(friendId);
};

const hasUserLiked = (arrayofLikes, userId) => {
  return arrayofLikes.includes(userId);
};

const createPost = async (body, file) => {
  const { email, content } = body;

  try {
    const user = await User.findOne({ email: email }).select({ _id: 1 });

    // upload the images to cloudinary and collect their urls
    const images = await Promise.all(
      file.map(async (item) => {
        try {
          const postImage = await cloudinary.uploader.upload(
            path.join("./uploads", item.filename),
            {
              public_id:
                process.env.NODE_ENV === "production"
                  ? "socialMedia_Prod/" + item.filename
                  : item.filename,
            }
          );

          removeFile(item.filename);

          // Return the uploaded image URL
          return postImage.url;
        } catch (error) {
          console.log("Image upload error", error);
          return null;
        }
      })
    );

    // Prepare the post object
    const post = {
      content,
      createdBy: user,
      images: images.filter((image) => image !== null),
    };

    const newPost = new Post(post);
    const res = await newPost.save();

    return {
      statusCode: 200,
      response: {
        success: true,
        message: "New post is created",
        data: res,
        notification: {
          value: true,
          message: "New post is created",
        },
      },
    };
  } catch (e) {
    console.log("Error in creating post:", e);
    return {
      statusCode: 500,
      response: {
        success: false,
        message: "Failed to create post",
        error: e.message || "Unknown error",
      },
    };
  }
};

const deletePost = async (email, postId) => {
  try {
    const user = await User.findOne({ email: email }).select({ _id: 1 });

    const userId = user._id;
    const post = await Post.findById(postId);
    if (!post)
      return {
        statusCode: 400,
        response: {
          success: false,
          message: "Post doesn't exist",
          notification: {
            value: true,
            message: "Post doesn't exist",
          },
        },
      };

    if (String(userId) !== String(post.createdBy))
      return {
        statusCode: 400,
        response: {
          success: false,
          message: "Post is not created by user",
          notification: {
            value: true,
            message: "Post is not created by user",
          },
        },
      };

    await post.deleteOne();

    return {
      statusCode: 200,
      response: {
        success: true,
        message: "Post is deleted",
        notification: {
          value: true,
          message: "Post is deleted",
        },
      },
    };
  } catch (e) {
    console.log("error", e);
    return {
      statusCode: 500,
      response: {
        success: false,
        message: "An error occurred while deleting the post",
        notification: {
          value: true,
          message: "An error occurred while deleting the post",
        },
      },
    };
  }
};

const getUserPosts = async (email) => {
  try {
    const user = await User.findOne({ email: email }).select({
      _id: 1,
      name: 1,
      savedPost: 1,
      friends: 1,
    });
    console.log("user", user);

    let posts = await Post.find({ createdBy: user._id }).sort({
      createdAt: -1,
    });
    posts = await Promise.all(
      posts.map(async (item) => {
        const userAvatar = await User.findById(item.createdBy).select({
          _id: 1,
          name: 1,
          profileImage: 1,
        });

        const savedPosts = user.savedPosts || [];

        return {
          ...item._doc,
          name: userAvatar.name,
          avatar: userAvatar.profileImage,
          postTime: postCreationTime(item._doc.createdAt),
          saved: savedPosts.includes(item._id),
          owner: true,
          like: hasUserLiked(item.likes, user._id),
          likeCount: item.likes.length,
          friend: isUserFriend(user.friends, item.createdBy),
        };
      })
    );

    return {
      statusCode: 200,
      response: {
        success: true,
        data: posts,
        notification: {
          value: false,
        },
      },
    };
  } catch (e) {
    console.log("error", e);
    return {
      statusCode: 500,
      response: {
        success: false,
        message: "An error occurred while fetching user posts",
        notification: {
          value: true,
          message: "An error occurred while fetching user posts",
        },
      },
    };
  }
};

const getSavedPosts = async (email) => {
  try {
    const user = await User.findOne({ email: email }).select({
      _id: 1,
      name: 1,
      savedPosts: 1,
      friends: 1,
    });

    let savedPosts = await Promise.all(
      user.savedPosts.map(async (postId) => {
        let post = await Post.findById(postId);
        if (post) {
          const userAvatar = await User.findById(post.createdBy).select({
            _id: 1,
            name: 1,
            profileImage: 1,
          });

          return {
            ...post._doc,
            name: userAvatar.name,
            avatar: userAvatar.profileImage,
            postTime: postCreationTime(post.createdAt),
            saved: true,
            owner: isUserOwner(user._id, post.createdBy),
            like: hasUserLiked(post.likes, user._id),
            likeCount: post.likes.length,
            friend: isUserFriend(user.friends, post.createdBy),
          };
        }
      })
    );

    savedPosts = savedPosts.filter((item) => item !== null);

    return {
      statusCode: 200,
      response: {
        success: true,
        data: savedPosts,
        notification: {
          value: false,
        },
      },
    };
  } catch (error) {
    console.log("error", e);
    return {
      statusCode: 500,
      response: {
        success: false,
        message: "An error occurred while fetching saved posts",
        notification: {
          value: true,
          message: "An error occurred while fetching saved posts",
        },
      },
    };
  }
};

// gets all posts that user liked or saved or unliked or unsaved or not have friends
const getAllPosts = async (email) => {
  try {
    const user = await User.findOne({ email: email }).select({
      _id: 1,
      name: 1,
      savedPosts: 1,
      friends: 1,
    });

    const savedPosts = user.savedPosts || [];
    let posts = await Post.find().sort({ createdAt: -1 });

    posts = await Promise.all(
      posts.map(async (item) => {
        const userAvatar = await User.findById(item.createdBy).select({
          _id: 1,
          name: 1,
          profileImage: 1,
        });

        return {
          ...item._doc,
          name: userAvatar.name,
          avatar: userAvatar.profileImage,
          postTime: postCreationTime(item.createdAt),
          saved: savedPosts.includes(item._id),
          owner: isUserOwner(user._id, item.createdBy),
          like: hasUserLiked(item.likes, user._id),
          likeCount: item.likes.length,
          friend: isUserFriend(user.friends, item.createdBy),
        };
      })
    );

    posts = posts.filter((item) => !item.hide);

    return {
      statusCode: 200,
      response: {
        success: true,
        data: posts,
        notification: {
          value: false,
        },
      },
    };
  } catch (error) {
    console.log("Error", error);

    return {
      statusCode: 500,
      response: {
        success: false,
        message: "An error occurred while fetching posts",
        notification: {
          value: true,
          message: "An error occurred while fetching posts",
        },
      },
    };
  }
};

const likePost = async (email, postId, like) => {
  const user = await User.findOne({ email: email }).select({ _id: 1 });
  if (!user) {
    return {
      statusCode: 400,
      response: {
        success: false,
        message: "User not found",
        notification: {
          value: true,
          message: "User not found",
        },
      },
    };
  }

  const post = await Post.findById(postId).select({ likes: 1 });
  if (!post) {
    return {
      statusCode: 400,
      response: {
        success: false,
        message: "Post does not exist",
        notification: {
          value: true,
          message: "Post does not exist",
        },
      },
    };
  }

  // Check if user already liked the post
  const userIndex = post.likes.indexOf(user._id);

  if (like) {
    // If the user wants to like the post
    if (userIndex < 0) {
      // User hasn't liked the post yet, so add to likes
      post.likes.unshift(user._id);
      await post.save();

      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Post liked",
          notification: {
            value: true,
            message: "You liked a post",
          },
        },
      };
    } else {
      // User has already liked the post
      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Already liked post",
          notification: {
            value: true,
            message: "Already liked the post",
          },
        },
      };
    }
  } else {
    // If the user wants to unlike the post
    if (userIndex >= 0) {
      // User has liked the post, so remove from likes
      post.likes.splice(userIndex, 1);
      await post.save();

      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Post unliked",
          notification: {
            value: true,
            message: "Post Unliked",
          },
        },
      };
    } else {
      // User has already unliked the post
      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Already unliked post",
        },
      };
    }
  }
};

const addSavedPost = async (email, postId, saved) => {
  const user = await User.findOne({ email: email }).select({
    _id: 1,
    savedPosts: 1,
  });
  const savedPosts = user.savedPosts || [];

  const post = await Post.findById(postId).select({ _id: 1 });
  if (!post)
    return {
      statusCode: 400,
      response: {
        success: false,
        message: "Post does not exist",
        notification: {
          value: true,
          message: "Post does not exist",
        },
      },
    };
  const len = savedPosts.indexOf(postId);

  if (saved) {
    if (len < 0) {
      savedPosts.unshift(postId);
      await user.save();

      return {
        statusCode: 200,
        response: {
          success: true,
          message: "Saved post",
          data: savedPosts,
          notification: {
            value: true,
            message: "Post is saved",
          },
        },
      };
    } else {
      return {
        statusCode: 200,
        response: { success: true, message: "Already saved post" },
      };
    }
  } else {
    if (len >= 0) {
      const index = savedPosts.indexOf(postId);
      savedPosts.splice(index, 1);
      await user.save();

      return {
        statusCode: 200,
        response: { success: true, message: "Unsaved post", data: savedPosts },
      };
    } else {
    }
  }
};

const hidePost = async (email, postId, hide) => {
  const user = await User.findOne({ email: email }).select({
    _id: 1,
  });

  const userId = user._id;
  const post = await Post.findById(postId).select({
    _id: 1,
    createdBy: 1,
    hide: 1,
  });
  if (!post)
    return {
      statusCode: 400,
      response: {
        success: false,
        message: "Post does not exist",
        notification: {
          value: true,
          message: "Post does not exist",
        },
      },
    };
  if (!isUserOwner(userId, post.createdBy))
    return {
      statusCode: 400,
      response: {
        success: false,
        message: "Post is not created by user",
        notification: {
          value: true,
          message: "Post is not created by user",
        },
      },
    };

  post.hide = hide;
  await post.save();

  const message = hide ? "Post is hidden" : "post is visible";
  return {
    statusCode: 200,
    response: {
      success: true,
      message,
      notification: {
        value: true,
        message: message,
      },
    },
  };
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
  removeFile,
};
