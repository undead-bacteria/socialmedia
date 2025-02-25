import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchComments } from "../reactQuery/query";
import UserAvatar from "./UserAvatar";
import { deleteComment } from "../reactQuery/mutation";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";

const Comment = ({ postId, setCommentCount, postOwnerId }) => {
  const auth = useSelector((state) => state.auth.user);
  console.log(postOwnerId);
  console.log(auth.id);
  const queryClient = useQueryClient();

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => fetchComments({ postId }),
    queryKey: ["comments", postId],
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onMutate: () => {
      setCommentCount((oldCount) => (oldCount > 0 ? oldCount - 1 : 0));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["comments", postId]);

      const comments = await queryClient.getQueryData(["comments", postId]);
      if (comments.length === 0) {
        setCommentCount(0);
      }
    },
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleDeleteClick = (commentId) => {
    deleteCommentMutation.mutate(commentId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxHeight: "30rem",
        overflowY: "auto",
      }}
    >
      {data.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography sx={{ fontSize: "1.4rem" }}>No Comment.</Typography>
        </Box>
      ) : (
        data.map((item) => {
          const isCommenterOrOwner =
            item.id === auth.id || postOwnerId === auth.id;
          return (
            <Box sx={{ display: "flex", gap: 2 }} key={item.id}>
              <UserAvatar name={item.name} avatar={item.avatar} />
              <Box
                sx={{
                  display: "flex",
                  bgcolor: "#d4d4d4",
                  borderRadius: "1.6rem",
                  flexDirection: "column",
                  minWidth: "40%",
                  maxWidth: "80%",
                  padding: "0.7rem",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography> {item.time}</Typography>
                </Box>
                <Typography>{item.message}</Typography>
                {isCommenterOrOwner && (
                  <IconButton
                    onClick={() => handleDeleteClick(item.id)}
                    sx={{
                      position: "absolute",
                      top: "32px",
                      right: "10px",
                      color: "red",
                      borderRadius: "50%",
                      padding: "5px",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default Comment;
