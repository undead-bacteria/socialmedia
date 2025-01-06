import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Home from "./page/Home";
import Profile from "./page/Profile";

function App() {
  const auth = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.loader.isLoading);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => console.log("auth", auth), [auth]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
