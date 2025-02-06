import React from "react";
import CreatePost from "../component/CreatePost";
import { Box } from "@mui/material";
import Post from "../component/Post";
import { useSelector } from "react-redux";
import axios from "axios";
import { config } from "../config/config";
import Loading from "../component/Loading";
import { getAccessToken } from "../utils/helper";
import { useQuery } from "react-query";

const Home = () => {
  const auth = useSelector((state) => state.auth.user);

  // fetch posts
  async function fetchPosts(body) {
    const { data } = await axios.post(config.urls.post.getAllPosts(), body, {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });
    return data.data;
  }

  const { data, isLoading } = useQuery({
    queryFn: () => fetchPosts({ email: auth.email }),
    queryKey: ["posts"],
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <CreatePost />;
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
            friend={post.friend}
            createdBy={post.createdBy}
            pageName={"allPost"}
          />
        );
      })}
    </Box>
  );
};

export default Home;
