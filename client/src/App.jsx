import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Login from "./page/Login";
import SignUp from "./page/Signup";
import Notifications from "./page/Notifications";
import SavedPosts from "./page/SavedPosts";
import { auth as firebaseAuth } from "./config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { config } from "./config/config";
import { getAccessToken } from "./utils/helper";
import Loading from "./component/Loading";
import Navigation from "./component/Navigation";
import axios from "axios";
import { setUser } from "./store/slices/authSlice";
import NoContent from "./component/NoContent";

const ProtectedLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", gap: "1rem" }}>
      <Box sx={{ width: "25%" }}>
        <Navigation />
      </Box>
      <Box sx={{ width: "75%" }}>{children}</Box>
    </Box>
  );
};

function App() {
  const auth = useSelector((state) => state.auth.user);
  const loader = useSelector((state) => state.loader.isLoading);
  const dispatch = useDispatch();
  const [loadingAuth, setLoadingAuth] = useState(true);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const checkAuthState = () => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken(true);
          localStorage.setItem("accessToken", token);

          await delay(2000);

          const { data } = await axios.get(config.urls.user.getUserInfo(), {
            headers: {
              Authorization: "Bearer " + getAccessToken(),
            },
          });

          if (data.data) {
            const globalUser = {
              email: user.email,
              name: data.data.name || user.displayName,
              avatar: data.data.profileImage || user.photoURL || null,
            };
            dispatch(setUser(globalUser));
          }
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        console.error("Error in auth state:", error);
        dispatch(setUser(null));
      } finally {
        setLoadingAuth(false);
      }
    });
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  if (loadingAuth || loader) {
    return <Loading />;
  }

  return (
    <Box>
      {!auth ? (
        <Box sx={{ width: "100%" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Box>
      ) : (
        <ProtectedLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-posts" element={<SavedPosts />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </ProtectedLayout>
      )}
    </Box>
  );
}

export default App;
