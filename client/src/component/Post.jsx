import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  ImageList,
  ImageListItem,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  likePost,
  addComment,
  addNotification,
  addFriend,
} from "../reactQuery/mutation";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "react-query";
import PostOptions from "./PostOptions";
import Comment from "./Comment";
import UserAvatar from "./UserAvatar";
import { fetchComments } from "../reactQuery/query";

const Post = ({
  name,
  content,
  imageData,
  time,
  postId,
  saved,
  owner,
  hide,
  pageName,
  likeBoolean,
  likeCount,
  commentMessageCount = 0,
  friend,
  createdBy,
}) => {
  const [option, setOption] = useState(false);
  const [like, setLike] = useState(likeBoolean);
  const [count, setCount] = useState(likeCount);
  const [commentCount, setCommentCount] = useState(commentMessageCount);
  const [openComment, setOpenComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const [friendStatus, setFriendStatus] = useState(friend);

  const auth = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();

  const notificationMutation = useMutation({
    mutationFn: (body) => addNotification(body),
    onSuccess: () => {
      console.log("Notification mutation success");
    },
  });

  const likeMutation = useMutation({
    mutationFn: (body) => likePost(body),
    onSuccess: async (body) => {
      console.log("Like mutation success:", body);

      if (!owner) {
        notificationMutation.mutate({
          type: "like",
          postId: body.postId,
          email: auth.email,
          value: body.like,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: ["userPosts"],
        refreshType: "all",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (body) => addComment(body),
    onMutate: async (body) => {
      setCommentCount((old) => Number(old) + 1);
      queryClient.setQueriesData(["comments", postId], (oldData) => {
        const newData = [
          {
            name: auth.name,
            time: "0 second ago",
            message: body.message,
            avatar: auth.avatar,
            id: Math.floor(Math.random() * 90000) + 10000,
          },
          ...oldData,
        ];
        return newData;
      });
    },
    onSuccess: async (body) => {
      console.log("comment mutation success");
      await queryClient.invalidateQueries(["comments", postId]);
      console.log("comment", body);

      if (!owner) {
        notificationMutation.mutate({
          type: "comment",
          postId: body.postId,
          email: auth.email,
          value: body.comment,
        });
      }
    },
  });

  const friendMutation = useMutation({
    mutationFn: (body) => addFriend(body),
    onSuccess: async (body) => {
      if (!owner) {
        notificationMutation.mutate({
          type: "follow",
          postId: body.postId,
          email: auth.email,
          value: body.add,
        });
      }
      queryClient.setQueriesData(["posts"], (oldData) => {
        const newData = oldData.map((item) => {
          if (body.friendId === item.createdBy) {
            item.friend = body.add;
            item.new = "new";
          }
          return item;
        });
        return newData;
      });

      queryClient.setQueriesData(["savedPosts"], (oldData) => {
        const newData = oldData.map((item) => {
          if (body.friendId === item.createdBy) {
            item.friend = body.add;
            item.new = "new";
          }
          return item;
        });
        return newData;
      });
    },
  });

  const clickLike = (changeState) => {
    likeMutation.mutate({
      email: auth.email,
      postId: postId,
      like: changeState,
    });
    setLike(changeState);
    changeState
      ? setCount((count) => count + 1)
      : setCount((count) => count - 1);
  };

  const clickFollow = (changeState) => {
    friendMutation.mutate(
      {
        email: auth.email,
        friendId: createdBy,
        add: changeState,
        postId,
      },
      {
        onMutate: () => {
          setFriendStatus(changeState);

          queryClient.setQueryData(
            ["profileFollowingList", auth.email],
            (oldFollowing) => {
              if (changeState) {
                return [...oldFollowing, createdBy];
              } else {
                return oldFollowing.filter(
                  (following) => following !== createdBy
                );
              }
            }
          );
        },
      }
    );
  };

  const clickCommentEnter = () => {
    if (commentMessage !== "") {
      setOpenComment(true);
      setCommentMessage("");
      commentMutation.mutate({
        email: auth.email,
        postId,
        message: commentMessage,
      });
    }
  };

  const { data: comments, isLoading } = useQuery({
    queryFn: () => fetchComments({ postId }),
    queryKey: ["comments", postId],
  });

  useEffect(
    () => {
      if (comments) {
        setCommentCount(comments.length);
      }
      setFriendStatus(friend);
    },
    [comments],
    [friend]
  );

  const dots = [];
  for (let i = 0; i < 3; i++) {
    dots.push(
      <Box
        key={i}
        sx={{
          height: "0.2rem",
          width: "0.2rem",
          borderRadius: "0.2rem",
          backgroundColor: "var(--grayTitle)",
        }}
      ></Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {option && (
        <Box
          sx={{
            position: "absolute",
            top: 60,
            right: -14,
            width: "31%",
            zIndex: 200,
          }}
        >
          <PostOptions
            postId={postId}
            saved={saved}
            owner={owner}
            hide={hide}
            pageName={pageName}
            setOption={setOption}
            otherData={{
              content,
              name,
              imageData,
              time,
              postId,
              saved,
              owner,
              hide,
              pageName,
            }}
          />
        </Box>
      )}
      <Card sx={{ padding: "1.3rem" }} onClick={() => setOption(false)}>
        {/* Title  */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <UserAvatar avatar={auth.avatar} name={auth.name} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography>
                <b>{`${name}`} </b>shared a post.
              </Typography>
              <Typography>{`${time}`} ago.</Typography>
            </Box>
            {!owner && (
              <Typography
                sx={{
                  color: friendStatus ? "var(--grayTitle)" : "var(--blue)",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onClick={() => clickFollow(!friendStatus)}
              >
                {friendStatus ? "Unfollow" : "Follow"}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 0.3,
              cursor: "pointer",
              padding: "0.5rem",
            }}
            onClick={(e) => {
              setOption(!option);
              e.stopPropagation();
            }}
          >
            {dots}
          </Box>
        </Box>
        {/* Content */}
        <Typography
          variant="body1"
          sx={{ mt: "1.5rem", mb: "1.5rem", fontWeight: 400, fontSize: "1rem" }}
        >
          {content}
        </Typography>
        {/* images */}
        {imageData.length > 0 && (
          <ImageList variant="masonry" cols={2} rowHeight={300} gap={5}>
            {imageData.map((item, index) => {
              return (
                <ImageListItem key={index}>
                  <img
                    src={item}
                    alt="loading"
                    loading="lazy"
                    style={{
                      borderRadius: "0.4rem",
                    }}
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        )}
        {/* Like, Comment, Share */}
        <Box sx={{ display: "flex", gap: 5 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {" "}
            {like ? (
              <>
                <FavoriteIcon
                  sx={{ color: "red", borderColor: "black" }}
                  onClick={() => clickLike(false)}
                />
                <Typography>{count}</Typography>
              </>
            ) : (
              <>
                <FavoriteBorderIcon onClick={() => clickLike(true)} />
                <Typography>{count}</Typography>
              </>
            )}
          </Box>
          {/* Comment */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <ChatBubbleOutlineIcon
              onClick={() => setOpenComment((old) => !old)}
            />
            <Typography>{commentCount}</Typography>
          </Box>
        </Box>
        {/* Comment text */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "2rem" }}>
          <UserAvatar avatar={auth.avatar} name={auth.name} />
          <TextField
            placeholder="Leave a Comment"
            variant="outlined"
            fullWidth
            InputProps={{
              style: {
                borderRadius: "2rem",
              },
              endAdornment: (
                <InputAdornment position="start">
                  <ArrowRightIcon
                    sx={{ fontSize: "3rem", cursor: "pointer" }}
                    onClick={() => clickCommentEnter()}
                  />
                </InputAdornment>
              ),
            }}
            value={commentMessage}
            onChange={(e) => setCommentMessage(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();

                if (commentMessage !== "") {
                  setOpenComment(true);
                  setCommentMessage("");
                  commentMutation.mutate({
                    email: auth.email,
                    postId,
                    message: commentMessage,
                  });
                }
              }
            }}
          />
        </Box>
        {/* Comment List */}
        <Box sx={{ mt: "2rem", display: openComment ? "block" : "none" }}>
          <Comment
            postId={postId}
            setCommentCount={setCommentCount}
            postOwnerId={createdBy}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default Post;
