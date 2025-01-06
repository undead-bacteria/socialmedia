import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import loaderReducer from "./slices/loaderSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
  },
});
