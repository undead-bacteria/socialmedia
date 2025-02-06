import { config } from "../config/config";
import { getAccessToken } from "../utils/helper";
import axios from "axios";

export const deletePost = async (body) => {
  const { data } = await axios.post(config.urls.post.deletePost(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  console.log("Hello", data);
  return data.data;
};

export const hidePost = async (body) => {
  const { data } = await axios.post(config.urls.post.hidePost(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return data.data;
};

export const savePost = async (body) => {
  const { data } = await axios.post(config.urls.post.savePost(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  console.log("Saved", data);
  return data.data;
};

export const likePost = async (body) => {
  const { data } = await axios.post(config.urls.post.likePost(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return data.data;
};

export const updateProfileText = async (body) => {
  const { data } = await axios.post(
    config.urls.user.updateProfileText(),
    body,
    {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    }
  );
  return data.data;
};

export const updateProfileDescription = async (body) => {
  const { data } = await axios.post(
    config.urls.user.updateProfileDescription(),
    body,
    {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    }
  );
  return data.data;
};

export const updateProfileImage = async (body) => {
  const { data } = await axios.post(
    config.urls.user.updateProfileImage(),
    body,
    {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "multipart/formdata",
      },
    }
  );
  return data.data;
};

export const addFriend = async (body) => {
  const { data } = await axios.post(config.urls.post.addFriend(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return data.data;
};

export const addComment = async (body) => {
  const { data } = await axios.post(config.urls.post.addComment(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return data.data;
};

export const addNotification = async (body) => {
  const { data } = await axios.post(config.urls.post.addNotification(), body, {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  return data.data;
};
