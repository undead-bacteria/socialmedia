import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import { fetchComments } from "../reactQuery/query";
import UserAvatar from "./UserAvatar";

const Comment = ({ postId }) => {
  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => fetchComments({ postId }),
    queryKey: ["comments", postId],
  });

  if (isLoading) {
    return <CircularProgress />;
  }
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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    {item.name}
                  </Typography>
                  <Typography>{item.time}</Typography>
                </Box>
                <Typography>{item.message}</Typography>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default Comment;
