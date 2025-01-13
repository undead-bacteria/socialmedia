import React from "react";
import { Box, Card, ImageList, ImageListItem, Typography } from "@mui/material";
import useSelector from "react-redux";
import axios from "axios";
import { useQuery } from "react-query";
import Loading from "./Loading";
import { getAccessToken } from "../utils/helper";
import { config } from "../config/config";

const Photos = () => {
  const auth = useSelector((state) => state.auth.user);

  async function fetchPhotos(email) {
    console.log("Url", config.urls.user.getPhotos(email));

    const { data } = await axios.get(config.urls.user.getPhotos(email), {
      headers: { Authorization: "Bearer " + getAccessToken() },
    });

    return data.data;
  }

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => fetchPhotos(auth.email),
    queryKey: ["userPhotos"],
  });

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Card sx={{ padding: "1rem", pt: "0" }}>
      {data.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: "2.5rem",
            mb: "1.8rem",
          }}
        >
          <Typography sx={{ fontSize: "1.5rem" }}>
            You have no photos.
          </Typography>
        </Box>
      ) : (
        <ImageList variant="masonry" cols={2} rowHeight={200} gap={12}>
          {data.map((item, index) => {
            return (
              <ImageListItem key={index}>
                <img
                  src={item}
                  loading="lazy"
                  style={{ borderRadius: "0.4rem" }}
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      )}
    </Card>
  );
};

export default Photos;
