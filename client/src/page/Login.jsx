import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getAccessToken } from "../utils/helper";
import { config } from "../config/config";
import { auth } from "../config/firebaseConfig";
import axios from "axios";
import { setUser } from "../store/slices/authSlice";
import { setLoading } from "../store/slices/loaderSlice";

import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginRequest = async (body) => {
    const res = await axios.post(config.urls.auth.logIn(), body, {
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
    });
  };

  const handleEmailPasswordLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    dispatch(setLoading(true));

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const idToken = await user.getIdToken();

      const body = {
        name: user.displayName,
        email: user.email,
        idToken: idToken,
      };

      await loginRequest(body);

      const { data } = await axios.get(
        config.urls.user.getUserInfo(user.email),
        {
          headers: {
            Authorization: "Bearer " + getAccessToken(),
          },
        }
      );

      const globalUser = {
        email: user.email,
        name: data?.data?.name !== undefined ? data.data.name : user.name,
        avatar:
          data?.data?.profileImage !== undefined
            ? data.data.profileImage
            : null,
      };

      dispatch(setUser(globalUser));
      localStorage.setItem("accessToken", idToken);
      navigate("/home");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.error("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        console.error("Incorrect password.");
      } else {
        console.error("General login error:", error);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    dispatch(setLoading(true));

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      const signUpBody = {
        name: user.displayName,
        email: user.email,
        profileImage: user.photoURL,
        firebaseUid: user.uid,
        idToken,
      };

      const response = await axios.post(
        config.urls.auth.googleLogin(),
        signUpBody,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.data.success) {
        // Save user to the redux state
        dispatch(
          setUser({
            email: response.data.user.email,
            name: response.data.user.name,
            avatar: response.data.user.profileImage,
          })
        );

        // Optionally save user data to localStorage
        localStorage.setItem("accessToken", idToken);
        navigate("/home");
      } else {
        setError(response.data.message || "Google login failed.");
      }
    } catch (error) {
      console.error("google login error:", error);
      setError(error.message || "An error occurred during Google login.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // css
  const onOutHover = {
    backgroundColor: "var(--blue)",
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
      <Stack direction={"column"} spacing={2} sx={{ mt: "2rem" }}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleEmailPasswordLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>

        {config.loginItems.map((item) => {
          return (
            <div
              key={item.name}
              style={{ cursor: "pointer" }}
              onClick={handleGoogleLogin}
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
                  >{`Continue With ${item.name}`}</Typography>
                </Box>
                <Divider />
              </Box>
            </div>
          );
        })}
        {/* Link to Signup Page */}
        <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Create an account!
          </Typography>
          <Link
            component={RouterLink}
            to="/signup"
            variant="body2"
            sx={{ fontWeight: "bold" }}
          >
            Signup
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Login;
