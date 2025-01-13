import React from "react";
import {
  Box,
  Typography,
  Divider,
  Card,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "react-query";
import { fetchNotifications } from "../reactQuery/query";
import { useSelector } from "react-redux";
import UserAvatar from "../component/UserAvatar";

const Notifications = () => {
  const auth = useSelector((state) => state.auth.user);

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => fetchNotifications({ email: auth.email }),
    queryKey: ["notifications"],
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography
        sx={{ color: "var(--grayTitle)", fontSize: "4rem", opcaity: "0.3" }}
      >
        Notifications
      </Typography>

      <Card sx={{ padding: "1rem" }}>
        {data.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "2rem",
              mb: "1.8rem",
            }}
          >
            <Typography sx={{ fontSize: "1.5rem" }}>
              You have no notifications.
            </Typography>
          </Box>
        ) : (
          data.map((item) => {
            return (
              <div key={item.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <UserAvatar name={item.name} avatar={item.avatar} />
                  <Typography>
                    <b>{item.name}</b>
                    {item.message}
                  </Typography>
                </Box>
                <Divider sx={{ mb: "1rem", mt: "1rem" }} />
              </div>
            );
          })
        )}
      </Card>
    </Box>
  );
};

export default Notifications;
