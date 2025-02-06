import React, { useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { config } from "../config/config";
import { setUser } from "../store/slices/authSlice";
import { removeAccessToken } from "../utils/helper";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [selected, setSelected] = useState(
    location.pathname.split("/")[1] || "home"
  );

  const logout = () => {
    signOut(auth)
      .then(() => {
        removeAccessToken();
        dispatch(setUser(null));
        navigate("/login");
      })
      .catch((error) => {
        console.log("Sign out firebase error", error);
      });
  };

  const onHover = {
    backgroundColor: "rgb(33, 141, 250, 0.2)",
    fontSize: "1.1rem",
  };

  return (
    <Card sx={{ padding: "1rem 1rem", borderRadius: "0.5rem" }} raised>
      <Typography>Navigation</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: "1rem",
          gap: "0.4rem",
        }}
      >
        {config.navBar.map((item) => {
          return (
            <Box
              component="a"
              sx={{
                display: "flex",
                alignContent: "center",
                gap: "0.6rem",
                padding: "0.6rem 1rem",
                width: "100%",
                backgroundColor: selected === item.name && "#218DFA",
                color: selected === item.name && "white",
                borderRadius: "0.5rem",
                zIndex: 1000,
                "&:hover": selected !== item.name && onHover,
              }}
              key={item.title}
              onClick={() => {
                if (item.name === "logout") {
                  logout();
                } else {
                  setSelected(item.name);
                  navigate(`/${item.name}`);
                }
              }}
            >
              {item.icon}
              <Typography
                sx={{
                  fontWeight: 300,
                  font: "inherit",
                }}
              >
                {item.title}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};

export default Navigation;
