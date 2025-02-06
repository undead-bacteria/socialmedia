import React from "react";
import axios from "axios";
import { Box, Card, Divider, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { config } from "../config/config";
import { getAccessToken } from "../utils/helper";
import { useQuery } from "react-query";
import Loading from "./Loading";
import UserAvatar from "./UserAvatar";

const FriendsTab = () => {
  async function fetchFriends() {
    const { data } = await axios.get(config.urls.user.getFriends(), {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });

    return data.data;
  }

  const { data, isLoading } = useQuery({
    queryFn: () => fetchFriends(),
    queryKey: ["userFriends"],
  });

  if (isLoading) return <Loading />;

  return (
    <Card sx={{ padding: "1rem" }}>
      {data.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "1.3rem",
            mb: "1.8rem",
          }}
        >
          <Typography sx={{ fontSize: "1.5rem" }}>
            You do not follow anyone.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography sx={{ fontSize: "2rem", fontWeight: 500 }}>
            Followers
          </Typography>
          {data.map((item, index) => {
            return (
              <List key={index} sx={{ width: "100%", padding: 0 }}>
                <ListItem sx={{ padding: 0 }}>
                  <ListItemAvatar sx={{ fontSize: "1rem" }}>
                    <UserAvatar name={item.name} avatar={item.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.mutualFriends} Mutual Follower`}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: "1.3rem",
                        fontWeight: 600,
                        mb: 0,
                      },
                      "& .MuiListItemText-secondary": {
                        mt: 0,
                      },
                    }}
                  />
                </ListItem>
                <Divider sx={{ mb: "0.5rem", mt: "0.5rem", opacity: 0.6 }} />
              </List>
            );
          })}
        </>
      )}
    </Card>
  );
};

export default FriendsTab;
