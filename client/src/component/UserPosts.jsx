import React from "react";
import axios from "axios";
import { Box, Card, Typography } from "@mui/material";
import { config } from "../config/config";
import { getAccessToken } from "../utils/helper";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import Post from "../component/Post";

const UserPosts = () => {
  const auth = useSelector((state) => state.auth.user);

  async function fetchUserPosts(body) {
    const { data } = await axios.post(config.urls.post.getUserPosts(), body, {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });

    return data.data;
  }

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => fetchUserPosts({ email: auth.email }),
    queryKey: ["userPosts"],
  });

  if (isLoading) return <Loading />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {data.length === 0 ? (
        <Card sx={{ padding: "1rem" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "1.3rem",
              mb: "1.8rem",
            }}
          >
            <Typography sx={{ fontSize: "1.5rem" }}>
              You have no posts.
            </Typography>
          </Box>
        </Card>
      ) : (
        <>
          {data.map((post) => {
            return (
              <Post
                key={post._id}
                postId={post._id}
                name={post.name}
                time={post.postTime}
                content={post.content}
                imageData={post.images}
                saved={post.saved}
                owner={post.owner}
                hide={post.hide}
                likeBoolean={post.like}
                likeCount={post.likeCount}
                commentMessageCount={post.commentCount}
                avatar={post.avatar}
                pageName={"userPost"}
              />
            );
          })}
        </>
      )}
    </Box>
  );
};

export default UserPosts;
