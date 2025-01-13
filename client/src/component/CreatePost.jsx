import { Box, Button, Card, TextField } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import { config } from "../config/config";
import { notify } from "../utils/notify";
import { getAccessToken } from "../utils/helper";
import UserAvatar from "./UserAvatar";
import axios from "axios";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const auth = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const createPostRequest = async (body) => {
    const res = await axios.post(config.urls.post.createPost(), body, {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
        "Content-Type": "multipart/formdata",
      },
    });
  };

  const mutation = useMutation({
    mutationFn: (body) => createPostRequest(body),
    onSuccess: async (data) => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["userPost"]);
      queryClient.invalidateQueries(["savedPosts"]);
    },
  });

  const onShare = () => {
    if (image === null && content === "") {
      notify("error", "Write something or attach a photo");
      return;
    }

    var formData = new FormData();

    image?.map((item) => {
      formData.append("images", item);
    });

    formData.append("email", auth.email);
    formData.append("content", content);

    const post = formData;
    mutation.mutate(post);
    setContent("");
    setImage(null);
  };

  return (
    <Card sx={{ padding: "1rem", fontWeight: 300 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <UserAvatar name={auth.name} avatar={auth.avatar} />
        <TextField
          value={content}
          placeholder={`What's on your mind, ${auth.name} ?`}
          multiline
          variant="outlined"
          fullWidth
          minRows={2}
          maxRows={10}
          resize="both"
          sx={{
            resize: "both",
            overflow: "auto",
            textarea: {
              resize: "both",
            },
          }}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          mt: "1rem",
          rowGap: 4,
          columnGap: 4,
          flexWrap: "wrap",
        }}
      >
        {image &&
          image.map((item) => {
            return (
              <Box>
                <img
                  style={{ borderRadius: "1rem" }}
                  alt="not found"
                  width={"160px"}
                  src={URL.createObjectURL(item)}
                />
                <br />

                <CancelIcon
                  sx={{ alignSelf: "start" }}
                  onClick={() => {
                    setImage((prevState) => {
                      return prevState.filter(
                        (image) => image.name !== item.name
                      );
                    });
                  }}
                />
              </Box>
            );
          })}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "1rem",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: flex, alignItems: "center", gap: 0.4 }}>
            <label
              htmlFor="image-upload"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: "1.7rem" }} />
              <span>Photos</span>
            </label>
            <input
              type="file"
              id="image-upload"
              style={{ display: "none" }}
              name="myImage"
              accept="image/*"
              multiple
              onChange={(event) => {
                setImage(Object.values(event.target.files));
              }}
            />
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "var(--blue)",
            fontSize: "0.95rem",
            paddingX: "1.5rem",
          }}
          onChange={onShare}
        >
          Share
        </Button>
      </Box>
    </Card>
  );
};

export default CreatePost;
