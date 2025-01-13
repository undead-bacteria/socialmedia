import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { getAccessToken } from "../utils/helper";
import { config } from "../config/config";
import { auth } from "../config/firebaseConfig";
import axios from "axios";
import { setUser } from "../store/slices/authSlice";
import { setLoading } from "../store/slices/loaderSlice";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const Login = () => {
  const dispatch = useDispatch();

  const loginRequest = async (body) => {
    const res = await axios.post(config.urls.auth.logIn(), body, {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });
  };

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();

    dispatch(setLoading(true));
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const body = {
          name: user.displayName,
          email: user.email,
        };

        localStorage.setItem("accessToken", user.accessToken);
        loginRequest(body);

        // call user info
        const { data } = await axios.get(
          config.urls.user.getUserInfo(user.email),
          {
            headers: {
              Authorization: "Bearer " + getAccessToken(),
            },
          }
        );
        console.log("data", data.data);

        const globalUser = {
          email: user.email,
          name: data.data.name !== undefined ? data.data.name : user.name,
          avatar:
            data.data.profileImage !== undefined
              ? data.data.profileImage
              : null,
        };
        console.log("globalUser", globalUser);

        dispatch(setUser(globalUser));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error from signInwithPopup", error);
      });
    dispatch(setLoading(false));
  };

  // css
  const onOutHover = {
    backgrounColor: "var(--blue)",
    borderRadius: "0.5rem",
  };
  const onInsideHover = {
    backgroundColor: "var(--blue)",
    color: "white",
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{ color: "var(--grayTitle)", fontSize: "3rem", opacity: "0.3" }}
      >
        Login
      </Typography>
      <Stack direction={"column"} spacing={0} sx={{ mt: "2rem" }}>
        {config.loginItems.map((item) => {
          return (
            <div
              key={item.name}
              style={{ cursor: "pointer" }}
              onClick={handleLogin}
            >
              <Box
                sx={{
                  paddingX: "1rem",
                  "&:hover": onOutHover,
                  transition: "background 0.5s",
                }}
              >
                <Box
                  sx={{
                    backgrounColor: "white",
                    borderRadius: "0.3rem",
                    padding: "1rem 3.5rem",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": onInsideHover,
                    transition: "background 0.5s",
                  }}
                  gap={1}
                  key={item.name}
                >
                  <Box>{item.icon}</Box>
                  <Typography
                    sx={{ fontWeight: 400 }}
                  >{`Login With ${item.name}`}</Typography>
                </Box>
                <Divider />
              </Box>
            </div>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Login;
