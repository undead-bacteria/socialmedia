import React, { useState } from "react";
import {
  Box,
  Divider,
  Stack,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getAccessToken } from "../utils/helper";
import { config } from "../config/config";
import { auth } from "../config/firebaseConfig";
import { notify } from "../utils/notify";
import axios from "axios";
import { setUser } from "../store/slices/authSlice";
import { setLoading } from "../store/slices/loaderSlice";

import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { Link as RouterLink, useNavigate } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpRequest = async (body) => {
    try {
      const res = await axios.post(config.urls.auth.signUp(), body, {
        headers: {
          Authorization: "Bearer " + getAccessToken(),
          "Content-Type": "application/json",
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error during sign up request:", error);
      return { success: false, message: error.message };
    }
  };

  const handleSignUpWithEmail = async () => {
    if (!name || !email || !password) {
      console.error("Name, email, and password are required.");
      return;
    }

    dispatch(setLoading(true));

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send user data to the backend to create the user
      const signUpBody = {
        name,
        email,
        firebaseUid: user.uid,
      };
      const response = await signUpRequest(signUpBody);

      if (response) {
        const { user } = response;

        // Save user to the global store
        dispatch(
          setUser({
            email: user.email,
            name: user.displayName,
            avatar: user.avatar,
          })
        );

        // Optionally save user data to localStorage
        localStorage.setItem("accessToken", idToken);
        notify("success", "User created successfully. Please login.");
        navigate("/home");
      } else {
        console.error("An error occurred.");
        notify("error", "An error occurred.");
      }
    } catch (error) {
      console.error(error.message || "An error occurred during sign up.");
      notify("error", "An error occurred.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    dispatch(setLoading(true));

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const signUpBody = {
        name: user.displayName,
        email: user.email,
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
        localStorage.setItem("accessToken", idToken);
        navigate("/home");
      } else {
        console.error(response.data.message || "Google login failed.");
      }
    } catch (error) {
      console.error(error.message || "An error occurred during Google login.");
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
        height: "70vh",
        flexDirection: "column",
      }}
    >
      <Typography
        sx={{ color: "var(--grayTitle)", fontSize: "3rem", opacity: "0.3" }}
      >
        Sign Up
      </Typography>

      <Stack direction={"column"} spacing={2} sx={{ mt: "2rem" }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
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
          onClick={handleSignUpWithEmail}
          sx={{ mt: 2 }}
        >
          Register
        </Button>

        <Divider sx={{ my: 2 }}>OR</Divider>

        {config.loginItems.map((item) => {
          return (
            <div
              key={item.name}
              style={{ cursor: "pointer" }}
              onClick={handleGoogleSignUp}
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
        {/* Link to Login Page */}
        <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Already have an account?
          </Typography>
          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{ fontWeight: "bold" }}
          >
            Login
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SignUp;
