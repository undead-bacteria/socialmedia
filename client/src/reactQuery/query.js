import { config } from "../config/config";
import { getAccessToken } from "../utils/helper";
import axios from "axios";

export const fetchSavedPosts = async (body) => {
  const { data } = await axios.post(config.urls.post.getSavedPosts(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return data.data;
};

export const fetchComments = async (body) => {
  const { data } = await axios.post(config.urls.comment.getComments(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return data.data;
};

export const fetchNotifications = async (body) => {
  const { data } = await axios.post(
    config.urls.notification.getNotifications(),
    body,
    {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    }
  );
  return data.data;
};
