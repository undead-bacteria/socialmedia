import React from "react";
import { Box, Card, ImageList, ImageListItem, Typography } from "@mui/material";
import axios from "axios";
import { useQuery } from "react-query";
import Loading from "./Loading";
import { getAccessToken } from "../utils/helper";
import { config } from "../config/config";

const Photos = () => {
  async function fetchPhotos() {
    const { data } = await axios.get(config.urls.user.getPhotos(), {
      headers: { Authorization: "Bearer " + getAccessToken() },
    });

    return data.data || [];
  }

  const { data, error, isError, isLoading } = useQuery({
    queryFn: () => fetchPhotos(),
    queryKey: ["userPhotos"],
  });

  if (isLoading) {
    return <Loading />;
  }

  const photoData = Array.isArray(data) ? data : [];

  return (
    <Card sx={{ padding: "1rem", pt: "0" }}>
      {photoData.length === 0 ? (
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
        <ImageList
          variant="masonry"
          cols={3}
          sx={{ width: "100%", height: "auto" }}
        >
          {data.map((item, index) => {
            return (
              <ImageListItem key={index}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%",
                    overflow: "hidden",
                    borderRadius: "0.4rem",
                  }}
                >
                  <img
                    src={item}
                    loading="lazy"
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      height: "50%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </ImageListItem>
            );
          })}
        </ImageList>
      )}
    </Card>
  );
};

export default Photos;
