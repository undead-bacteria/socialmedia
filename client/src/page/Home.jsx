import React from "react";
import CreatePost from "../component/CreatePost";
import { Box } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <CreatePost />;
    </Box>
  );
};

export default Home;
