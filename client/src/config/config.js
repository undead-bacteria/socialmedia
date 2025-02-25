import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import GoogleIcon from "@mui/icons-material/Google";
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
      name: "saved-posts",
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
        return `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
      },
      signUp: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/auth/signup`;
      },
      googleLogin: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
      },
    },

    post: {
      createPost: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/post/create-post`;
      },
      getUserPosts: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/post/get-user-posts`;
      },
      getAllPosts: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/post/get-all-posts`;
      },
      getSavedPosts: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/post/get-saved-posts`;
      },
      hidePost: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/post/hide-post`;
      },
      deletePost: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/post/delete-post`;
      },
      savePost: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/post/save-post`;
      },
      likePost: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/post/like-post`;
      },
    },

    user: {
      getUserInfo: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/user/me`;
      },
      getFriends: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/user/get-friends`;
      },
      getPhotos: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/user/get-photos`;
      },
      updateProfileText: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/user/profile/update-profile-text`;
      },
      updateProfileDescription: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/user/profile/update-profile-description`;
      },
      updateProfileImage: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/user/profile/update-profile-image`;
      },
      addFriend: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/user/add-friend`;
      },
    },

    comment: {
      addComment: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/comment/add-comment`;
      },
      deleteComment: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/comment/delete-comment`;
      },
      getComments: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/comment`;
      },
    },

    notification: {
      addNotification: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/notification/add-notification`;
      },
      getNotifications: () => {
        return `${process.env.REACT_APP_BACKEND_URL}/notification`;
      },
    },
  },
};
