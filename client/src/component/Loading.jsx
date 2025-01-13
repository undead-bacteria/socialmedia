import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Backdrop
      sx={{ color: "#0064ff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
