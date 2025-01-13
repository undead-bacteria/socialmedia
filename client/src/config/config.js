import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import ClearIcon from "@mui/icons-material/Clear";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export const config = {
  navBar: [
    {
      name: "home",
      title: "Home",
      icon: <HomeOutlinedIcon />,
    },
    {
      name: "profile",
      title: "Profile",
      icon: <GroupOutlinedIcon />,
    },
    {
      name: "savedPosts",
      title: "Saved Posts",
      icon: <BookmarkBorderIcon />,
    },
    {
      name: "notifications",
      title: "Notifications",
      icon: <NotificationsNoneIcon />,
    },
    {
      name: "logout",
      title: "Logout",
      icon: <LogoutIcon />,
    },
  ],

  postOptions: [
    {
      name: "unsavePost",
      title: "Unsave post",
      icon: <BookmarkBorderIcon />,
    },
    {
      name: "savePost",
      title: "Save post",
      icon: <BookmarkIcon />,
    },
    {
      name: "hidePost",
      title: "Hide post",
      icon: <ClearIcon />,
    },
    {
      name: "turnNotification",
      title: "Turn notifications",
      icon: <NotificationsActiveIcon />,
    },
    {
      name: "seePost",
      title: "Visible post",
      icon: <RemoveRedEyeIcon />,
    },
    {
      name: "delete",
      title: "Delete",
      icon: <DeleteOutlineIcon />,
    },
  ],

  loginItems: [
    {
      name: "Google",
      icon: <GoogleIcon sx={{ fontSize: "2.5rem" }} />,
    },
    {
      name: "Github",
      icon: <GitHubIcon sx={{ fontSize: "2.5rem" }} />,
    },
  ],

  postInteraction: [
    {
      name: "Like",
      icon: <FavoriteBorderIcon sx={{ fontSize: "2.5rem" }} />,
    },
    {
      name: "Comment",
      icon: <ChatBubbleOutlineIcon sx={{ fontSize: "2.5rem" }} />,
    },
    {
      name: "Share",
      icon: <ShareIcon sx={{ fontSize: "2.5rem" }} />,
    },
  ],

  urls: {
    auth: {
      logIn: () => {
        return `${process.env.BACKEND_URL}/auth/login`;
      },
    },

    post: {
      createPost: () => {
        return `${process.env.BACKEND_URL}/post/create-post`;
      },
      getUserPosts: () => {
        return `${process.env.BACKEND_URL}/post/getUserPosts`;
      },
      getAllPosts: () => {
        return `${process.env.BACKEND_URL}/post/getAllPosts`;
      },
      getSavedPosts: () => {
        return `${process.env.BACKEND_URL}/post/getSavedPosts`;
      },
      hidePost: () => {
        return `${process.env.BACKEND_URL}/post/hidePost`;
      },
      deletePost: () => {
        return `${process.env.BACKEND_URL}/post/deletePost`;
      },
      savePost: () => {
        return `${process.env.BACKEND_URL}/post/savePost`;
      },
      likePost: () => {
        return `${process.env.BACKEND_URL}/post/likePost`;
      },
    },

    user: {
      getUserInfo: () => {
        return `${process.env.BACKEND_URL}/user`;
      },
      getFriends: () => {
        return `${process.env.BACKEND_URL}/user`;
      },
      getPhotos: () => {
        return `${process.env.BACKEND_URL}/user/getPhotos`;
      },
      updateProfileText: () => {
        return `${process.env.BACKEND_URL}/user/updateProfileText`;
      },
      updateProfileImage: () => {
        return `${process.env.BACKEND_URL}/user/profile/updateImage`;
      },
      addFriend: () => {
        return `${process.env.BACKEND_URL}/user/addFriend`;
      },
    },

    comment: {
      addComment: () => {
        return `${process.env.BACKEND_URL}/comment/addComment`;
      },
      getComments: () => {
        return `${process.env.BACKEND_URL}/comment`;
      },
    },

    notification: {
      addNotification: () => {
        return `${process.env.BACKEND_URL}/notification/addNotification`;
      },
      getNotifications: () => {
        return `${process.env.BACKEND_URL}/notification`;
      },
    },
  },
};
