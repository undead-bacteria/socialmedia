import React from "react";
import { Box, Typography, Card } from "@mui/material";
import Post from "../component/Post";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { fetchSavedPosts } from "../reactQuery/query";
import Loading from "../component/Loading";

const SavedPosts = () => {
  const auth = useSelector((state) => state.auth.user);

  const { data, isLoading } = useQuery({
    queryFn: () => fetchSavedPosts({ email: auth.email }),
    queryKey: ["savedPosts"],
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box>
      <Typography
        sx={{ color: "var(--grayTitle)", fontSize: "2rem", opcaity: "0.3" }}
      >
        SavedPosts
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {data.length === 0 ? (
          <Card sx={{ padding: "1rem", pt: "0" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "2.5rem",
                mb: "1.8rem",
              }}
            >
              <Typography sx={{ fontSize: "1.5rem" }}>
                You have no saved posts.
              </Typography>
            </Box>
          </Card>
        ) : (
          data.map((post) => {
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
                commentCount={post.commentCount}
                avatar={post.avatar}
                friend={post.friend}
                createdBy={post.createdBy}
                pageName={"savePost"}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default SavedPosts;
